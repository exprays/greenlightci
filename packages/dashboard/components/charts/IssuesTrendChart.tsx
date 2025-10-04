'use client';

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface IssuesTrendChartProps {
  data: Array<{
    date: string;
    blocking: number;
    warnings: number;
  }>;
  title?: string;
  height?: number;
}

const COLORS = {
  blocking: '#ef4444',
  warnings: '#f59e0b',
};

export function IssuesTrendChart({ data, title, height = 300 }: IssuesTrendChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
          <XAxis
            dataKey="date"
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <YAxis className="text-sm text-gray-600 dark:text-gray-400" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.75rem',
            }}
          />
          <Legend />
          <Bar dataKey="blocking" fill={COLORS.blocking} name="Blocking Issues" radius={[4, 4, 0, 0]} />
          <Bar dataKey="warnings" fill={COLORS.warnings} name="Warnings" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
