import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ScanSubmission } from '@/lib/types';

/**
 * POST /api/scans
 * Submit scan results from GitHub Action or CLI
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ScanSubmission;

    // Validate required fields
    if (!body.project || !body.scan || !body.files) {
      return NextResponse.json(
        { error: 'Missing required fields: project, scan, files' },
        { status: 400 }
      );
    }

    // Check authorization (API key or webhook signature)
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.API_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find or create project
    let project = await prisma.project.findUnique({
      where: {
        owner_repo: {
          owner: body.project.owner,
          repo: body.project.repo,
        },
      },
    });

    if (!project) {
      // Create project without userId for now (public/anonymous)
      // In production, you'd require authentication
      project = await prisma.project.create({
        data: {
          name: body.project.name,
          owner: body.project.owner,
          repo: body.project.repo,
          url: body.project.url,
          description: `Automated tracking for ${body.project.name}`,
          userId: 'system', // System user for automated submissions
        },
      });
    }

    // Create scan with files and features
    const scan = await prisma.scan.create({
      data: {
        projectId: project.id,
        prNumber: body.scan.prNumber,
        branch: body.scan.branch,
        commitSha: body.scan.commitSha,
        triggeredBy: 'action',
        totalFiles: body.scan.totalFiles,
        totalFeatures: body.scan.totalFeatures,
        blockingIssues: body.scan.blockingIssues,
        warnings: body.scan.warnings,
        averageScore: body.scan.averageScore,
        targetYear: body.scan.targetYear,
        blockNewly: body.scan.blockNewly,
        blockLimited: body.scan.blockLimited,
        files: {
          create: body.files.map((file) => ({
            filePath: file.filePath,
            score: file.score,
            issuesCount: file.issuesCount,
            featuresUsed: file.features.length,
          })),
        },
        features: {
          create: body.features.map((feature: any) => ({
            featureId: feature.featureId,
            featureName: feature.featureName,
            status: feature.status,
            severity: feature.severity,
            message: feature.message,
            polyfill: feature.polyfill,
          })),
        },
      },
      include: {
        files: true,
        features: true,
      },
    });

    // Update project stats
    await updateProjectStats(project.id);

    return NextResponse.json({
      success: true,
      scanId: scan.id,
      projectId: project.id,
      message: 'Scan data recorded successfully',
    });
  } catch (error) {
    console.error('Error recording scan:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/scans?projectId=xxx&limit=10
 * Retrieve scan history for a project
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId query parameter is required' },
        { status: 400 }
      );
    }

    const scans = await prisma.scan.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        files: true,
        features: true,
        project: {
          select: {
            name: true,
            owner: true,
            repo: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: scans.length,
      scans,
    });
  } catch (error) {
    console.error('Error fetching scans:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to update project statistics
 */
async function updateProjectStats(projectId: string) {
  const scans = await prisma.scan.findMany({
    where: { projectId },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  if (scans.length === 0) return;

  const avgScore = Math.round(
    scans.reduce((sum: number, scan: any) => sum + scan.averageScore, 0) / scans.length
  );

  const featureCounts = await prisma.featureUsage.groupBy({
    by: ['featureId', 'featureName'],
    where: { scanId: { in: scans.map((s: any) => s.id) } },
    _count: true,
    orderBy: { _count: { featureId: 'desc' } },
    take: 1,
  });

  const mostUsedFeature = featureCounts[0]?.featureName || null;

  // Determine trend (compare last 3 vs previous 3)
  let trendDirection: string | null = null;
  if (scans.length >= 6) {
    const recentAvg = scans.slice(0, 3).reduce((sum: number, s: any) => sum + s.averageScore, 0) / 3;
    const previousAvg = scans.slice(3, 6).reduce((sum: number, s: any) => sum + s.averageScore, 0) / 3;
    trendDirection = recentAvg > previousAvg + 5 ? 'improving' : recentAvg < previousAvg - 5 ? 'declining' : 'stable';
  }

  await prisma.projectStats.upsert({
    where: { projectId },
    update: {
      totalScans: scans.length,
      averageScore: avgScore,
      mostUsedFeature,
      lastScanAt: scans[0]!.createdAt,
      trendDirection,
      updatedAt: new Date(),
    },
    create: {
      projectId,
      totalScans: scans.length,
      averageScore: avgScore,
      mostUsedFeature,
      lastScanAt: scans[0]!.createdAt,
      trendDirection,
    },
  });
}
