import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/**
 * GET /api/projects
 * List all projects with their latest stats
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const userId = searchParams.get('userId'); // Optional: filter by user

    const where = userId ? { userId } : {};

    const projects = await prisma.project.findMany({
      where,
      take: limit,
      orderBy: { updatedAt: 'desc' },
      include: {
        scans: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            averageScore: true,
            blockingIssues: true,
            warnings: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            scans: true,
          },
        },
      },
    });

    // Get stats for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const stats = await prisma.projectStats.findUnique({
          where: { projectId: project.id },
        });

        return {
          ...project,
          stats,
        };
      })
    );

    return NextResponse.json({
      success: true,
      count: projects.length,
      projects: projectsWithStats,
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects/[id]
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

  const stats = await prisma.projectStats.findUnique({
    where: { projectId },
  });

  return {
    ...project,
    stats,
  };
}
