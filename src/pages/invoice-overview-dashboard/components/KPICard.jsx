import React from "react";
import Icon from "../../../components/AppIcon";

const KPICard = ({
  title,
  value,
  change,
  changeType,
  icon,
  color = "primary",
  sparklineData = [],
}) => {
  const getChangeColor = () => {
    if (changeType === "positive") return "text-success";
    if (changeType === "negative") return "text-error";
    return "text-muted-foreground";
  };

  const getChangeIcon = () => {
    if (changeType === "positive") return "TrendingUp";
    if (changeType === "negative") return "TrendingDown";
    return "Minus";
  };

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return "bg-success/10 text-success border-success/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "error":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-primary/10 text-primary border-primary/20";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-interactive transition-smooth">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${getColorClasses()}`}>
          <Icon name={icon} size={24} />
        </div>
        {change && (
          <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
            <Icon name={getChangeIcon()} size={16} />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-heading font-bold text-card-foreground">
          {value}
        </h3>
        <p className="text-sm text-muted-foreground font-medium">{title}</p>
      </div>
      {sparklineData?.length > 0 && (
        <div className="mt-4 h-8 flex items-end space-x-1">
          {sparklineData?.map((point, index) => (
            <div
              key={index}
              className={`flex-1 rounded-sm ${
                color === "success"
                  ? "bg-success/30"
                  : color === "warning"
                  ? "bg-warning/30"
                  : color === "error"
                  ? "bg-error/30"
                  : "bg-primary/30"
              }`}
              style={{
                height: `${(point / Math.max(...sparklineData)) * 100}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default KPICard;
