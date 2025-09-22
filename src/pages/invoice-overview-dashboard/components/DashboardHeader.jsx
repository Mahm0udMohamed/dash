import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";

const DashboardHeader = () => {
  const [dateRange, setDateRange] = useState("last30");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [lastSync, setLastSync] = useState(new Date());

  const dateRangeOptions = [
    { value: "today", label: "اليوم" },
    { value: "yesterday", label: "أمس" },
    { value: "last7", label: "آخر 7 أيام" },
    { value: "last30", label: "آخر 30 يوم" },
    { value: "last90", label: "آخر 90 يوم" },
    { value: "currentMonth", label: "الشهر الحالي" },
    { value: "lastMonth", label: "الشهر الماضي" },
    { value: "currentQuarter", label: "الربع الحالي" },
    { value: "currentYear", label: "السنة الحالية" },
    { value: "custom", label: "فترة مخصصة" },
  ];

  const statusFilterOptions = [
    { value: "all", label: "جميع الحالات" },
    { value: "paid", label: "مدفوعة" },
    { value: "pending", label: "معلقة" },
    { value: "overdue", label: "متأخرة" },
    { value: "draft", label: "مسودة" },
    { value: "cancelled", label: "ملغية" },
  ];

  const handleRefresh = () => {
    setLastSync(new Date());
    // Simulate data refresh
    console.log("Refreshing dashboard data...");
  };

  const handleExport = () => {
    console.log("Exporting dashboard data...");
  };

  const formatLastSync = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) {
      return "الآن";
    } else if (minutes < 60) {
      return `منذ ${minutes} دقيقة`;
    } else {
      return date?.toLocaleTimeString("ar-SA", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg mb-6">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
              <Icon name="BarChart3" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-card-foreground">
                لوحة معلومات الفواتير
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                نظرة شاملة على أداء الفواتير والإيرادات
              </p>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Date Range Picker */}
            <div className="flex items-center space-x-2">
              <Icon
                name="Calendar"
                size={16}
                className="text-muted-foreground"
              />
              <Select
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
                placeholder="اختر الفترة الزمنية"
                className="min-w-40"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-muted-foreground" />
              <Select
                options={statusFilterOptions}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="تصفية حسب الحالة"
                className="min-w-36"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={handleExport}
              >
                تصدير
              </Button>

              <Button
                variant="ghost"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
                onClick={handleRefresh}
              >
                تحديث
              </Button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 pt-4 border-t border-border space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Sync Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isAutoRefresh ? "bg-success animate-pulse" : "bg-muted"
                }`}
              />
              <span className="text-sm text-muted-foreground">
                آخر تحديث: {formatLastSync(lastSync)}
              </span>
            </div>

            {/* Auto Refresh Toggle */}
            <button
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-micro ${
                isAutoRefresh
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon name={isAutoRefresh ? "Play" : "Pause"} size={12} />
              <span>
                {isAutoRefresh
                  ? "التحديث التلقائي مفعل"
                  : "التحديث التلقائي متوقف"}
              </span>
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} className="text-success" />
              <span className="text-muted-foreground">الإيرادات:</span>
              <span className="font-medium text-success">+12.5%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-warning" />
              <span className="text-muted-foreground">معلقة:</span>
              <span className="font-medium text-warning">89 فاتورة</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={14} className="text-error" />
              <span className="text-muted-foreground">متأخرة:</span>
              <span className="font-medium text-error">34 فاتورة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
