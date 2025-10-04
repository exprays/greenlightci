import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { TrendData, FeatureStats } from '@/lib/types';

/**
 * GET /api/trends?projectId=xxx&days=30
 * Get historical trend data for a project
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const days = parseInt(searchParams.get('days') || '30');

    if (!projectId) {
      return NextResponse.json(
        { error: 'projectId query parameter is required' },
        { status: 400 }
      );
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch scans within date range
    const scans = await prisma.scan.findMany({
      where: {
        projectId,
        createdAt: {
          gte: startDate,
        },
      },
      orderBy: { createdAt: 'asc' },
      include: {
        features: true,
      },
    });

    // Group by date and calculate daily metrics
    const trendData: TrendData[] = [];
    const dateMap = new Map<string, typeof scans>();

    scans.forEach((scan: any) => {
      const dateKey = scan.createdAt.toISOString().split('T')[0]!;
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(scan);
    });

    dateMap.forEach((scansForDay, date) => {
      const avgScore = Math.round(
        scansForDay.reduce((sum: number, s: any) => sum + s.averageScore, 0) / scansForDay.length
      );
      const totalFeatures = scansForDay.reduce((sum: number, s: any) => sum + s.totalFeatures, 0);
      const totalIssues = scansForDay.reduce(
        (sum: number, s: any) => sum + s.blockingIssues + s.warnings,
        0
      );

      trendData.push({
        date,
        score: avgScore,
        features: totalFeatures,
        issues: totalIssues,
      });
    });

    // Get feature usage statistics
    const featureStats = await prisma.featureUsage.groupBy({
      by: ['featureId', 'featureName', 'status'],
      where: {
        scanId: { in: scans.map((s: any) => s.id) },
      },
      _count: true,
      orderBy: {
        _count: {
          featureId: 'desc',
        },
      },
      take: 20,
    });

    const formattedFeatureStats: FeatureStats[] = featureStats.map((stat: any) => ({
      featureId: stat.featureId,
      featureName: stat.featureName,
      status: stat.status,
      count: stat._count,
    }));

    // Calculate summary statistics
    const summary = {
      totalScans: scans.length,
      averageScore: trendData.length > 0
        ? Math.round(trendData.reduce((sum: number, d: any) => sum + d.score, 0) / trendData.length)
        : 0,
      totalFeatures: new Set(scans.flatMap((s: any) => s.features.map((f: any) => f.featureId))).size,
      totalIssues: scans.reduce((sum: number, s: any) => sum + s.blockingIssues + s.warnings, 0),
    };

    return NextResponse.json({
      success: true,
      projectId,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString(),
        days,
      },
      summary,
      trends: trendData,
      topFeatures: formattedFeatureStats,
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/trends/global
 * Get global statistics across all projects
 */
export async function getGlobalTrends() {
  try {
    const totalProjects = await prisma.project.count();
    const totalScans = await prisma.scan.count();

    const recentScans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const averageScore = recentScans.length > 0
      ? Math.round(recentScans.reduce((sum: number, s: any) => sum + s.averageScore, 0) / recentScans.length)
      : 0;

    const topFeatures = await prisma.featureUsage.groupBy({
      by: ['featureId', 'featureName'],
      _count: true,
      orderBy: {
        _count: {
          featureId: 'desc',
        },
      },
      take: 10,
    });

    return {
      totalProjects,
      totalScans,
      averageScore,
      topFeatures: topFeatures.map((f: any) => ({
        featureId: f.featureId,
        featureName: f.featureName,
        count: f._count,
      })),
    };
  } catch (error) {
    console.error('Error fetching global trends:', error);
    throw error;
  }
}
