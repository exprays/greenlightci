import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { TrendingUp, Activity, BarChart3, LineChart } from 'lucide-react';

async function getTrends() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/trends?days=30`,
      {
        cache: 'no-store',
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trends:', error);
    return null;
  }
}

export default async function TrendsPage() {
  const session = await getServerSession(authOptions);
  const trends = await getTrends();

  return (
    <DashboardLayout user={session?.user}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trends & Analytics
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track Baseline compatibility trends over time
          </p>
        </div>

        {trends ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Scans
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {trends.summary?.totalScans || 0}
                      </p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Average Score
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {trends.summary?.averageScore || 0}%
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Features
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {trends.summary?.totalFeatures || 0}
                      </p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Issues
                      </p>
                      <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        {trends.summary?.totalIssues || 0}
                      </p>
                    </div>
                    <LineChart className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trend Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Compatibility Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                {trends.trends && trends.trends.length > 0 ? (
                  <div className="space-y-4">
                    {trends.trends.map((day: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {new Date(day.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {day.features || 0} features · {day.issues || 0}{' '}
                            issues
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {day.score || 0}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Score
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <LineChart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No trend data available yet
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Run scans to start tracking trends
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Features */}
            <Card>
              <CardHeader>
                <CardTitle>Most Used Features</CardTitle>
              </CardHeader>
              <CardContent>
                {trends.topFeatures && trends.topFeatures.length > 0 ? (
                  <div className="space-y-3">
                    {trends.topFeatures.map((feature: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {feature.featureName || feature.featureId}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status: {feature.status || 'unknown'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-purple-600">
                            {feature.count || 0}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            uses
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      No feature data available
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No trends data available yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Run your first scan to start tracking compatibility trends
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
