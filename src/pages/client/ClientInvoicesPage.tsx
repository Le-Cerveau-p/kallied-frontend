import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import ClientSidebar from "../../components/ClientSidebar";
import {
  X,
  Download,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Search,
  Filter,
  Receipt,
  Building,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  projectName: string;
  projectId: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: "Paid" | "Pending" | "Overdue";
  paidDate?: string;
  lineItems: LineItem[];
  notes?: string;
  subtotal: number;
  tax: number;
  total: number;
}

export default function ClientInvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Mock invoices data
  const allInvoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: "INV-2026-001",
      projectName: "Website Redesign",
      projectId: "PRJ-1001",
      amount: 15000,
      dueDate: "Jan 31, 2026",
      issueDate: "Jan 15, 2026",
      status: "Pending",
      subtotal: 15000,
      tax: 1500,
      total: 16500,
      lineItems: [
        {
          id: 1,
          description: "UI/UX Design - Homepage & Landing Pages",
          quantity: 80,
          rate: 125,
          amount: 10000,
        },
        {
          id: 2,
          description: "Frontend Development - React Components",
          quantity: 40,
          rate: 150,
          amount: 6000,
        },
        {
          id: 3,
          description: "Responsive Mobile Optimization",
          quantity: 20,
          rate: 125,
          amount: 2500,
        },
        {
          id: 4,
          description: "Browser Testing & QA",
          quantity: 10,
          rate: 100,
          amount: 1000,
        },
      ],
      notes:
        "Payment due within 30 days of invoice date. Late payments subject to 1.5% monthly interest.",
    },
    {
      id: 2,
      invoiceNumber: "INV-2026-002",
      projectName: "Mobile App Development",
      projectId: "PRJ-1002",
      amount: 28500,
      dueDate: "Feb 15, 2026",
      issueDate: "Jan 18, 2026",
      status: "Pending",
      subtotal: 28500,
      tax: 2850,
      total: 31350,
      lineItems: [
        {
          id: 1,
          description: "iOS App Development - Phase 1",
          quantity: 120,
          rate: 150,
          amount: 18000,
        },
        {
          id: 2,
          description: "Android App Development - Phase 1",
          quantity: 100,
          rate: 150,
          amount: 15000,
        },
        {
          id: 3,
          description: "API Integration Services",
          quantity: 30,
          rate: 175,
          amount: 5250,
        },
        {
          id: 4,
          description: "App Store Submission & Setup",
          quantity: 8,
          rate: 125,
          amount: 1000,
        },
      ],
      notes: "Milestone 1 of 3. Next invoice upon completion of Phase 2.",
    },
    {
      id: 3,
      invoiceNumber: "INV-2025-098",
      projectName: "Brand Identity Package",
      projectId: "PRJ-0998",
      amount: 8500,
      dueDate: "Dec 31, 2025",
      issueDate: "Dec 15, 2025",
      status: "Paid",
      paidDate: "Dec 28, 2025",
      subtotal: 8500,
      tax: 850,
      total: 9350,
      lineItems: [
        {
          id: 1,
          description: "Logo Design & Brand Guidelines",
          quantity: 40,
          rate: 150,
          amount: 6000,
        },
        {
          id: 2,
          description: "Business Card & Stationery Design",
          quantity: 15,
          rate: 125,
          amount: 1875,
        },
        {
          id: 3,
          description: "Social Media Asset Templates",
          quantity: 10,
          rate: 125,
          amount: 1250,
        },
        {
          id: 4,
          description: "Brand Style Guide Documentation",
          quantity: 8,
          rate: 100,
          amount: 800,
        },
      ],
      notes: "Thank you for your prompt payment!",
    },
    {
      id: 4,
      invoiceNumber: "INV-2025-089",
      projectName: "E-commerce Platform",
      projectId: "PRJ-0985",
      amount: 42000,
      dueDate: "Dec 15, 2025",
      issueDate: "Nov 20, 2025",
      status: "Overdue",
      subtotal: 42000,
      tax: 4200,
      total: 46200,
      lineItems: [
        {
          id: 1,
          description: "E-commerce Platform Setup - Shopify",
          quantity: 60,
          rate: 175,
          amount: 10500,
        },
        {
          id: 2,
          description: "Custom Theme Development",
          quantity: 100,
          rate: 150,
          amount: 15000,
        },
        {
          id: 3,
          description: "Product Catalog Migration (500 products)",
          quantity: 80,
          rate: 125,
          amount: 10000,
        },
        {
          id: 4,
          description: "Payment Gateway Integration",
          quantity: 30,
          rate: 175,
          amount: 5250,
        },
        {
          id: 5,
          description: "Inventory Management System",
          quantity: 25,
          rate: 150,
          amount: 3750,
        },
      ],
      notes:
        "OVERDUE: Payment was due Dec 15, 2025. Please remit payment immediately to avoid service interruption.",
    },
    {
      id: 5,
      invoiceNumber: "INV-2025-095",
      projectName: "Website Redesign",
      projectId: "PRJ-1001",
      amount: 12000,
      dueDate: "Dec 20, 2025",
      issueDate: "Nov 25, 2025",
      status: "Paid",
      paidDate: "Dec 18, 2025",
      subtotal: 12000,
      tax: 1200,
      total: 13200,
      lineItems: [
        {
          id: 1,
          description: "Initial Design Concepts & Wireframes",
          quantity: 50,
          rate: 125,
          amount: 6250,
        },
        {
          id: 2,
          description: "Content Strategy & Planning",
          quantity: 20,
          rate: 150,
          amount: 3000,
        },
        {
          id: 3,
          description: "Photography & Image Curation",
          quantity: 15,
          rate: 100,
          amount: 1500,
        },
        {
          id: 4,
          description: "Project Management & Client Meetings",
          quantity: 18,
          rate: 125,
          amount: 2250,
        },
      ],
      notes:
        "Deposit payment for Website Redesign project. Remaining balance due upon completion.",
    },
  ];

  // Filter invoices
  const filteredInvoices = allInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All Status" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid":
        return {
          backgroundColor: "#32cd3220",
          color: "#32cd32",
          icon: CheckCircle,
        };
      case "Pending":
        return { backgroundColor: "#ff980020", color: "#ff9800", icon: Clock };
      case "Overdue":
        return {
          backgroundColor: "#dc262620",
          color: "#dc2626",
          icon: AlertCircle,
        };
      default:
        return { backgroundColor: "#71718220", color: "#717182", icon: Clock };
    }
  };

  // Calculate totals
  const totalAmount = allInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = allInvoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = allInvoices
    .filter((inv) => inv.status === "Pending")
    .reduce((sum, inv) => sum + inv.total, 0);
  const overdueAmount = allInvoices
    .filter((inv) => inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar currentPage="client" />
      <ClientSidebar activeItem="invoices" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
              Invoices & Billing
            </h1>
            <p className="text-gray-600">
              View and manage your project invoices
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <Receipt className="w-5 h-5" style={{ color: "#4169e1" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Total Billed
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#001f54" }}>
                    ${totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#32cd3220" }}
                >
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: "#32cd32" }}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Paid
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#32cd32" }}>
                    ${paidAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#ff980020" }}
                >
                  <Clock className="w-5 h-5" style={{ color: "#ff9800" }} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Pending
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#ff9800" }}>
                    ${pendingAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#dc262620" }}
                >
                  <AlertCircle
                    className="w-5 h-5"
                    style={{ color: "#dc2626" }}
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wide">
                    Overdue
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#dc2626" }}>
                    ${overdueAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by invoice number or project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option>All Status</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredInvoices.length === 0 ? (
              <div className="p-12 text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#4169e120" }}
                >
                  <Receipt className="w-8 h-8" style={{ color: "#4169e1" }} />
                </div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "#001f54" }}
                >
                  No invoices found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full">
                    <thead
                      className="bg-gray-50 border-b"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Invoice Number
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Issue Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4"></th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      {filteredInvoices.map((invoice) => {
                        const statusStyle = getStatusStyle(invoice.status);
                        const StatusIcon = statusStyle.icon;

                        return (
                          <tr
                            key={invoice.id}
                            className="hover:bg-gray-50 transition-all"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span
                                  className="font-mono font-medium text-sm"
                                  style={{ color: "#001f54" }}
                                >
                                  {invoice.invoiceNumber}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {invoice.projectName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {invoice.projectId}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p
                                className="text-sm font-semibold"
                                style={{ color: "#001f54" }}
                              >
                                ${invoice.total.toLocaleString()}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {invoice.issueDate}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {invoice.dueDate}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                                style={statusStyle}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {invoice.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => setSelectedInvoice(invoice)}
                                className="text-sm font-medium transition-all hover:underline"
                                style={{ color: "#4169e1" }}
                              >
                                View Details
                                <ChevronRight className="w-4 h-4 inline ml-1" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div
                  className="lg:hidden divide-y"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  {filteredInvoices.map((invoice) => {
                    const statusStyle = getStatusStyle(invoice.status);
                    const StatusIcon = statusStyle.icon;

                    return (
                      <div key={invoice.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span
                                className="font-mono font-medium text-sm"
                                style={{ color: "#001f54" }}
                              >
                                {invoice.invoiceNumber}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {invoice.projectName}
                            </p>
                          </div>
                          <span
                            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                            style={statusStyle}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            {invoice.status}
                          </span>
                        </div>
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Amount:</span>
                            <span
                              className="font-semibold"
                              style={{ color: "#001f54" }}
                            >
                              ${invoice.total.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Due Date:</span>
                            <span className="text-gray-900">
                              {invoice.dueDate}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="w-full py-2 border rounded-lg text-sm font-medium transition-all hover:bg-gray-50"
                          style={{ borderColor: "#4169e1", color: "#4169e1" }}
                        >
                          View Details
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Invoice Detail Drawer */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white h-full w-full max-w-3xl overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div
              className="sticky top-0 bg-white border-b z-10"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="flex items-center justify-between p-6">
                <div>
                  <h2
                    className="text-2xl font-semibold mb-1"
                    style={{ color: "#001f54" }}
                  >
                    {selectedInvoice.invoiceNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedInvoice.projectName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="px-6 pb-4 flex items-center gap-3">
                <button
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                {(() => {
                  const statusStyle = getStatusStyle(selectedInvoice.status);
                  const StatusIcon = statusStyle.icon;
                  return (
                    <span
                      className="inline-flex items-center gap-2 text-sm px-4 py-3 rounded-lg font-medium"
                      style={statusStyle}
                    >
                      <StatusIcon className="w-4 h-4" />
                      {selectedInvoice.status}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6">
              {/* Company & Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    From
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Your Company Name
                        </p>
                        <p className="text-sm text-gray-600">
                          Professional Services
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      123 Business Street, Suite 100
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      billing@yourcompany.com
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400" />
                      (555) 123-4567
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Bill To
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Client Company Name
                        </p>
                        <p className="text-sm text-gray-600">
                          Client Department
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      456 Client Avenue, Floor 5
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-gray-400" />
                      accounts@clientcompany.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Invoice Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedInvoice.issueDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Due Date
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedInvoice.dueDate}
                  </p>
                </div>
                {selectedInvoice.paidDate && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      Paid Date
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "#32cd32" }}
                    >
                      {selectedInvoice.paidDate}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    Project ID
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedInvoice.projectId}
                  </p>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                  Line Items
                </h3>
                <div
                  className="border rounded-lg overflow-hidden"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  {/* Desktop Table */}
                  <div className="hidden sm:block">
                    <table className="w-full">
                      <thead
                        className="bg-gray-50 border-b"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                            Description
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                            Qty
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Rate
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        {selectedInvoice.lineItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {item.description}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-center">
                              {item.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right font-mono">
                              ${item.rate.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right font-mono">
                              ${item.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List */}
                  <div
                    className="sm:hidden divide-y"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    {selectedInvoice.lineItems.map((item) => (
                      <div key={item.id} className="p-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          {item.description}
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Qty:</span>
                            <span className="ml-1 text-gray-900">
                              {item.quantity}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Rate:</span>
                            <span className="ml-1 text-gray-900">
                              ${item.rate}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-gray-900">
                              ${item.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4" style={{ borderColor: "#e5e7eb" }}>
                <div className="max-w-sm ml-auto space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-mono text-gray-900">
                      ${selectedInvoice.subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-mono text-gray-900">
                      ${selectedInvoice.tax.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="flex items-center justify-between text-lg font-bold pt-3 border-t"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <span style={{ color: "#001f54" }}>Total:</span>
                    <span className="font-mono" style={{ color: "#001f54" }}>
                      ${selectedInvoice.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: getStatusStyle(selectedInvoice.status)
                    .backgroundColor,
                }}
              >
                <div className="flex items-start gap-3">
                  {(() => {
                    const statusStyle = getStatusStyle(selectedInvoice.status);
                    const StatusIcon = statusStyle.icon;
                    return (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: statusStyle.color + "30" }}
                      >
                        <StatusIcon
                          className="w-4 h-4"
                          style={{ color: statusStyle.color }}
                        />
                      </div>
                    );
                  })()}
                  <div>
                    <h4
                      className="font-semibold mb-1"
                      style={{
                        color: getStatusStyle(selectedInvoice.status).color,
                      }}
                    >
                      Payment {selectedInvoice.status}
                    </h4>
                    <p className="text-sm text-gray-700">
                      {selectedInvoice.status === "Paid" &&
                        `Payment received on ${selectedInvoice.paidDate}. Thank you for your business!`}
                      {selectedInvoice.status === "Pending" &&
                        `Payment is due by ${selectedInvoice.dueDate}. Please remit payment by the due date.`}
                      {selectedInvoice.status === "Overdue" &&
                        `This invoice is overdue. Payment was due on ${selectedInvoice.dueDate}. Please contact our billing department.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                    Notes
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div
                className="pt-6 border-t text-center text-xs text-gray-500"
                style={{ borderColor: "#e5e7eb" }}
              >
                <p>
                  Questions about this invoice? Contact us at
                  billing@yourcompany.com or (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
