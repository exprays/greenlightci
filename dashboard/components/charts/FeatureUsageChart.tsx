'use client';

import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

interface FeatureUsageChartProps {
  data: Array<{
    date: string;
    widelyAvailable: number;
    newlyAvailable: number;
    limited: number;
  }>;
  title?: string;
  height?: number;
}

export function FeatureUsageChart({
  data,
  title,
  height = 300,
}: FeatureUsageChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="widelyAvailable" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="newlyAvailable" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="limited" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'MMM d')}
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
            labelFormatter={(value) => format(new Date(value), 'PPP')}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="widelyAvailable"
            stackId="1"
            stroke="#10b981"
            fill="url(#widelyAvailable)"
            name="Widely Available"
          />
          <Area
            type="monotone"
            dataKey="newlyAvailable"
            stackId="1"
            stroke="#f59e0b"
            fill="url(#newlyAvailable)"
            name="Newly Available"
          />
          <Area
            type="monotone"
            dataKey="limited"
            stackId="1"
            stroke="#ef4444"
            fill="url(#limited)"
            name="Limited"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
