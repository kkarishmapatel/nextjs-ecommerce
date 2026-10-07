"use client";

type SalesData = {
  date: string;
  revenue: number;
  orders: number;
};

type SalesChartProps = {
  data: SalesData[];
};

export default function SalesChart({ data }: SalesChartProps) {
  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  return (
    <div className="space-y-4">
      <div className="flex h-64 items-end gap-2">
        {data.map((item) => {
          const height =
            item.revenue > 0
              ? Math.max((item.revenue / maxRevenue) * 100, 5)
              : 2;

          return (
            <div
              key={item.date}
              className="flex flex-1 flex-col items-center justify-end gap-2"
            >
              <div className="text-xs text-gray-500">
                ₹{item.revenue.toLocaleString("en-IN")}
              </div>

              <div
                className="w-full max-w-12 rounded-t bg-gray-900"
                style={{ height: `${height}%` }}
                title={`${item.date}: ₹${item.revenue.toLocaleString(
                  "en-IN",
                )} (${item.orders} orders)`}
              />

              <div className="text-xs text-gray-500">
                {new Date(`${item.date}T00:00:00`).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "short",
                  },
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}