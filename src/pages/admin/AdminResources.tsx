import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  FolderOpen,
  Search,
  Filter,
  Upload,
  Download,
  Trash2,
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
  FileCode,
  Calendar,
  User,
  Eye,
  Plus,
  X,
  ChevronDown,
  CheckCircle,
} from "lucide-react";

interface ResourceDocument {
  id: string;
  name: string;
  category:
    | "Policy"
    | "Template"
    | "Training"
    | "Guide"
    | "Onboarding"
    | "Compliance"
    | "Technical"
    | "Other";
  fileType: "pdf" | "docx" | "xlsx" | "png" | "jpg" | "txt" | "zip" | "other";
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  downloadCount: number;
  description?: string;
}

export default function AdminResources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDocCategory, setNewDocCategory] =
    useState<ResourceDocument["category"]>("Policy");
  const [newDocDescription, setNewDocDescription] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Mock resource documents
  const [documents, setDocuments] = useState<ResourceDocument[]>([
    {
      id: "RES-001",
      name: "Employee_Handbook_2026.pdf",
      category: "Policy",
      fileType: "pdf",
      size: "2.4 MB",
      uploadedBy: "Admin User",
      uploadedDate: "Jan 15, 2026",
      downloadCount: 127,
      description: "Company-wide employee policies and procedures handbook",
    },
    {
      id: "RES-002",
      name: "Project_Proposal_Template.docx",
      category: "Template",
      fileType: "docx",
      size: "156 KB",
      uploadedBy: "Sarah Johnson",
      uploadedDate: "Jan 20, 2026",
      downloadCount: 89,
      description: "Standard template for client project proposals",
    },
    {
      id: "RES-003",
      name: "Security_Training_Video.mp4",
      category: "Training",
      fileType: "other",
      size: "145 MB",
      uploadedBy: "IT Security Team",
      uploadedDate: "Jan 10, 2026",
      downloadCount: 234,
      description: "Cybersecurity awareness training for all staff",
    },
    {
      id: "RES-004",
      name: "API_Documentation_Guide.pdf",
      category: "Technical",
      fileType: "pdf",
      size: "1.8 MB",
      uploadedBy: "David Kim",
      uploadedDate: "Jan 22, 2026",
      downloadCount: 67,
      description: "Complete API documentation and integration guide",
    },
    {
      id: "RES-005",
      name: "Onboarding_Checklist.xlsx",
      category: "Onboarding",
      fileType: "xlsx",
      size: "45 KB",
      uploadedBy: "HR Department",
      uploadedDate: "Jan 5, 2026",
      downloadCount: 156,
      description: "New employee onboarding task checklist",
    },
    {
      id: "RES-006",
      name: "GDPR_Compliance_Guidelines.pdf",
      category: "Compliance",
      fileType: "pdf",
      size: "3.2 MB",
      uploadedBy: "Legal Team",
      uploadedDate: "Dec 28, 2025",
      downloadCount: 98,
      description: "GDPR compliance policies and implementation guide",
    },
    {
      id: "RES-007",
      name: "Brand_Style_Guide.pdf",
      category: "Guide",
      fileType: "pdf",
      size: "8.5 MB",
      uploadedBy: "Marketing Team",
      uploadedDate: "Jan 18, 2026",
      downloadCount: 203,
      description: "Official brand guidelines and visual identity standards",
    },
    {
      id: "RES-008",
      name: "Budget_Template_Q1_2026.xlsx",
      category: "Template",
      fileType: "xlsx",
      size: "78 KB",
      uploadedBy: "Finance Department",
      uploadedDate: "Jan 12, 2026",
      downloadCount: 45,
      description: "Quarterly budget planning template",
    },
  ]);

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || doc.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (fileType: ResourceDocument["fileType"]) => {
    switch (fileType) {
      case "pdf":
      case "docx":
      case "txt":
        return FileText;
      case "xlsx":
        return FileSpreadsheet;
      case "png":
      case "jpg":
        return FileImage;
      case "zip":
        return FileCode;
      default:
        return File;
    }
  };

  const getCategoryColor = (category: ResourceDocument["category"]) => {
    switch (category) {
      case "Policy":
        return "bg-blue-100 text-blue-700";
      case "Template":
        return "bg-green-100 text-green-700";
      case "Training":
        return "bg-purple-100 text-purple-700";
      case "Guide":
        return "bg-orange-100 text-orange-700";
      case "Onboarding":
        return "bg-pink-100 text-pink-700";
      case "Compliance":
        return "bg-red-100 text-red-700";
      case "Technical":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    // Create new document
    const newDoc: ResourceDocument = {
      id: `RES-${String(documents.length + 1).padStart(3, "0")}`,
      name: selectedFile.name,
      category: newDocCategory,
      fileType:
        (selectedFile.name.split(".").pop() as ResourceDocument["fileType"]) ||
        "other",
      size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      uploadedBy: "Admin User",
      uploadedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      downloadCount: 0,
      description: newDocDescription,
    };

    setDocuments([newDoc, ...documents]);
    setUploadSuccess(true);

    // Reset form and show success message
    setTimeout(() => {
      setShowUploadModal(false);
      setSelectedFile(null);
      setNewDocCategory("Policy");
      setNewDocDescription("");
      setUploadSuccess(false);
    }, 1500);
  };

  const handleDelete = (docId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this document? This action cannot be undone.",
      )
    ) {
      setDocuments(documents.filter((doc) => doc.id !== docId));
    }
  };

  const handleDownload = (doc: ResourceDocument) => {
    // Update download count
    setDocuments(
      documents.map((d) =>
        d.id === doc.id ? { ...d, downloadCount: d.downloadCount + 1 } : d,
      ),
    );
    // In a real app, this would trigger an actual download
    alert(`Downloading ${doc.name}...`);
  };

  // Calculate stats
  const totalDocuments = documents.length;
  const totalDownloads = documents.reduce(
    (sum, doc) => sum + doc.downloadCount,
    0,
  );
  const categoryCounts = documents.reduce(
    (acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <AdminSidebar activeItem="resources" />

      <main className="lg:pl-64 pt-16">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#e6f0ff" }}
              >
                <FolderOpen className="w-6 h-6" style={{ color: "#4169e1" }} />
              </div>
              <div>
                <h1 className="text-2xl" style={{ color: "#001f54" }}>
                  Company Resources
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage company-wide documents and resources
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-2xl mt-1" style={{ color: "#001f54" }}>
                    {totalDocuments}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#e6f0ff" }}
                >
                  <File className="w-6 h-6" style={{ color: "#4169e1" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Downloads</p>
                  <p className="text-2xl mt-1" style={{ color: "#001f54" }}>
                    {totalDownloads}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#d4f4dd" }}
                >
                  <Download className="w-6 h-6" style={{ color: "#32cd32" }} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl mt-1" style={{ color: "#001f54" }}>
                    {Object.keys(categoryCounts).length}
                  </p>
                </div>
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "#e6f0ff" }}
                >
                  <FolderOpen
                    className="w-6 h-6"
                    style={{ color: "#4169e1" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="Policy">Policy</option>
                  <option value="Template">Template</option>
                  <option value="Training">Training</option>
                  <option value="Guide">Guide</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Technical">Technical</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* Upload Button */}
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-2 rounded-lg text-white flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
                style={{ backgroundColor: "#4169e1" }}
              >
                <Upload className="w-5 h-5" />
                Upload Document
              </button>
            </div>

            {/* Results count */}
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredDocuments.length} of {totalDocuments} documents
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">
                      Document
                    </th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">
                      Category
                    </th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">
                      Uploaded By
                    </th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">
                      Date
                    </th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">
                      Size
                    </th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">
                      Downloads
                    </th>
                    <th className="text-right px-6 py-3 text-sm text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDocuments.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No documents found
                      </td>
                    </tr>
                  ) : (
                    filteredDocuments.map((doc) => {
                      const FileIcon = getFileIcon(doc.fileType);
                      return (
                        <tr
                          key={doc.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-gray-100 flex-shrink-0">
                                <FileIcon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 break-all">
                                  {doc.name}
                                </div>
                                {doc.description && (
                                  <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                    {doc.description}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(
                                doc.category,
                              )}`}
                            >
                              {doc.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 text-sm">
                                {doc.uploadedBy}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700 text-sm">
                                {doc.uploadedDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700 text-sm">
                              {doc.size}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-700 text-sm">
                              {doc.downloadCount}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDownload(doc)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Download"
                              >
                                <Download
                                  className="w-5 h-5"
                                  style={{ color: "#32cd32" }}
                                />
                              </button>
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Preview"
                              >
                                <Eye className="w-5 h-5 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-6">
            {uploadSuccess ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl mb-2" style={{ color: "#001f54" }}>
                  Upload Successful!
                </h3>
                <p className="text-gray-600">
                  Document has been uploaded successfully
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl" style={{ color: "#001f54" }}>
                    Upload Document
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Select File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        type="file"
                        onChange={(e) =>
                          setSelectedFile(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="w-8 h-8 text-gray-400" />
                        {selectedFile ? (
                          <div className="text-sm">
                            <span className="text-gray-900 font-medium">
                              {selectedFile.name}
                            </span>
                            <br />
                            <span className="text-gray-500">
                              {(selectedFile.size / 1024).toFixed(0)} KB
                            </span>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-600">
                            Click to browse or drag and drop
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Category
                    </label>
                    <select
                      value={newDocCategory}
                      onChange={(e) =>
                        setNewDocCategory(
                          e.target.value as ResourceDocument["category"],
                        )
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Policy">Policy</option>
                      <option value="Template">Template</option>
                      <option value="Training">Training</option>
                      <option value="Guide">Guide</option>
                      <option value="Onboarding">Onboarding</option>
                      <option value="Compliance">Compliance</option>
                      <option value="Technical">Technical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newDocDescription}
                      onChange={(e) => setNewDocDescription(e.target.value)}
                      placeholder="Brief description of the document..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!selectedFile}
                      className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#4169e1" }}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
