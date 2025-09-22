import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const RecentActivity = () => {
  const [filter, setFilter] = useState("all");

  const activities = [
    {
      id: 1,
      type: "payment",
      title: "تم استلام دفعة",
      description: "فاتورة #INV-2024-089 - شركة التقنية المتقدمة",
      amount: "15,750 ر.س",
      timestamp: new Date(Date.now() - 300000),
      status: "success",
      icon: "CheckCircle",
    },
    {
      id: 2,
      type: "invoice",
      title: "فاتورة جديدة",
      description: "فاتورة #INV-2024-090 - مؤسسة الابتكار الرقمي",
      amount: "8,200 ر.س",
      timestamp: new Date(Date.now() - 900000),
      status: "info",
      icon: "FileText",
    },
    {
      id: 3,
      type: "overdue",
      title: "فاتورة متأخرة",
      description: "فاتورة #INV-2024-067 - شركة الحلول الذكية (5 أيام)",
      amount: "22,400 ر.س",
      timestamp: new Date(Date.now() - 1800000),
      status: "warning",
      icon: "AlertTriangle",
    },
    {
      id: 4,
      type: "reminder",
      title: "تذكير مرسل",
      description: "تذكير دفع لفاتورة #INV-2024-078",
      amount: "12,300 ر.س",
      timestamp: new Date(Date.now() - 3600000),
      status: "info",
      icon: "Bell",
    },
    {
      id: 5,
      type: "payment",
      title: "دفعة جزئية",
      description: "فاتورة #INV-2024-085 - مركز التدريب المهني",
      amount: "5,000 ر.س من 18,500 ر.س",
      timestamp: new Date(Date.now() - 7200000),
      status: "warning",
      icon: "DollarSign",
    },
    {
      id: 6,
      type: "invoice",
      title: "فاتورة محدثة",
      description: "فاتورة #INV-2024-088 - تم تعديل المبلغ",
      amount: "9,750 ر.س",
      timestamp: new Date(Date.now() - 10800000),
      status: "info",
      icon: "Edit",
    },
  ];

  const filters = [
    { id: "all", label: "الكل", count: activities?.length },
    {
      id: "payment",
      label: "المدفوعات",
      count: activities?.filter((a) => a?.type === "payment")?.length,
    },
    {
      id: "invoice",
      label: "الفواتير",
      count: activities?.filter((a) => a?.type === "invoice")?.length,
    },
    {
      id: "overdue",
      label: "المتأخرة",
      count: activities?.filter((a) => a?.type === "overdue")?.length,
    },
  ];

  const filteredActivities =
    filter === "all"
      ? activities
      : activities?.filter((activity) => activity?.type === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-success bg-success/10";
      case "warning":
        return "text-warning bg-warning/10";
      case "error":
        return "text-error bg-error/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else if (hours < 24) {
      return `منذ ${hours} ساعة`;
    } else {
      return timestamp?.toLocaleDateString("ar-SA");
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              النشاط الأخير
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              آخر التحديثات والمعاملات
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
          >
            تحديث
          </Button>
        </div>

        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {filters?.map((filterOption) => (
            <button
              key={filterOption?.id}
              onClick={() => setFilter(filterOption?.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                filter === filterOption?.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{filterOption?.label}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  filter === filterOption?.id
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {filterOption?.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredActivities?.map((activity, index) => (
          <div
            key={activity?.id}
            className={`p-4 hover:bg-muted/50 transition-smooth cursor-pointer ${
              index !== filteredActivities?.length - 1
                ? "border-b border-border"
                : ""
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-lg ${getStatusColor(activity?.status)}`}
              >
                <Icon name={activity?.icon} size={16} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-card-foreground truncate">
                    {activity?.title}
                  </h4>
                  <span className="text-sm font-semibold text-card-foreground whitespace-nowrap">
                    {activity?.amount}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {activity?.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>

                  <button className="text-xs text-primary hover:text-primary/80 font-medium">
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          iconName="ArrowRight"
          iconPosition="right"
        >
          عرض جميع الأنشطة
        </Button>
      </div>
    </div>
  );
};

export default RecentActivity;
