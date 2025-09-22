import React, { useState } from "react";
import Icon from "../AppIcon";
import Button from "./Button";

const Sidebar = ({ isCollapsed = false, onToggle, className = "" }) => {
  const [activeView, setActiveView] = useState("overview");
  const [expandedSection, setExpandedSection] = useState("dashboard");

  const quickViews = [
    {
      id: "overview",
      name: "نظرة عامة",
      icon: "LayoutDashboard",
      description: "عرض شامل للوحة التحكم",
    },
    {
      id: "pending",
      name: "الفواتير المعلقة",
      icon: "Clock",
      description: "في انتظار الدفع",
      count: 12,
    },
    {
      id: "overdue",
      name: "متأخرة",
      icon: "AlertTriangle",
      description: "تجاوزت تاريخ الاستحقاق",
      count: 3,
      urgent: true,
    },
    {
      id: "paid",
      name: "مدفوعة اليوم",
      icon: "CheckCircle",
      description: "المدفوعات الأخيرة",
      count: 8,
    },
  ];

  const analyticalPresets = [
    {
      id: "monthly",
      name: "التحليل الشهري",
      icon: "Calendar",
      description: "مقاييس الشهر الحالي",
    },
    {
      id: "quarterly",
      name: "التقرير الفصلي",
      icon: "TrendingUp",
      description: "أداء الربع الثالث 2024",
    },
    {
      id: "yearly",
      name: "النظرة السنوية",
      icon: "BarChart3",
      description: "السنة الكاملة 2024",
    },
  ];

  const savedFilters = [
    {
      id: "high-value",
      name: "قيمة عالية",
      icon: "DollarSign",
      description: "فواتير > 5,000 ر.س",
      count: 24,
    },
    {
      id: "recurring",
      name: "العملاء المتكررون",
      icon: "Repeat",
      description: "الاشتراكات الشهرية",
      count: 156,
    },
    {
      id: "new-clients",
      name: "عملاء جدد",
      icon: "UserPlus",
      description: "هذا الشهر",
      count: 7,
    },
  ];

  const sections = [
    {
      id: "dashboard",
      name: "عروض الوحة",
      items: quickViews,
    },
    {
      id: "analytics",
      name: "الإحصائيات",
      items: analyticalPresets,
    },
    {
      id: "filters",
      name: "الفلاتر المحفوظة",
      items: savedFilters,
    },
  ];

  const handleViewClick = (viewId) => {
    setActiveView(viewId);
    // Simulate view change with smooth transition
    const event = new CustomEvent("dashboardViewChange", {
      detail: { view: viewId },
    });
    window.dispatchEvent(event);
  };

  const handleSectionToggle = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed right-0 top-16 bottom-0 z-40 bg-card border-l border-border transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } ${className}`}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <h2 className="font-heading font-semibold text-card-foreground">
                الوصول السريع
              </h2>
            )}
            <button
              onClick={handleToggle}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              aria-label={
                isCollapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"
              }
            >
              <Icon
                name={isCollapsed ? "ChevronLeft" : "ChevronRight"}
                size={16}
              />
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {sections?.map((section) => (
                <div key={section?.id} className="mb-4">
                  {!isCollapsed && (
                    <button
                      onClick={() => handleSectionToggle(section?.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span>{section?.name}</span>
                      <Icon
                        name="ChevronDown"
                        size={14}
                        className={`transition-transform duration-200 ${
                          expandedSection === section?.id ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}

                  {(isCollapsed || expandedSection === section?.id) && (
                    <div className="space-y-1">
                      {section?.items?.map((item) => (
                        <button
                          key={item?.id}
                          onClick={() => handleViewClick(item?.id)}
                          className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors group relative ${
                            activeView === item?.id
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted"
                          }`}
                          title={isCollapsed ? item?.name : ""}
                        >
                          <Icon
                            name={item?.icon}
                            size={18}
                            className={item?.urgent ? "text-warning" : ""}
                          />

                          {!isCollapsed && (
                            <div className="flex-1 mr-3 text-right">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {item?.name}
                                </span>
                                {item?.count && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      activeView === item?.id
                                        ? "bg-primary-foreground/20 text-primary-foreground"
                                        : item?.urgent
                                        ? "bg-warning/20 text-warning"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {item?.count}
                                  </span>
                                )}
                              </div>
                              {item?.description && (
                                <p className="text-xs opacity-75 mt-1">
                                  {item?.description}
                                </p>
                              )}
                            </div>
                          )}

                          {isCollapsed && item?.count && (
                            <span
                              className={`absolute -top-1 -left-1 text-xs w-5 h-5 flex items-center justify-center rounded-full ${
                                item?.urgent
                                  ? "bg-warning text-warning-foreground"
                                  : "bg-primary text-primary-foreground"
                              }`}
                            >
                              {item?.count}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border">
            {!isCollapsed ? (
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  iconName="Download"
                  iconPosition="left"
                >
                  تصدير البيانات
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  iconName="Settings"
                  iconPosition="left"
                >
                  التفضيلات
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  className="w-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="تصدير البيانات"
                >
                  <Icon name="Download" size={18} />
                </button>
                <button
                  className="w-full p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                  title="التفضيلات"
                >
                  <Icon name="Settings" size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-pb"
        dir="rtl"
      >
        <div className="flex items-center justify-around px-2 py-3">
          {quickViews?.slice(0, 4)?.map((item) => (
            <button
              key={item?.id}
              onClick={() => handleViewClick(item?.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-md transition-colors min-w-0 ${
                activeView === item?.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon name={item?.icon} size={20} />
                {item?.count && (
                  <span
                    className={`absolute -top-2 -left-2 text-xs w-5 h-5 flex items-center justify-center rounded-full ${
                      item?.urgent
                        ? "bg-warning text-warning-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {item?.count}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium truncate max-w-16">
                {item?.name?.split(" ")?.[0]}
              </span>
            </button>
          ))}
        </div>
        {/* Safe area padding for devices with home indicator */}
        <div className="h-safe-area-inset-bottom"></div>
      </div>
    </>
  );
};

export default Sidebar;
