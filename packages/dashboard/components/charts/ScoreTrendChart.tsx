'use client';

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

interface ScoreTrendChartProps {
  data: Array<{
    date: string;
    score: number;
    count?: number;
  }>;
  title?: string;
  height?: number;
}

export function ScoreTrendChart({
  data,
  title,
  height = 300,
}: ScoreTrendChartProps) {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'MMM d')}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <YAxis
            domain={[0, 100]}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.75rem',
            }}
            labelFormatter={(value) => format(new Date(value), 'PPP')}
            formatter={(value: number) => [`${value.toFixed(1)}`, 'Score']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
            name="Compatibility Score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
