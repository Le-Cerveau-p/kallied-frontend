import { useEffect, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Receipt,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Building,
  CreditCard,
  Trash2,
} from "lucide-react";
import {
  getAdminInvoices,
  createAdminInvoice,
  getAdminProjects,
  approveInvoice,
  rejectInvoice,
  confirmInvoicePayment,
} from "../../api/admin";
import { getCurrentUser } from "../../api/users";
import { downloadFile } from "../../utils/download";
import Toast from "../../components/Toast";

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
  projectName: string;
  projectId: string;
  clientName: string;
  total: number;
  issueDate: string | Date;
  dueDate: string | Date;
  status: "PAID" | "PENDING" | "OVERDUE" | "DRAFT" | "APPROVED" | "REJECTED";
  paymentMethod?: string;
  paidDate?: string | Date | null;
  clientMarkedPaid?: boolean;
  clientMarkedPaidAt?: string | Date | null;
  invoiceUrl: string;
  receiptUrl?: string | null;
}

interface AdminProject {
  id: string;
  name: string;
  client?: { name?: string };
}

interface UserData {
  id: string;
  name: string;
  email: string;
}

export default function AdminBillingContracts() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<"contracts" | "invoices">(
    "invoices",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [contractStatusFilter, setContractStatusFilter] = useState("all");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tax, setTax] = useState(0);
  const [notes, setNotes] = useState("");
  const [lineItems, setLineItems] = useState<
    Array<{ id: string; description: string; quantity: number; rate: number }>
  >([{ id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 }]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  useEffect(() => {
    let isMounted = true;
    const loadInvoices = async () => {
      try {
        const [user, data, adminProjects] = await Promise.all([
          getCurrentUser(),
          getAdminInvoices(),
          getAdminProjects(),
        ]);
        if (isMounted) {
          setUserData(user);
          setInvoices(data);
          setProjects(
            adminProjects.map((project: any) => ({
              id: project.id,
              name: project.name,
              client: project.client,
            })),
          );
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInvoices();
    return () => {
      isMounted = false;
    };
  }, []);

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
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase());

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
      PAID: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      APPROVED: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle },
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
      OVERDUE: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
      DRAFT: { bg: "bg-gray-100", text: "text-gray-700", icon: FileText },
      REJECTED: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
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

  const formatDate = (value: string | Date) => {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString();
  };

  // Calculate summary stats
  const contractStats = {
    active: contracts.filter((c) => c.status === "Active").length,
    totalValue: contracts
      .filter((c) => c.status === "Active")
      .reduce((sum, c) => sum + c.value, 0),
  };

  const invoiceStats = {
    paid: invoices.filter((i) => i.status === "PAID").length,
    pending: invoices.filter((i) => i.status === "PENDING").length,
    overdue: invoices.filter((i) => i.status === "OVERDUE").length,
    total: invoices.length,
    totalPaid: invoices
      .filter((i) => i.status === "PAID")
      .reduce((sum, i) => sum + i.total, 0),
    totalPending: invoices
      .filter((i) => i.status === "PENDING")
      .reduce((sum, i) => sum + i.total, 0),
    totalOverdue: invoices
      .filter((i) => i.status === "OVERDUE")
      .reduce((sum, i) => sum + i.total, 0),
    totalValue: invoices.reduce((sum, i) => sum + i.total, 0),
  };

  const refreshInvoices = async () => {
    const data = await getAdminInvoices();
    setInvoices(data);
  };

  const addLineItem = () =>
    setLineItems((items) => [
      ...items,
      { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
    ]);

  const removeLineItem = (index: number) =>
    setLineItems((items) => items.filter((_, i) => i !== index));

  const updateLineItem = (
    index: number,
    field: "description" | "quantity" | "rate",
    value: string | number,
  ) => {
    setLineItems((items) =>
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0,
  );
  const total = subtotal + tax;

  const handleCreateInvoice = async () => {
    if (!projectId || !dueDate) return;
    try {
      await createAdminInvoice({
        projectId,
        dueDate,
        tax,
        notes: notes || undefined,
        lineItems: lineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
        })),
      });
      await refreshInvoices();
      setIsInvoiceModalOpen(false);
      setProjectId("");
      setDueDate("");
      setTax(0);
      setNotes("");
      setLineItems([
        { id: crypto.randomUUID(), description: "", quantity: 1, rate: 0 },
      ]);
    } catch (err) {
      console.error(err);
      setToastMessage("Unable to create invoice.");
    }
  };

  const handleApprove = async (id: string) => {
    await approveInvoice(id);
    await refreshInvoices();
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason");
    if (!reason) return;
    await rejectInvoice(id, reason);
    await refreshInvoices();
  };

  const handleConfirmPayment = async (id: string) => {
    await confirmInvoicePayment(id);
    await refreshInvoices();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toastMessage && (
        <Toast
          message={toastMessage}
          tone="error"
          onClose={() => setToastMessage(null)}
        />
      )}
      <AuthNavbar
        currentPage="admin"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
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
                    Billing
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage invoices, and financial agreements
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInvoiceModalOpen(true)}
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
              <h3 className="text-gray-600 text-sm mb-2">Total Invoices</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {invoiceStats.total}
              </p>
              <p className="text-xs" style={{ color: "#4169e1" }}>
                ₦{(invoiceStats.totalValue / 1000).toFixed(0)}K total value
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
                ₦{(invoiceStats.totalPaid / 1000).toFixed(0)}K received
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
                ₦{(invoiceStats.totalPending / 1000).toFixed(0)}K pending
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
                ₦{(invoiceStats.totalOverdue / 1000).toFixed(0)}K overdue
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-md mb-6">
            <div className="flex border-b border-gray-200">
              {/* <button
                onClick={() => setActiveTab("contracts")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ₦{
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
              </button> */}
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
                  {/* {activeTab === "contracts" ? (
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
                  ) : ( */}
                  <select
                    value={invoiceStatusFilter}
                    onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="PAID">Paid</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="OVERDUE">Overdue</option>
                    <option value="DRAFT">Draft</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Table */}
          {/* {activeTab === "contracts" && (
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
                            ₦{contract.value.toLocaleString()}
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
          )} */}

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
                                {invoice.clientName}
                              </span>
                            </div>
                            {invoice.clientMarkedPaid && (
                              <p className="text-xs text-gray-500">
                                Client marked paid
                              </p>
                            )}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {invoice.projectName}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {formatDate(invoice.issueDate)}
                          </td>
                          <td className="py-4 px-6 text-gray-600 text-sm">
                            {formatDate(invoice.dueDate)}
                          </td>
                          <td
                            className="py-4 px-6 text-right font-medium"
                            style={{ color: "#001f54" }}
                          >
                            ₦{invoice.total.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            {getInvoiceStatusBadge(invoice.status)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={async () => {
                                  try {
                                    await downloadFile(
                                      invoice.invoiceUrl,
                                      `invoice-${invoice.invoiceNumber}.pdf`,
                                    );
                                  } catch (err) {
                                    console.error(err);
                                    setToastMessage("Unable to download invoice.");
                                  }
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Download Invoice"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                              {invoice.receiptUrl && (
                                <button
                                  onClick={async () => {
                                    try {
                                      await downloadFile(
                                        invoice.receiptUrl ?? "",
                                        `receipt-${invoice.invoiceNumber}.pdf`,
                                      );
                                    } catch (err) {
                                      console.error(err);
                                      setToastMessage("Unable to download receipt.");
                                    }
                                  }}
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Download Receipt"
                                >
                                  <Receipt className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                              {invoice.status === "PENDING" && (
                                <button
                                  onClick={() => handleApprove(invoice.id)}
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Approve Invoice"
                                >
                                  <CheckCircle className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                              {invoice.status === "PENDING" && (
                                <button
                                  onClick={() => handleReject(invoice.id)}
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Reject Invoice"
                                >
                                  <XCircle className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                              {(invoice.status === "APPROVED" ||
                                invoice.status === "PENDING") && (
                                <button
                                  onClick={() =>
                                    handleConfirmPayment(invoice.id)
                                  }
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="Confirm Payment"
                                >
                                  <CreditCard className="w-4 h-4 text-gray-600" />
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

      {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold" style={{ color: "#001f54" }}>
                Create Invoice
              </h3>
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Project
                  </label>
                  <select
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Select project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                        {project.client?.name
                          ? ` - ${project.client?.name}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3"
                  >
                    <input
                      className="md:col-span-6 border rounded-lg px-3 py-2"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(index, "description", e.target.value)
                      }
                    />
                    <input
                      className="md:col-span-2 border rounded-lg px-3 py-2"
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(
                          index,
                          "quantity",
                          Number(e.target.value),
                        )
                      }
                    />
                    <input
                      className="md:col-span-2 border rounded-lg px-3 py-2"
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) =>
                        updateLineItem(index, "rate", Number(e.target.value))
                      }
                    />
                    <div className="md:col-span-2 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        ₦{(item.quantity * item.rate).toLocaleString()}
                      </span>
                      <button
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        onClick={() => removeLineItem(index)}
                        type="button"
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addLineItem}
                  className="inline-flex items-center gap-2 text-sm text-blue-600"
                  type="button"
                >
                  <Plus className="w-4 h-4" /> Add line item
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">
                    Tax
                  </label>
                  <input
                    type="number"
                    value={tax}
                    onChange={(e) => setTax(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Subtotal: ₦{subtotal.toLocaleString()}</p>
                  <p>Tax: ₦{tax.toLocaleString()}</p>
                  <p
                    className="text-lg font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Total: ₦{total.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleCreateInvoice}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white"
                  style={{ backgroundColor: "#4169e1" }}
                >
                  <FileText className="w-4 h-4" /> Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
