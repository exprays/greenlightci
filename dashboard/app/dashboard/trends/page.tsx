import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { ScoreTrendChart } from '@/components/charts/ScoreTrendChart';
import { FeatureUsageChart } from '@/components/charts/FeatureUsageChart';
import { IssuesTrendChart } from '@/components/charts/IssuesTrendChart';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  TrendingUp,
  Activity,
  BarChart3,
  LineChart,
  Calendar,
  Download,
} from 'lucide-react';

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
        {/* Header with Date Range Selector */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trends & Analytics
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Track Baseline compatibility trends over time
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last 30 days
              </span>
            </div>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {trends ? (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Scans
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {trends.summary?.totalScans || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  {trends.summary?.scansChange && (
                    <p
                      className={`text-sm mt-2 ${trends.summary.scansChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {trends.summary.scansChange >= 0 ? '+' : ''}
                      {trends.summary.scansChange}% from last period
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Avg Score
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {trends.summary?.averageScore?.toFixed(1) || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  {trends.summary?.scoreChange && (
                    <p
                      className={`text-sm mt-2 ${trends.summary.scoreChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {trends.summary.scoreChange >= 0 ? '+' : ''}
                      {trends.summary.scoreChange.toFixed(1)}% from last period
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Features Detected
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {trends.summary?.totalFeatures || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
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
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {trends.summary?.totalIssues || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <LineChart className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  {trends.summary?.issuesChange && (
                    <p
                      className={`text-sm mt-2 ${trends.summary.issuesChange <= 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {trends.summary.issuesChange >= 0 ? '+' : ''}
                      {trends.summary.issuesChange}% from last period
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compatibility Score Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Compatibility Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  {trends.scoreTimeline && trends.scoreTimeline.length > 0 ? (
                    <ScoreTrendChart data={trends.scoreTimeline} height={250} />
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-gray-500">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Feature Usage Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Feature Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {trends.featureTimeline &&
                  trends.featureTimeline.length > 0 ? (
                    <FeatureUsageChart
                      data={trends.featureTimeline}
                      height={250}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-gray-500">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Issues Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Issues Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                  {trends.issuesTimeline && trends.issuesTimeline.length > 0 ? (
                    <IssuesTrendChart
                      data={trends.issuesTimeline}
                      height={250}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-gray-500">
                      No data available
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top Features Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Most Used Features</CardTitle>
                </CardHeader>
                <CardContent>
                  {trends.topFeatures && trends.topFeatures.length > 0 ? (
                    <div className="space-y-3">
                      {trends.topFeatures
                        .slice(0, 8)
                        .map((feature: any, index: number) => (
                          <div
                            key={feature.featureId}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded flex items-center justify-center">
                                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                                  {index + 1}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {feature.featureId}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {feature.count}{' '}
                              {feature.count === 1 ? 'use' : 'uses'}
                            </span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[250px] text-gray-500">
                      No features detected yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
