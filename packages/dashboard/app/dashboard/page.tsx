import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Badge, ScoreBadge } from '@/components/Badge';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  FolderGit2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

async function getDashboardStats() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/stats`,
      {
        cache: 'no-store',
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const stats = await getDashboardStats();

  return (
    <DashboardLayout user={session?.user}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Here's an overview of your Baseline compatibility tracking
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            description="Projects being tracked"
            icon={<FolderGit2 className="w-6 h-6 text-purple-600" />}
          />
          <StatCard
            title="Total Scans"
            value={stats?.totalScans || 0}
            description="Compatibility checks run"
            icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
          />
          <StatCard
            title="Average Score"
            value={`${stats?.averageScore || 0}%`}
            description="Across all projects"
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          />
          <StatCard
            title="Features Tracked"
            value={stats?.totalFeatures || 0}
            description="Unique web features"
            icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
          />
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentScans && stats.recentScans.length > 0 ? (
              <div className="space-y-4">
                {stats.recentScans.map((scan: any) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {scan.projectName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(scan.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      {scan.blockingIssues > 0 && (
                        <Badge variant="error">
                          {scan.blockingIssues} blocking
                        </Badge>
                      )}
                      {scan.warnings > 0 && (
                        <Badge variant="warning">
                          {scan.warnings} warnings
                        </Badge>
                      )}
                      <ScoreBadge score={scan.score} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No scans yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Run your first scan with the GitHub Action or CLI tool
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Getting Started */}
        {(!stats || stats.totalScans === 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    1. Install GitHub Action
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Add GreenLightCI to your repository's workflow
                  </p>
                  <Link
                    href="https://github.com/exprays/greenlightci"
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                  >
                    View documentation →
                  </Link>
                </div>

                <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    2. Use CLI Tool
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Check compatibility locally during development
                  </p>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    npm install -g @greenlightci/cli
                  </code>
                </div>

                <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    3. Track Progress
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Monitor Baseline adoption trends over time
                  </p>
                  <Link
                    href="/dashboard/projects"
                    className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 font-medium"
                  >
                    View projects →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
