/**
 * Type definitions for the dashboard
 */

// API Request/Response types
export interface ScanSubmission {
  project: {
    owner: string;
    repo: string;
    name: string;
    url: string;
  };
  scan: {
    prNumber?: number;
    branch?: string;
    commitSha?: string;
    totalFiles: number;
    totalFeatures: number;
    blockingIssues: number;
    warnings: number;
    averageScore: number;
    targetYear: string;
    blockNewly: boolean;
    blockLimited: boolean;
  };
  files: Array<{
    filePath: string;
    score: number;
    issuesCount: number;
    features: string[];
  }>;
  features: Array<{
    featureId: string;
    featureName: string;
    status: 'widely' | 'newly' | 'limited';
    severity: 'info' | 'warning' | 'error';
    message?: string;
    polyfill?: string;
  }>;
}

export interface ProjectWithScans {
  id: string;
  name: string;
  owner: string;
  repo: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  scans: Array<{
    id: string;
    averageScore: number;
    blockingIssues: number;
    warnings: number;
    createdAt: Date;
  }>;
}

export interface TrendData {
  date: string;
  score: number;
  features: number;
  issues: number;
}

export interface FeatureStats {
  featureId: string;
  featureName: string;
  count: number;
  status: string;
}

export interface DashboardStats {
  totalProjects: number;
  totalScans: number;
  averageScore: number;
  totalFeatures: number;
  recentScans: Array<{
    id: string;
    projectName: string;
    score: number;
    createdAt: Date;
  }>;
}
