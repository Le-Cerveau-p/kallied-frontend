import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  Package,
  DollarSign,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";

interface ProcurementItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  supplier: string;
  category: string;
}

interface ProcurementRequest {
  id: string;
  title: string;
  project: string;
  projectId: string;
  requestedBy: string;
  requestedByRole: string;
  dateSubmitted: string;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  totalEstimatedCost: number;
  items: ProcurementItem[];
  description: string;
  attachedDocuments: string[];
  notes?: string;
  rejectionReason?: string;
}

export default function AdminProcurementManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<ProcurementRequest | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Mock data for procurement requests
  const procurementRequests: ProcurementRequest[] = [
    {
      id: "PR-001",
      title: "AWS Cloud Credits & Infrastructure",
      project: "Cloud Migration Project",
      projectId: "PROJ-045",
      requestedBy: "David Kim",
      requestedByRole: "Senior DevOps Engineer",
      dateSubmitted: "Jan 21, 2026",
      status: "Submitted",
      totalEstimatedCost: 5200,
      description:
        "Required cloud credits and infrastructure resources for Q1 2026 cloud migration initiative.",
      items: [
        {
          id: "1",
          name: "AWS Cloud Credits",
          quantity: 1,
          unitCost: 3500,
          totalCost: 3500,
          supplier: "Amazon Web Services",
          category: "Cloud Services",
        },
        {
          id: "2",
          name: "CloudWatch Monitoring",
          quantity: 12,
          unitCost: 100,
          totalCost: 1200,
          supplier: "Amazon Web Services",
          category: "Monitoring",
        },
        {
          id: "3",
          name: "Route53 DNS Service",
          quantity: 1,
          unitCost: 500,
          totalCost: 500,
          supplier: "Amazon Web Services",
          category: "Network",
        },
      ],
      attachedDocuments: [
        "AWS_Quote_Jan2026.pdf",
        "Migration_Budget_Breakdown.xlsx",
      ],
      notes: "Urgent - Required by Feb 1st to maintain migration timeline",
    },
    {
      id: "PR-002",
      title: "Design Software Licenses",
      project: "E-Commerce Platform Redesign",
      projectId: "PROJ-032",
      requestedBy: "Sarah Johnson",
      requestedByRole: "Lead UX Designer",
      dateSubmitted: "Jan 22, 2026",
      status: "Submitted",
      totalEstimatedCost: 1800,
      description:
        "Annual licenses for design tools needed for the redesign project team.",
      items: [
        {
          id: "1",
          name: "Figma Professional (3 seats)",
          quantity: 3,
          unitCost: 360,
          totalCost: 1080,
          supplier: "Figma Inc.",
          category: "Software",
        },
        {
          id: "2",
          name: "Adobe Creative Cloud",
          quantity: 2,
          unitCost: 360,
          totalCost: 720,
          supplier: "Adobe Systems",
          category: "Software",
        },
      ],
      attachedDocuments: ["License_Quote_Figma.pdf", "Adobe_Quote.pdf"],
    },
    {
      id: "PR-003",
      title: "Server Hardware Upgrade",
      project: "Infrastructure Upgrade",
      projectId: "PROJ-051",
      requestedBy: "Lisa Anderson",
      requestedByRole: "Infrastructure Manager",
      dateSubmitted: "Jan 23, 2026",
      status: "Submitted",
      totalEstimatedCost: 12500,
      description:
        "New server hardware for on-premise infrastructure upgrade to support growing workloads.",
      items: [
        {
          id: "1",
          name: "Dell PowerEdge R750",
          quantity: 2,
          unitCost: 4500,
          totalCost: 9000,
          supplier: "Dell Technologies",
          category: "Hardware",
        },
        {
          id: "2",
          name: "32GB RAM Modules",
          quantity: 8,
          unitCost: 250,
          totalCost: 2000,
          supplier: "Kingston Technology",
          category: "Hardware",
        },
        {
          id: "3",
          name: "2TB NVMe SSD",
          quantity: 4,
          unitCost: 375,
          totalCost: 1500,
          supplier: "Samsung",
          category: "Storage",
        },
      ],
      attachedDocuments: [
        "Dell_Quote_2026.pdf",
        "Hardware_Specs.pdf",
        "Capacity_Planning.xlsx",
      ],
      notes: "Hardware needs to be delivered by Feb 15th",
    },
    {
      id: "PR-004",
      title: "Development Tools & API Subscriptions",
      project: "Mobile App Development",
      projectId: "PROJ-038",
      requestedBy: "Mike Chen",
      requestedByRole: "Mobile Development Lead",
      dateSubmitted: "Jan 18, 2026",
      status: "Approved",
      totalEstimatedCost: 2400,
      description:
        "Monthly API subscriptions and development tools for mobile app development.",
      items: [
        {
          id: "1",
          name: "Firebase Suite (Premium)",
          quantity: 1,
          unitCost: 1200,
          totalCost: 1200,
          supplier: "Google Cloud",
          category: "Cloud Services",
        },
        {
          id: "2",
          name: "Mapbox API Credits",
          quantity: 1,
          unitCost: 800,
          totalCost: 800,
          supplier: "Mapbox Inc.",
          category: "API Services",
        },
        {
          id: "3",
          name: "Stripe Payment Gateway",
          quantity: 1,
          unitCost: 400,
          totalCost: 400,
          supplier: "Stripe Inc.",
          category: "Payment Services",
        },
      ],
      attachedDocuments: ["API_Quotes_Bundle.pdf"],
    },
    {
      id: "PR-005",
      title: "Testing Tools & QA Software",
      project: "E-Commerce Platform Redesign",
      projectId: "PROJ-032",
      requestedBy: "Emily Rodriguez",
      requestedByRole: "QA Manager",
      dateSubmitted: "Jan 15, 2026",
      status: "Rejected",
      totalEstimatedCost: 3200,
      description:
        "Automated testing tools and QA software for comprehensive testing coverage.",
      items: [
        {
          id: "1",
          name: "Selenium Grid License",
          quantity: 5,
          unitCost: 400,
          totalCost: 2000,
          supplier: "BrowserStack",
          category: "Testing",
        },
        {
          id: "2",
          name: "JIRA Test Management",
          quantity: 10,
          unitCost: 120,
          totalCost: 1200,
          supplier: "Atlassian",
          category: "Project Management",
        },
      ],
      attachedDocuments: ["Testing_Tools_Quote.pdf"],
      rejectionReason:
        "Budget constraints - Please resubmit with reduced scope or defer to Q2",
    },
    {
      id: "PR-006",
      title: "Office Equipment for New Hires",
      project: "General Operations",
      projectId: "PROJ-000",
      requestedBy: "HR Department",
      requestedByRole: "HR Manager",
      dateSubmitted: "Jan 20, 2026",
      status: "Draft",
      totalEstimatedCost: 8500,
      description:
        "Office equipment and workstation setup for 5 new hires joining in February.",
      items: [
        {
          id: "1",
          name: 'MacBook Pro 16"',
          quantity: 5,
          unitCost: 1500,
          totalCost: 7500,
          supplier: "Apple Inc.",
          category: "Hardware",
        },
        {
          id: "2",
          name: 'External Monitor 27"',
          quantity: 5,
          unitCost: 200,
          totalCost: 1000,
          supplier: "Dell",
          category: "Peripherals",
        },
      ],
      attachedDocuments: [],
    },
  ];

  // Filter requests based on search and status
  const filteredRequests = procurementRequests.filter((request) => {
    const matchesSearch =
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      Draft: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
      },
      Submitted: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-300",
      },
      Approved: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-300",
      },
      Rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-300",
      },
    };
    const style = styles[status as keyof typeof styles] || styles.Draft;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
      >
        {status}
      </span>
    );
  };

  // Handle approve request
  const handleApprove = (request: ProcurementRequest) => {
    console.log("Approving request:", request.id);
    // In a real app, this would update the backend
    alert(`Procurement request ${request.id} approved!`);
  };

  // Handle reject request
  const handleReject = (request: ProcurementRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  // Submit rejection
  const submitRejection = () => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    console.log(
      "Rejecting request:",
      selectedRequest?.id,
      "Reason:",
      rejectionReason,
    );
    alert(`Procurement request ${selectedRequest?.id} rejected!`);
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  // Generate Purchase Order
  const generatePO = (request: ProcurementRequest) => {
    console.log("Generating PO for:", request.id);
    alert(
      `Purchase Order generated for ${request.id}!\n\nThis would download a PO document in a real application.`,
    );
  };

  // Toggle request details
  const toggleExpand = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  // Summary stats
  const stats = {
    total: procurementRequests.length,
    submitted: procurementRequests.filter((r) => r.status === "Submitted")
      .length,
    approved: procurementRequests.filter((r) => r.status === "Approved").length,
    rejected: procurementRequests.filter((r) => r.status === "Rejected").length,
    totalValue: procurementRequests.reduce(
      (sum, r) => sum + r.totalEstimatedCost,
      0,
    ),
    pendingValue: procurementRequests
      .filter((r) => r.status === "Submitted")
      .reduce((sum, r) => sum + r.totalEstimatedCost, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="procurement" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#fce4ec" }}
              >
                <ShoppingCart
                  className="w-8 h-8"
                  style={{ color: "#d4183d" }}
                />
              </div>
              <div>
                <h1 className="text-4xl" style={{ color: "#001f54" }}>
                  Procurement Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and approve procurement requests across all projects
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <Package className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Total Requests</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {stats.total}
              </p>
              <p className="text-xs text-gray-500">
                {stats.submitted} pending approval
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-100">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Pending Approval</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                {stats.submitted}
              </p>
              <p className="text-xs text-gray-500">Requires action</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <DollarSign
                    className="w-6 h-6"
                    style={{ color: "#a7fc00" }}
                  />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Total Value</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                ${stats.totalValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">All requests</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-red-100">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm mb-2">Pending Value</h3>
              <p className="text-3xl mb-1" style={{ color: "#001f54" }}>
                ${stats.pendingValue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by title, project, ID, or requester..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="sm:w-64">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Draft">Draft</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Procurement Requests List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl" style={{ color: "#001f54" }}>
                Procurement Requests ({filteredRequests.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredRequests.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No procurement requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Request Header */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-2">
                            <h3
                              className="text-lg font-medium"
                              style={{ color: "#001f54" }}
                            >
                              {request.title}
                            </h3>
                            {getStatusBadge(request.status)}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">
                                ID:
                              </span>
                              <span className="font-mono">{request.id}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              <span>{request.project}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{request.requestedBy}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{request.dateSubmitted}</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <span
                              className="text-sm font-medium"
                              style={{ color: "#4169e1" }}
                            >
                              Total: $
                              {request.totalEstimatedCost.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {request.items.length} items
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                          {request.status === "Submitted" && (
                            <>
                              <button
                                onClick={() => handleApprove(request)}
                                className="px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                                style={{
                                  backgroundColor: "#a7fc00",
                                  color: "#001f54",
                                }}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(request)}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                          {request.status === "Approved" && (
                            <button
                              onClick={() => generatePO(request)}
                              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                              style={{ backgroundColor: "#4169e1" }}
                            >
                              <FileText className="w-4 h-4" />
                              Generate PO
                            </button>
                          )}
                          <button
                            onClick={() => toggleExpand(request.id)}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            style={{ color: "#001f54" }}
                          >
                            <Eye className="w-4 h-4" />
                            Details
                            {expandedRequest === request.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedRequest === request.id && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          {/* Description */}
                          <div className="mb-6">
                            <h4
                              className="text-sm font-medium mb-2"
                              style={{ color: "#001f54" }}
                            >
                              Description
                            </h4>
                            <p className="text-sm text-gray-600">
                              {request.description}
                            </p>
                          </div>

                          {/* Items Table */}
                          <div className="mb-6">
                            <h4
                              className="text-sm font-medium mb-3"
                              style={{ color: "#001f54" }}
                            >
                              Procurement Items
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                                      Item
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                                      Category
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                                      Quantity
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                                      Unit Cost
                                    </th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">
                                      Total
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">
                                      Supplier
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {request.items.map((item) => (
                                    <tr
                                      key={item.id}
                                      className="border-b border-gray-100"
                                    >
                                      <td className="py-3 px-4">{item.name}</td>
                                      <td className="py-3 px-4">
                                        <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs">
                                          {item.category}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4 text-right">
                                        {item.quantity}
                                      </td>
                                      <td className="py-3 px-4 text-right">
                                        ${item.unitCost.toLocaleString()}
                                      </td>
                                      <td
                                        className="py-3 px-4 text-right font-medium"
                                        style={{ color: "#4169e1" }}
                                      >
                                        ${item.totalCost.toLocaleString()}
                                      </td>
                                      <td className="py-3 px-4 text-gray-600">
                                        {item.supplier}
                                      </td>
                                    </tr>
                                  ))}
                                  <tr className="bg-gray-50 font-medium">
                                    <td
                                      colSpan={4}
                                      className="py-3 px-4 text-right"
                                      style={{ color: "#001f54" }}
                                    >
                                      Total Estimated Cost:
                                    </td>
                                    <td
                                      className="py-3 px-4 text-right text-lg"
                                      style={{ color: "#4169e1" }}
                                    >
                                      $
                                      {request.totalEstimatedCost.toLocaleString()}
                                    </td>
                                    <td></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* Attached Documents */}
                          {request.attachedDocuments.length > 0 && (
                            <div className="mb-6">
                              <h4
                                className="text-sm font-medium mb-3"
                                style={{ color: "#001f54" }}
                              >
                                Attached Documents
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {request.attachedDocuments.map((doc, index) => (
                                  <button
                                    key={index}
                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                  >
                                    <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 flex-1 truncate">
                                      {doc}
                                    </span>
                                    <Download className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {request.notes && (
                            <div className="mb-6">
                              <h4
                                className="text-sm font-medium mb-2"
                                style={{ color: "#001f54" }}
                              >
                                Notes
                              </h4>
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800">
                                  {request.notes}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Rejection Reason */}
                          {request.status === "Rejected" &&
                            request.rejectionReason && (
                              <div>
                                <h4
                                  className="text-sm font-medium mb-2"
                                  style={{ color: "#001f54" }}
                                >
                                  Rejection Reason
                                </h4>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-sm text-red-800">
                                    {request.rejectionReason}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-medium" style={{ color: "#001f54" }}>
                Reject Procurement Request
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Request ID: {selectedRequest?.id} - {selectedRequest?.title}
              </p>
            </div>
            <div className="p-6">
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "#001f54" }}
              >
                Reason for Rejection *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a clear reason for rejecting this request..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="p-6 bg-gray-50 rounded-b-xl flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium border border-gray-300 hover:bg-gray-100 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="flex-1 px-4 py-3 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
