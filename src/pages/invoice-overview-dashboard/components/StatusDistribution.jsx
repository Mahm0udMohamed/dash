import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Icon from "../../../components/AppIcon";

const StatusDistribution = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const statusData = [
    { name: "مدفوعة", value: 156, color: "#10B981", percentage: 52 },
    { name: "معلقة", value: 89, color: "#F59E0B", percentage: 30 },
    { name: "متأخرة", value: 34, color: "#EF4444", percentage: 11 },
    { name: "مسودة", value: 21, color: "#64748B", percentage: 7 },
  ];

  const totalInvoices = statusData?.reduce((sum, item) => sum + item?.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-interactive">
          <div className="flex items-center space-x-2 mb-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data?.color }}
            />
            <span className="font-medium text-popover-foreground">
              {data?.name}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            العدد: {data?.value} فاتورة ({data?.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "مدفوعة":
        return "CheckCircle";
      case "معلقة":
        return "Clock";
      case "متأخرة":
        return "AlertTriangle";
      case "مسودة":
        return "FileText";
      default:
        return "Circle";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              توزيع حالة الفواتير
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              إجمالي {totalInvoices} فاتورة
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-success">
              <Icon name="TrendingUp" size={16} />
              <span className="text-sm font-medium">+12%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(data) => setSelectedStatus(data?.name)}
                onMouseLeave={() => setSelectedStatus(null)}
              >
                {statusData?.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry?.color}
                    stroke={
                      selectedStatus === entry?.name ? "#ffffff" : "transparent"
                    }
                    strokeWidth={selectedStatus === entry?.name ? 2 : 0}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          {statusData?.map((status, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg transition-smooth cursor-pointer ${
                selectedStatus === status?.name
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              }`}
              onMouseEnter={() => setSelectedStatus(status?.name)}
              onMouseLeave={() => setSelectedStatus(null)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status?.color }}
                  />
                  <Icon
                    name={getStatusIcon(status?.name)}
                    size={16}
                    className="text-muted-foreground"
                  />
                </div>
                <span className="font-medium text-card-foreground">
                  {status?.name}
                </span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-card-foreground">
                  {status?.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {status?.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">معدل التحصيل</span>
            <span className="font-semibold text-success">87.3%</span>
          </div>
          <div className="mt-2 w-full bg-muted rounded-full h-2">
            <div
              className="bg-success h-2 rounded-full transition-smooth"
              style={{ width: "87.3%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDistribution;
