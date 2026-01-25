import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Receipt,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  Plus,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Building,
  CreditCard,
  TrendingUp,
} from "lucide-react";

interface Contract {
  id: string;
  client: string;
  clientId: string;
  contractType:
    | "Fixed Price"
    | "Time & Materials"
    | "Retainer"
    | "Subscription";
  startDate: string;
  endDate: string;
  value: number;
  status: "Active" | "Pending" | "Expired" | "Terminated";
  description: string;
  paymentTerms: string;
  autoRenew: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  project: string;
  projectId: string;
  client: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Draft" | "Cancelled";
  paymentMethod?: string;
  paidDate?: string;
  items: Array<{ description: string; amount: number }>;
}

export default function AdminBillingContracts() {
  const [activeTab, setActiveTab] = useState<"contracts" | "invoices">(
    "contracts",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [contractStatusFilter, setContractStatusFilter] = useState("all");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");

  // Mock contract data
  const contracts: Contract[] = [
    {
      id: "CON-001",
      client: "TechCorp Inc.",
      clientId: "CLI-001",
      contractType: "Fixed Price",
      startDate: "Jan 1, 2026",
      endDate: "Jun 30, 2026",
      value: 125000,
      status: "Active",
      description: "E-Commerce Platform Development",
      paymentTerms: "Net 30",
      autoRenew: false,
    },
    {
      id: "CON-002",
      client: "StartupXYZ",
      clientId: "CLI-002",
      contractType: "Time & Materials",
      startDate: "Dec 1, 2025",
      endDate: "May 31, 2026",
      value: 85000,
      status: "Active",
      description: "Mobile App Development & Maintenance",
      paymentTerms: "Net 15",
      autoRenew: true,
    },
    {
      id: "CON-003",
      client: "Enterprise Co.",
      clientId: "CLI-003",
      contractType: "Retainer",
      startDate: "Jan 1, 2026",
      endDate: "Dec 31, 2026",
      value: 240000,
      status: "Active",
      description: "Annual IT Consulting Services",
      paymentTerms: "Net 30",
      autoRenew: true,
    },
    {
      id: "CON-004",
      client: "SmallBiz LLC",
      clientId: "CLI-004",
      contractType: "Subscription",
      startDate: "Nov 1, 2025",
      endDate: "Oct 31, 2026",
      value: 36000,
      status: "Active",
      description: "Cloud Hosting & Support Services",
      paymentTerms: "Monthly",
      autoRenew: true,
    },
    {
      id: "CON-005",
      client: "MidMarket Corp",
      clientId: "CLI-005",
      contractType: "Fixed Price",
      startDate: "Aug 1, 2025",
      endDate: "Dec 31, 2025",
      value: 95000,
      status: "Expired",
      description: "Website Redesign Project",
      paymentTerms: "Net 30",
      autoRenew: false,
    },
    {
      id: "CON-006",
      client: "Global Industries",
      clientId: "CLI-006",
      contractType: "Time & Materials",
      startDate: "Feb 1, 2026",
      endDate: "Jul 31, 2026",
      value: 150000,
      status: "Pending",
      description: "Data Analytics Platform Development",
      paymentTerms: "Net 30",
      autoRenew: false,
    },
  ];

  // Mock invoice data
  const invoices: Invoice[] = [
    {
      id: "INV-001",
      invoiceNumber: "INV-2026-001",
      project: "E-Commerce Platform Redesign",
      projectId: "PROJ-032",
      client: "TechCorp Inc.",
      amount: 25000,
      issueDate: "Jan 15, 2026",
      dueDate: "Feb 14, 2026",
      status: "Paid",
      paymentMethod: "Wire Transfer",
      paidDate: "Feb 10, 2026",
      items: [
        { description: "UI/UX Design - Phase 1", amount: 15000 },
        { description: "Frontend Development - Phase 1", amount: 10000 },
      ],
    },
    {
      id: "INV-002",
      invoiceNumber: "INV-2026-002",
      project: "Mobile App Development",
      projectId: "PROJ-038",
      client: "StartupXYZ",
      amount: 18500,
      issueDate: "Jan 20, 2026",
      dueDate: "Feb 19, 2026",
      status: "Pending",
      items: [
        { description: "Development Sprint 1", amount: 12000 },
        { description: "QA Testing", amount: 4500 },
        { description: "Project Management", amount: 2000 },
      ],
    },
    {
      id: "INV-003",
      invoiceNumber: "INV-2026-003",
      project: "Cloud Migration Project",
      projectId: "PROJ-045",
      client: "Enterprise Co.",
      amount: 42000,
      issueDate: "Jan 10, 2026",
      dueDate: "Jan 25, 2026",
      status: "Overdue",
      items: [
        { description: "Infrastructure Setup", amount: 20000 },
        { description: "Data Migration", amount: 15000 },
        { description: "Security Audit", amount: 7000 },
      ],
    },
    {
      id: "INV-004",
      invoiceNumber: "INV-2026-004",
      project: "Website Refresh",
      projectId: "PROJ-051",
      client: "SmallBiz LLC",
      amount: 8500,
      issueDate: "Jan 22, 2026",
      dueDate: "Feb 21, 2026",
      status: "Pending",
      items: [
        { description: "Design Updates", amount: 4500 },
        { description: "Content Management", amount: 4000 },
      ],
    },
    {
      id: "INV-005",
      invoiceNumber: "INV-2026-005",
      project: "Consulting Services - January",
      projectId: "PROJ-000",
      client: "Enterprise Co.",
      amount: 20000,
      issueDate: "Jan 25, 2026",
      dueDate: "Feb 24, 2026",
      status: "Draft",
      items: [
        { description: "Monthly Retainer - January 2026", amount: 20000 },
      ],
    },
    {
      id: "INV-006",
      invoiceNumber: "INV-2025-045",
      project: "Infrastructure Upgrade",
      projectId: "PROJ-029",
      client: "Global Industries",
      amount: 32000,
      issueDate: "Dec 15, 2025",
      dueDate: "Jan 14, 2026",
      status: "Paid",
      paymentMethod: "Credit Card",
      paidDate: "Jan 12, 2026",
      items: [
        { description: "Server Setup", amount: 18000 },
        { description: "Network Configuration", amount: 14000 },
      ],
    },
  ];

  // Filter contracts
  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      contractStatusFilter === "all" ||
      contract.status === contractStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter invoices
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.project.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      invoiceStatusFilter === "all" || invoice.status === invoiceStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get contract status badge
  const getContractStatusBadge = (status: string) => {
    const styles = {
      Active: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      Pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      Expired: { bg: "bg-gray-100", text: "text-gray-700", icon: AlertCircle },
      Terminated: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
    };
    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${style.bg} ${style.text}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Get invoice status badge
  const getInvoiceStatusBadge = (status: string) => {
    const styles = {
      Paid: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      Pending: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
      Overdue: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
      Draft: { bg: "bg-gray-100", text: "text-gray-700", icon: FileText },
      Cancelled: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
    };
    const style = styles[status as keyof typeof styles];
    const Icon = style.icon;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${style.bg} ${style.text}`}
      >
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Calculate summary stats
  const contractStats = {
    active: contracts.filter((c) => c.status === "Active").length,
    totalValue: contracts
      .filter((c) => c.status === "Active")
      .reduce((sum, c) => sum + c.value, 0),
  };

  const invoiceStats = {
    paid: invoices.filter((i) => i.status === "Paid").length,
    pending: invoices.filter((i) => i.status === "Pending").length,
    overdue: invoices.filter((i) => i.status === "Overdue").length,
    totalPaid: invoices
      .filter((i) => i.status === "Paid")
      .reduce((sum, i) => sum + i.amount, 0),
    totalPending: invoices
      .filter((i) => i.status === "Pending")
      .reduce((sum, i) => sum + i.amount, 0),
    totalOverdue: invoices
      .filter((i) => i.status === "Overdue")
      .reduce((sum, i) => sum + i.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="billing" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <Receipt className="w-8 h-8" style={{ color: "#4169e1" }} />
                </div>
                <div>
                  <h1 className="text-4xl" style={{ color: "#001f54" }}>
                    Billing & Contracts
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage invoices, contracts, and financial agreements
                  </p>
                </div>
              </div>

              <button
                className="px-4 py-3 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2 self-start sm:self-auto"
                style={{ backgroundColor: "#4169e1" }}
              >
                <Plus className="w-4 h-4" />
                New Invoice
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <FileText className="w-6 h-6" style={{ color: "#a7fc00" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Active Contracts</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {contractStats.active}
              </p>
              <p className="text-xs" style={{ color: "#4169e1" }}>
                ${(contractStats.totalValue / 1000).toFixed(0)}K total value
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-100">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Paid Invoices</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {invoiceStats.paid}
              </p>
              <p className="text-xs text-green-600">
                ${(invoiceStats.totalPaid / 1000).toFixed(0)}K received
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Clock className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Pending Invoices</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {invoiceStats.pending}
              </p>
              <p className="text-xs" style={{ color: "#4169e1" }}>
                ${(invoiceStats.totalPending / 1000).toFixed(0)}K pending
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-100">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Overdue Invoices</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {invoiceStats.overdue}
              </p>
              <p className="text-xs text-red-600">
                ${(invoiceStats.totalOverdue / 1000).toFixed(0)}K overdue
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("contracts")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "contracts"
                    ? "border-b-2 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "contracts"
                    ? { borderColor: "#4169e1", color: "#4169e1" }
                    : {}
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4" />
                  Contracts ({contracts.length})
                </div>
              </button>
              <button
                onClick={() => setActiveTab("invoices")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "invoices"
                    ? "border-b-2 text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "invoices"
                    ? { borderColor: "#4169e1", color: "#4169e1" }
                    : {}
                }
              >
                <div className="flex items-center justify-center gap-2">
                  <Receipt className="w-4 h-4" />
                  Invoices ({invoices.length})
                </div>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="sm:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  {activeTab === "contracts" ? (
                    <select
                      value={contractStatusFilter}
                      onChange={(e) => setContractStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Expired">Expired</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  ) : (
                    <select
                      value={invoiceStatusFilter}
                      onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Draft">Draft</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Table */}
          {activeTab === "contracts" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Contract ID
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Client
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Type
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Start Date
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        End Date
                      </th>
                      <th className="text-right py-4 px-6 font-medium text-gray-700">
                        Value
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-center py-4 px-6 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-12 text-center text-gray-500"
                        >
                          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No contracts found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredContracts.map((contract) => (
                        <tr
                          key={contract.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span
                              className="font-mono text-sm font-medium"
                              style={{ color: "#4169e1" }}
                            >
                              {contract.id}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span
                                className="font-medium"
                                style={{ color: "#001f54" }}
                              >
                                {contract.client}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                              {contract.contractType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {contract.startDate}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {contract.endDate}
                          </td>
                          <td
                            className="py-4 px-6 text-right font-medium"
                            style={{ color: "#001f54" }}
                          >
                            ${contract.value.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            {getContractStatusBadge(contract.status)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Download Contract"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Invoices Table */}
          {activeTab === "invoices" && (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Invoice #
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Client
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Project
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Issue Date
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Due Date
                      </th>
                      <th className="text-right py-4 px-6 font-medium text-gray-700">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 font-medium text-gray-700">
                        Status
                      </th>
                      <th className="text-center py-4 px-6 font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-12 text-center text-gray-500"
                        >
                          <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No invoices found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <tr
                          key={invoice.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span
                              className="font-mono text-sm font-medium"
                              style={{ color: "#4169e1" }}
                            >
                              {invoice.invoiceNumber}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-gray-400" />
                              <span
                                className="font-medium"
                                style={{ color: "#001f54" }}
                              >
                                {invoice.client}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {invoice.project}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {invoice.issueDate}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {invoice.dueDate}
                          </td>
                          <td
                            className="py-4 px-6 text-right font-medium"
                            style={{ color: "#001f54" }}
                          >
                            ${invoice.amount.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            {getInvoiceStatusBadge(invoice.status)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="View Invoice"
                              >
                                <Eye className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                              {(invoice.status === "Pending" ||
                                invoice.status === "Overdue") && (
                                <button
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Send Reminder"
                                >
                                  <Send className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
