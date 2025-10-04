interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
          {trend && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  trend.value > 0
                    ? 'text-green-600 dark:text-green-400'
                    : trend.value < 0
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {trend.value > 0 ? '+' : ''}
                {trend.value}%
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
