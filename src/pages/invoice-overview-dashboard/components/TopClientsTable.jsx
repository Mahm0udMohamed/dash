import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const TopClientsTable = () => {
  const [sortBy, setSortBy] = useState("revenue");
  const [sortOrder, setSortOrder] = useState("desc");

  const clientsData = [
    {
      id: 1,
      name: "شركة التقنية المتقدمة",
      email: "info@advanced-tech.sa",
      totalInvoices: 24,
      totalRevenue: 485000,
      paidInvoices: 22,
      pendingInvoices: 2,
      overdueInvoices: 0,
      averagePaymentDays: 12,
      lastInvoiceDate: new Date("2024-09-20"),
      status: "excellent",
      avatar:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "مؤسسة الابتكار الرقمي",
      email: "contact@digital-innovation.sa",
      totalInvoices: 18,
      totalRevenue: 342000,
      paidInvoices: 16,
      pendingInvoices: 1,
      overdueInvoices: 1,
      averagePaymentDays: 18,
      lastInvoiceDate: new Date("2024-09-19"),
      status: "good",
      avatar:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "شركة الحلول الذكية",
      email: "admin@smart-solutions.sa",
      totalInvoices: 15,
      totalRevenue: 298000,
      paidInvoices: 12,
      pendingInvoices: 2,
      overdueInvoices: 1,
      averagePaymentDays: 25,
      lastInvoiceDate: new Date("2024-09-18"),
      status: "warning",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 4,
      name: "مركز التدريب المهني",
      email: "info@training-center.sa",
      totalInvoices: 12,
      totalRevenue: 186000,
      paidInvoices: 10,
      pendingInvoices: 2,
      overdueInvoices: 0,
      averagePaymentDays: 15,
      lastInvoiceDate: new Date("2024-09-17"),
      status: "good",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    },
    {
      id: 5,
      name: "شركة البناء الحديث",
      email: "projects@modern-construction.sa",
      totalInvoices: 8,
      totalRevenue: 124000,
      paidInvoices: 6,
      pendingInvoices: 1,
      overdueInvoices: 1,
      averagePaymentDays: 32,
      lastInvoiceDate: new Date("2024-09-15"),
      status: "attention",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      excellent: {
        color: "bg-success/10 text-success",
        label: "ممتاز",
        icon: "CheckCircle",
      },
      good: {
        color: "bg-primary/10 text-primary",
        label: "جيد",
        icon: "ThumbsUp",
      },
      warning: {
        color: "bg-warning/10 text-warning",
        label: "تحذير",
        icon: "AlertTriangle",
      },
      attention: {
        color: "bg-error/10 text-error",
        label: "يحتاج انتباه",
        icon: "AlertCircle",
      },
    };

    const badge = badges?.[status] || badges?.good;
    return (
      <span
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${badge?.color}`}
      >
        <Icon name={badge?.icon} size={12} />
        <span>{badge?.label}</span>
      </span>
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const sortedClients = [...clientsData]?.sort((a, b) => {
    let aValue = a?.[sortBy];
    let bValue = b?.[sortBy];

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-SA", {
      style: "currency",
      currency: "SAR",
      minimumFractionDigits: 0,
    })?.format(amount);
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortableHeader = ({ column, children }) => (
    <th
      className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-micro"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <Icon
          name={
            sortBy === column
              ? sortOrder === "asc"
                ? "ChevronUp"
                : "ChevronDown"
              : "ChevronsUpDown"
          }
          size={14}
        />
      </div>
    </th>
  );

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-card-foreground">
              أهم العملاء
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              العملاء الأكثر نشاطاً وإيراداً
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Filter"
              iconPosition="left"
            >
              تصفية
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              تصدير
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                العميل
              </th>
              <SortableHeader column="totalInvoices">الفواتير</SortableHeader>
              <SortableHeader column="totalRevenue">الإيرادات</SortableHeader>
              <SortableHeader column="averagePaymentDays">
                متوسط الدفع
              </SortableHeader>
              <SortableHeader column="lastInvoiceDate">
                آخر فاتورة
              </SortableHeader>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {sortedClients?.map((client) => (
              <tr
                key={client?.id}
                className="hover:bg-muted/50 transition-smooth"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={client?.avatar}
                        alt={client?.name}
                        onError={(e) => {
                          e.target.src = "/assets/images/no_image.png";
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-card-foreground">
                        {client?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {client?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-card-foreground">
                    <div className="font-medium">{client?.totalInvoices}</div>
                    <div className="text-xs text-muted-foreground">
                      {client?.paidInvoices} مدفوعة، {client?.pendingInvoices}{" "}
                      معلقة
                      {client?.overdueInvoices > 0 && (
                        <span className="text-error">
                          ، {client?.overdueInvoices} متأخرة
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-card-foreground">
                    {formatCurrency(client?.totalRevenue)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-card-foreground">
                    <span
                      className={`font-medium ${
                        client?.averagePaymentDays <= 15
                          ? "text-success"
                          : client?.averagePaymentDays <= 30
                          ? "text-warning"
                          : "text-error"
                      }`}
                    >
                      {client?.averagePaymentDays} يوم
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(client?.lastInvoiceDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(client?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="text-primary hover:text-primary/80 transition-micro">
                      <Icon name="Eye" size={16} />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-micro">
                      <Icon name="Edit" size={16} />
                    </button>
                    <button className="text-muted-foreground hover:text-foreground transition-micro">
                      <Icon name="MoreHorizontal" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            عرض 1-{sortedClients?.length} من {sortedClients?.length} عميل
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="ArrowRight"
            iconPosition="right"
          >
            عرض جميع العملاء
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopClientsTable;
