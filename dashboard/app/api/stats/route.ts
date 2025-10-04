import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/stats
 * Get dashboard statistics
 */
export async function GET(request: NextRequest) {
  try {
    const totalProjects = await prisma.project.count();
    const totalScans = await prisma.scan.count();

    // Get recent scans for average score calculation
    const recentScans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        averageScore: true,
        totalFeatures: true,
      },
    });

    const averageScore = recentScans.length > 0
      ? Math.round(recentScans.reduce((sum: number, s: { averageScore: number }) => sum + s.averageScore, 0) / recentScans.length)
      : 0;

    const totalFeatures = await prisma.featureUsage.findMany({
      distinct: ['featureId'],
      select: { featureId: true },
    });

    // Get recent activity
    const recentActivity = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
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
      stats: {
        totalProjects,
        totalScans,
        averageScore,
        totalFeatures: totalFeatures.length,
        recentScans: recentActivity.map((scan: any) => ({
          id: scan.id,
          projectName: scan.project.name,
          score: scan.averageScore,
          blockingIssues: scan.blockingIssues,
          warnings: scan.warnings,
          createdAt: scan.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
