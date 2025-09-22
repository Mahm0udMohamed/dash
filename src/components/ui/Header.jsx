import React, { useState } from "react";
import Icon from "../AppIcon";
import Button from "./Button";

const Header = ({ className = "" }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "الرئيسية",
      href: "/invoice-overview-dashboard",
      icon: "LayoutDashboard",
      active: true,
    },
    {
      name: "الفواتير",
      href: "/invoices",
      icon: "FileText",
    },
    {
      name: "الإحصائيات",
      href: "/analytics",
      icon: "BarChart3",
    },
    {
      name: "التقارير",
      href: "/reports",
      icon: "TrendingUp",
    },
  ];

  const moreMenuItems = [
    { name: "الإعدادات", href: "/settings", icon: "Settings" },
    { name: "مركز المساعدة", href: "/help", icon: "HelpCircle" },
    { name: "لوحة الإدارة", href: "/admin", icon: "Shield" },
  ];

  const notifications = [
    {
      id: 1,
      title: "تم دفع الفاتورة #INV-2024-001",
      message: "تم استلام دفعة بقيمة 2,450.00 ر.س",
      time: "منذ دقيقتين",
      type: "success",
      unread: true,
    },
    {
      id: 2,
      title: "دفعة متأخرة",
      message: "الفاتورة #INV-2024-045 متأخرة 5 أيام",
      time: "منذ ساعة",
      type: "warning",
      unread: true,
    },
    {
      id: 3,
      title: "فاتورة جديدة",
      message: "تم إنشاء الفاتورة #INV-2024-089",
      time: "منذ 3 ساعات",
      type: "info",
      unread: false,
    },
  ];

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavClick = (href) => {
    window.location.href = href;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "CheckCircle";
      case "warning":
        return "AlertTriangle";
      case "error":
        return "XCircle";
      default:
        return "Info";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "text-success";
      case "warning":
        return "text-warning";
      case "error":
        return "text-error";
      default:
        return "text-primary";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-1000 bg-card border-b border-border shadow-soft ${className}`}
      dir="rtl"
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
              <Icon name="Receipt" size={24} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-semibold text-foreground">
                تدفق الفواتير
              </h1>
              <p className="text-xs font-caption text-muted-foreground">
                إدارة مالية
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1 space-x-reverse">
          {navigationItems?.map((item) => (
            <button
              key={item?.name}
              onClick={() => handleNavClick(item?.href)}
              className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md text-sm font-medium transition-micro ${
                item?.active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon name={item?.icon} size={18} />
              <span>{item?.name}</span>
            </button>
          ))}

          {/* More Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro">
              <Icon name="MoreHorizontal" size={18} />
              <span>المزيد</span>
            </button>

            {/* Dropdown */}
            <div className="absolute left-0 top-full mt-1 w-48 bg-popover border border-border rounded-md shadow-interactive opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth">
              <div className="py-1">
                {moreMenuItems?.map((item) => (
                  <button
                    key={item?.name}
                    onClick={() => handleNavClick(item?.href)}
                    className="flex items-center space-x-3 space-x-reverse w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-micro"
                  >
                    <Icon name={item?.icon} size={16} />
                    <span>{item?.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3 space-x-reverse">
          {/* Date Range Selector */}
          <div className="hidden md:flex items-center space-x-2 space-x-reverse px-3 py-2 bg-muted rounded-md">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              1 سبتمبر - 22 سبتمبر، 2024
            </span>
          </div>

          {/* Sync Status */}
          <div className="hidden sm:flex items-center space-x-2 space-x-reverse px-3 py-2 bg-success/10 rounded-md">
            <Icon name="RefreshCw" size={14} className="text-success" />
            <span className="text-xs font-medium text-success">مُحدّث</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-micro"
            >
              <Icon name="Bell" size={20} />
              {notifications?.some((n) => n?.unread) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 bg-popover border border-border rounded-md shadow-interactive z-1100">
                <div className="p-4 border-b border-border">
                  <h3 className="font-heading font-semibold text-popover-foreground">
                    الإشعارات
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications?.map((notification) => (
                    <div
                      key={notification?.id}
                      className={`p-4 border-b border-border hover:bg-muted transition-micro ${
                        notification?.unread ? "bg-muted/50" : ""
                      }`}
                    >
                      <div className="flex items-start space-x-3 space-x-reverse">
                        <Icon
                          name={getNotificationIcon(notification?.type)}
                          size={18}
                          className={getNotificationColor(notification?.type)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-popover-foreground">
                            {notification?.title}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification?.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification?.time}
                          </p>
                        </div>
                        {notification?.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    onClick={() => setIsNotificationOpen(false)}
                  >
                    عرض جميع الإشعارات
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={handleMobileMenuToggle}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-micro"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.name}
                onClick={() => {
                  handleNavClick(item?.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 space-x-reverse w-full px-3 py-2 rounded-md text-sm font-medium transition-micro ${
                  item?.active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </button>
            ))}

            <div className="pt-2 mt-2 border-t border-border">
              {moreMenuItems?.map((item) => (
                <button
                  key={item?.name}
                  onClick={() => {
                    handleNavClick(item?.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 space-x-reverse w-full px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
