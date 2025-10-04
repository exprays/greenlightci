import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Badge, ScoreBadge } from '@/components/Badge';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { FolderGit2, ExternalLink, TrendingUp, TrendingDown, Minus } from 'lucide-react';

async function getProjects() {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects`, {
      cache: 'no-store',
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  const projects = await getProjects();

  return (
    <DashboardLayout user={session?.user}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'} being tracked
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project: any) => {
              const latestScan = project.scans[0];
              const stats = project.stats;
              
              return (
                <Card key={project.id} hover>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <FolderGit2 className="w-5 h-5 text-purple-600" />
                          <CardTitle>{project.name}</CardTitle>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {project.owner}/{project.repo}
                        </p>
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Latest Scan */}
                    {latestScan ? (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Latest Scan
                          </span>
                          <ScoreBadge score={latestScan.averageScore} />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Issues</span>
                          <div className="flex items-center space-x-2">
                            {latestScan.blockingIssues > 0 && (
                              <Badge variant="error">
                                {latestScan.blockingIssues} blocking
                              </Badge>
                            )}
                            {latestScan.warnings > 0 && (
                              <Badge variant="warning">
                                {latestScan.warnings} warnings
                              </Badge>
                            )}
                            {latestScan.blockingIssues === 0 && latestScan.warnings === 0 && (
                              <Badge variant="success">No issues</Badge>
                            )}
                          </div>
                        </div>

                        {/* Stats */}
                        {stats && (
                          <>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Total Scans</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {stats.totalScans}
                              </span>
                            </div>

                            {stats.trendDirection && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Trend</span>
                                <div className="flex items-center space-x-1">
                                  {stats.trendDirection === 'improving' && (
                                    <>
                                      <TrendingUp className="w-4 h-4 text-green-600" />
                                      <span className="text-green-600 font-medium">Improving</span>
                                    </>
                                  )}
                                  {stats.trendDirection === 'declining' && (
                                    <>
                                      <TrendingDown className="w-4 h-4 text-red-600" />
                                      <span className="text-red-600 font-medium">Declining</span>
                                    </>
                                  )}
                                  {stats.trendDirection === 'stable' && (
                                    <>
                                      <Minus className="w-4 h-4 text-gray-600" />
                                      <span className="text-gray-600 font-medium">Stable</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                            {stats.mostUsedFeature && (
                              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Most Used Feature
                                </p>
                                <Badge variant="info">{stats.mostUsedFeature}</Badge>
                              </div>
                            )}
                          </>
                        )}

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last scanned {new Date(latestScan.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No scans yet
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FolderGit2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No projects yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start tracking your projects by running the GitHub Action or submitting scans via the CLI
              </p>
              <Link
                href="https://github.com/exprays/greenlightci"
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                View Documentation
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
