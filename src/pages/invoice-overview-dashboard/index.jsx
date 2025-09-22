import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const InvoiceOverviewDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("ar");
  const [invoices, setInvoices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    date: "",
    amount: "",
    description: "",
    file: null,
  });

  useEffect(() => {
    // Force Arabic language and RTL layout
    setCurrentLanguage("ar");
    localStorage.setItem("language", "ar");
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";

    // Load invoices from localStorage
    loadInvoices();
  }, []);

  const loadInvoices = () => {
    try {
      const savedInvoices = localStorage.getItem("invoices");
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      }
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
  };

  const saveInvoices = (invoiceList) => {
    try {
      localStorage.setItem("invoices", JSON.stringify(invoiceList));
    } catch (error) {
      console.error("Error saving invoices:", error);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e?.target;
    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files?.[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (
      !formData?.invoiceNumber ||
      !formData?.date ||
      !formData?.amount ||
      !formData?.description
    ) {
      showNotification("جميع الحقول مطلوبة", "error");
      return;
    }

    const invoice = {
      id: editingInvoice?.id || Date.now(),
      ...formData,
      fileName: formData?.file?.name || editingInvoice?.fileName,
      fileData: formData?.file
        ? URL.createObjectURL(formData?.file)
        : editingInvoice?.fileData,
      createdAt: editingInvoice?.createdAt || new Date()?.toISOString(),
    };

    let updatedInvoices;
    if (editingInvoice) {
      updatedInvoices = invoices?.map((inv) =>
        inv?.id === editingInvoice?.id ? invoice : inv
      );
      showNotification("تم تحديث الفاتورة بنجاح");
    } else {
      updatedInvoices = [...invoices, invoice];
      showNotification("تم حفظ الفاتورة بنجاح");
    }

    setInvoices(updatedInvoices);
    saveInvoices(updatedInvoices);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: "",
      date: "",
      amount: "",
      description: "",
      file: null,
    });
    setEditingInvoice(null);
    setShowForm(false);
  };

  const handleEdit = (invoice) => {
    setFormData({
      invoiceNumber: invoice?.invoiceNumber,
      date: invoice?.date,
      amount: invoice?.amount,
      description: invoice?.description,
      file: null,
    });
    setEditingInvoice(invoice);
    setShowForm(true);
  };

  const handleDelete = (invoiceId) => {
    if (confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) {
      let updatedInvoices = invoices?.filter((inv) => inv?.id !== invoiceId);
      setInvoices(updatedInvoices);
      saveInvoices(updatedInvoices);
      showNotification("تم حذف الفاتورة بنجاح");
    }
  };

  const handleDownload = (invoice) => {
    if (invoice?.fileData) {
      const link = document.createElement("a");
      link.href = invoice?.fileData;
      link.download = invoice?.fileName || `فاتورة-${invoice?.invoiceNumber}`;
      document.body?.appendChild(link);
      link?.click();
      document.body?.removeChild(link);
    }
  };

  const filteredInvoices = invoices?.filter(
    (invoice) =>
      invoice?.invoiceNumber
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      invoice?.description
        ?.toLowerCase()
        ?.includes(searchTerm?.toLowerCase()) ||
      invoice?.amount?.toString()?.includes(searchTerm) ||
      invoice?.date?.includes(searchTerm)
  );

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <Header />
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-md shadow-lg ${
            notification?.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {notification?.message}
        </div>
      )}
      {/* Main Content */}
      <main
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:pr-16" : "lg:pr-64"
        } pb-24 lg:pb-8`}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                إدارة الفواتير
              </h1>
              <p className="text-muted-foreground">
                إضافة وإدارة الفواتير بسهولة
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              iconName={showForm ? "X" : "Plus"}
              className="mt-4 sm:mt-0"
            >
              {showForm ? "إلغاء" : "إضافة فاتورة"}
            </Button>
          </div>

          {/* Invoice Form */}
          {showForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {editingInvoice ? "تعديل الفاتورة" : "إضافة فاتورة جديدة"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="رقم الفاتورة"
                    name="invoiceNumber"
                    value={formData?.invoiceNumber}
                    onChange={handleInputChange}
                    placeholder="أدخل رقم الفاتورة"
                    required
                  />
                  <Input
                    label="التاريخ"
                    name="date"
                    type="date"
                    value={formData?.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="المبلغ"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData?.amount}
                    onChange={handleInputChange}
                    placeholder="أدخل المبلغ"
                    required
                  />
                  <Input
                    label="ملف الفاتورة"
                    name="file"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleInputChange}
                  />
                </div>
                <Input
                  label="الوصف"
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  placeholder="أدخل وصف الفاتورة"
                  required
                />
                <div className="flex gap-2 pt-4">
                  <Button type="submit" iconName="Save">
                    {editingInvoice ? "تحديث الفاتورة" : "حفظ الفاتورة"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    إلغاء
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <Input
              label="البحث في الفواتير"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              placeholder="ابحث برقم الفاتورة، الوصف، المبلغ، أو التاريخ..."
              iconName="Search"
            />
          </div>

          {/* Invoices Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">
                قائمة الفواتير ({filteredInvoices?.length})
              </h2>
            </div>

            {filteredInvoices?.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-muted-foreground mb-4">
                  <svg
                    className="mx-auto h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  {searchTerm ? "لم يتم العثور على فواتير" : "لا توجد فواتير"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "لم يتم العثور على أي فواتير تطابق بحثك"
                    : "ابدأ بإضافة فاتورة جديدة لرؤيتها هنا"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        رقم الفاتورة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        المبلغ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        الملف
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {filteredInvoices?.map((invoice) => (
                      <tr key={invoice?.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                          {invoice?.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(invoice.date)?.toLocaleDateString("ar-SA")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {parseFloat(invoice?.amount)?.toLocaleString("ar-SA")}{" "}
                          ر.س
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          {invoice?.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {invoice?.fileName ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(invoice)}
                              iconName="Download"
                            >
                              تحميل
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">
                              لا يوجد ملف
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(invoice)}
                              iconName="Edit"
                            >
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(invoice?.id)}
                              iconName="Trash"
                            >
                              حذف
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-muted-foreground">
                إجمالي الفواتير: {invoices?.length}
              </div>
              <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                آخر تحديث: {new Date()?.toLocaleTimeString("ar-SA")}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceOverviewDashboard;
