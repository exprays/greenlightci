import { prisma } from '@/lib/db';

/**
 * Get detailed information for a specific project
 */
export async function getProjectDetails(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      scans: {
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
          features: {
            select: {
              featureId: true,
              featureName: true,
              status: true,
              severity: true,
            },
          },
        },
      },
      _count: {
        select: {
          scans: true,
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Get stats
  const stats = await prisma.projectStats.findUnique({
    where: { projectId },
  });

  return {
    ...project,
    stats,
  };
}

/**
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

