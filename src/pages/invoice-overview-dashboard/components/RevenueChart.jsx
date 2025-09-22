import React, { useState } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RevenueChart = () => {
  const [chartPeriod, setChartPeriod] = useState("6months");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const chartData = [
    { month: "أبريل", invoices: 45, revenue: 125000, target: 120000 },
    { month: "مايو", invoices: 52, revenue: 142000, target: 130000 },
    { month: "يونيو", invoices: 38, revenue: 98000, target: 125000 },
    { month: "يوليو", invoices: 61, revenue: 168000, target: 140000 },
    { month: "أغسطس", invoices: 47, revenue: 135000, target: 135000 },
    { month: "سبتمبر", invoices: 58, revenue: 156000, target: 150000 },
  ];

  const periods = [
    { id: "3months", label: "3 أشهر", icon: "Calendar" },
    { id: "6months", label: "6 أشهر", icon: "CalendarDays" },
    { id: "1year", label: "سنة واحدة", icon: "CalendarRange" },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-interactive">
          <p className="font-medium text-popover-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm text-popover-foreground">
                {entry?.name}:{" "}
                {entry?.name === "الفواتير"
                  ? entry?.value
                  : `${entry?.value?.toLocaleString("ar-SA")} ر.س`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const handleDrillDown = (data) => {
    console.log("Drilling down into:", data);
    // Simulate drill-down functionality
  };

  return (
    <div
      className={`bg-card border border-border rounded-lg ${
        isFullscreen ? "fixed inset-4 z-1000" : ""
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h3 className="text-lg font-heading font-semibold text-card-foreground">
            تحليل الإيرادات والفواتير
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            مقارنة حجم الفواتير مع الإيرادات المحققة
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {periods?.map((period) => (
              <button
                key={period?.id}
                onClick={() => setChartPeriod(period?.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                  chartPeriod === period?.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon name={period?.icon} size={16} />
                <span>{period?.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              تصدير
            </Button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-micro"
            >
              <Icon name={isFullscreen ? "Minimize2" : "Maximize2"} size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className={`p-6 ${isFullscreen ? "h-full" : "h-96"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            onClick={handleDrillDown}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <Bar
              yAxisId="left"
              dataKey="invoices"
              name="الفواتير"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              opacity={0.8}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="الإيرادات (ر.س)"
              stroke="var(--color-success)"
              strokeWidth={3}
              dot={{ fill: "var(--color-success)", strokeWidth: 2, r: 6 }}
              activeDot={{
                r: 8,
                stroke: "var(--color-success)",
                strokeWidth: 2,
              }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="target"
              name="الهدف (ر.س)"
              stroke="var(--color-warning)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {isFullscreen && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 bg-card border border-border rounded-md text-muted-foreground hover:text-foreground transition-micro"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
