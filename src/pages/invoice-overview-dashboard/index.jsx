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
              className={`mt-4 sm:mt-0 transition-all duration-200 ${
                showForm
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-primary hover:bg-primary/90 shadow-lg"
              }`}
            >
              {showForm ? "إلغاء" : "إضافة فاتورة"}
            </Button>
          </div>

          {/* Invoice Form */}
          {showForm && (
            <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl shadow-lg backdrop-blur-sm mb-8 overflow-hidden animate-in slide-in-from-top-4 duration-300 fade-in">
              {/* Form Header */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {editingInvoice ? "تعديل الفاتورة" : "إضافة فاتورة جديدة"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {editingInvoice
                        ? "قم بتحديث بيانات الفاتورة"
                        : "املأ البيانات التالية لإضافة فاتورة جديدة"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-primary rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">
                        المعلومات الأساسية
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Input
                          label="رقم الفاتورة"
                          name="invoiceNumber"
                          value={formData?.invoiceNumber}
                          onChange={handleInputChange}
                          placeholder="مثال: INV-2024-001"
                          required
                          className="transition-all duration-200"
                        />
                        <p className="text-xs text-muted-foreground">
                          أدخل رقم فريد للفاتورة
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Input
                          label="تاريخ الفاتورة"
                          name="date"
                          type="date"
                          value={formData?.date}
                          onChange={handleInputChange}
                          required
                          className="transition-all duration-200"
                        />
                        <p className="text-xs text-muted-foreground">
                          تاريخ إصدار الفاتورة
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">
                        المعلومات المالية
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Input
                          label="المبلغ"
                          name="amount"
                          type="number"
                          step="0.01"
                          value={formData?.amount}
                          onChange={handleInputChange}
                          placeholder="0.00"
                          required
                          className="transition-all duration-200"
                        />
                        <p className="text-xs text-muted-foreground">
                          المبلغ بالريال السعودي
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Input
                          label="ملف الفاتورة"
                          name="file"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleInputChange}
                          className="transition-all duration-200 focus:scale-[1.02] file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:px-3 file:py-1 file:text-sm file:font-medium"
                        />
                        <p className="text-xs text-muted-foreground">
                          PDF، JPG، PNG (اختياري)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-foreground">
                        وصف الفاتورة
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <Input
                        label="الوصف"
                        name="description"
                        value={formData?.description}
                        onChange={handleInputChange}
                        placeholder="وصف مفصل للفاتورة..."
                        required
                        className="transition-all duration-200"
                      />
                      <p className="text-xs text-muted-foreground">
                        وصف تفصيلي للخدمات أو المنتجات
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
                    <Button
                      type="submit"
                      iconName="Save"
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg"
                    >
                      {editingInvoice ? "تحديث الفاتورة" : "حفظ الفاتورة"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1 sm:flex-none hover:bg-destructive/10 hover:border-destructive/20 hover:text-destructive transition-all duration-200"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  البحث في الفواتير
                </h3>
                <p className="text-sm text-muted-foreground">
                  ابحث عن فواتير محددة بسهولة
                </p>
              </div>
            </div>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              placeholder="ابحث برقم الفاتورة، الوصف، المبلغ، أو التاريخ..."
              iconName="Search"
              className="transition-all duration-200"
            />
          </div>

          {/* Invoices Table */}
          <div className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    قائمة الفواتير ({filteredInvoices?.length})
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    جميع الفواتير المحفوظة
                  </p>
                </div>
              </div>
            </div>

            {filteredInvoices?.length === 0 ? (
              <div className="p-12 text-center bg-gradient-to-br from-muted/20 to-muted/10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6">
                  <svg
                    className="w-10 h-10 text-primary"
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
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {searchTerm ? "لم يتم العثور على فواتير" : "لا توجد فواتير"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchTerm
                    ? "لم يتم العثور على أي فواتير تطابق بحثك. جرب مصطلحات بحث مختلفة."
                    : "ابدأ بإضافة فاتورة جديدة لرؤيتها هنا وإدارة فواتيرك بسهولة."}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => setShowForm(true)}
                    iconName="Plus"
                    className="bg-primary hover:bg-primary/90 shadow-lg"
                  >
                    إضافة فاتورة جديدة
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-muted/30 to-muted/20">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        رقم الفاتورة
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        التاريخ
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        المبلغ
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        الوصف
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        الملف
                      </th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background/50 divide-y divide-border/50">
                    {filteredInvoices?.map((invoice, index) => (
                      <tr
                        key={invoice?.id}
                        className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 hover:shadow-sm"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-sm font-medium text-foreground">
                              {invoice?.invoiceNumber}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                          {new Date(invoice.date)?.toLocaleDateString("ar-SA")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {parseFloat(invoice?.amount)?.toLocaleString(
                              "ar-SA"
                            )}{" "}
                            ر.س
                          </span>
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
                              className="hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-200"
                            >
                              تحميل
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-xs">
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
                              className="hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all duration-200"
                            >
                              تعديل
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(invoice?.id)}
                              iconName="Trash"
                              className="transition-all duration-200"
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
          <div className="mt-8 bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    إجمالي الفواتير:{" "}
                    <span className="text-primary font-bold">
                      {invoices?.length}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    آخر تحديث: {new Date()?.toLocaleTimeString("ar-SA")}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>النظام يعمل بشكل طبيعي</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceOverviewDashboard;
