import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  Upload,
  Download,
  FileText,
  FolderKanban,
  Calendar,
  User,
  ChevronDown,
  X,
  Check,
  Database,
  File,
} from "lucide-react";

interface UploadedFile {
  id: number;
  filename: string;
  documentName: string;
  version: string;
  projectName: string;
  projectId: number;
  category: "Dataset" | "Report";
  groupName?: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
}

export default function StaffUploadDataPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<
    "All" | "Dataset" | "Report"
  >("All");

  // Upload form state
  const [uploadDocumentName, setUploadDocumentName] = useState("");
  const [uploadGroupName, setUploadGroupName] = useState("");
  const [uploadCategory, setUploadCategory] = useState<"Dataset" | "Report">(
    "Dataset",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Mock projects data
  const projects = [
    { id: 1, name: "Website Redesign", client: "Acme Corporation" },
    { id: 2, name: "Mobile App Development", client: "TechStart Inc" },
    { id: 3, name: "E-commerce Platform", client: "Retail Solutions" },
    { id: 4, name: "Brand Identity Package", client: "Creative Studios" },
    { id: 5, name: "CRM System Integration", client: "Enterprise Solutions" },
  ];

  // Mock uploaded files data
  const allFiles: UploadedFile[] = [
    {
      id: 1,
      filename: "user_research_data.xlsx",
      documentName: "User Research Data",
      version: "v1.2",
      projectName: "Website Redesign",
      projectId: 1,
      category: "Dataset",
      groupName: "Research",
      uploadedBy: "Emily Davis",
      uploadDate: "Jan 18, 2026",
      size: "5.2 MB",
    },
    {
      id: 2,
      filename: "analytics_dashboard_export.csv",
      documentName: "Analytics Dashboard Export",
      version: "v1.0",
      projectName: "Website Redesign",
      projectId: 1,
      category: "Dataset",
      groupName: "Analytics",
      uploadedBy: "Sarah Chen",
      uploadDate: "Jan 12, 2026",
      size: "8.5 MB",
    },
    {
      id: 3,
      filename: "project_requirements.pdf",
      documentName: "Project Requirements",
      version: "v2.1",
      projectName: "Website Redesign",
      projectId: 1,
      category: "Report",
      groupName: "Documentation",
      uploadedBy: "Emily Davis",
      uploadDate: "Dec 20, 2025",
      size: "2.4 MB",
    },
    {
      id: 4,
      filename: "technical_specifications.pdf",
      documentName: "Technical Specifications",
      version: "v1.2",
      projectName: "Website Redesign",
      projectId: 1,
      category: "Report",
      uploadedBy: "Mike Johnson",
      uploadDate: "Jan 8, 2026",
      size: "1.8 MB",
    },
    {
      id: 5,
      filename: "customer_survey_results.xlsx",
      documentName: "Customer Survey Results",
      version: "v1.0",
      projectName: "Mobile App Development",
      projectId: 2,
      category: "Dataset",
      groupName: "Research",
      uploadedBy: "David Kim",
      uploadDate: "Jan 15, 2026",
      size: "3.7 MB",
    },
    {
      id: 6,
      filename: "api_integration_report.pdf",
      documentName: "API Integration Report",
      version: "v1.1",
      projectName: "Mobile App Development",
      projectId: 2,
      category: "Report",
      uploadedBy: "Mike Johnson",
      uploadDate: "Jan 10, 2026",
      size: "4.2 MB",
    },
    {
      id: 7,
      filename: "ecommerce_inventory_data.csv",
      documentName: "E-commerce Inventory Data",
      version: "v2.0",
      projectName: "E-commerce Platform",
      projectId: 3,
      category: "Dataset",
      groupName: "Inventory",
      uploadedBy: "Jordan Lee",
      uploadDate: "Jan 5, 2026",
      size: "12.3 MB",
    },
  ];

  // Filter files
  const filteredFiles = allFiles.filter((file) => {
    const matchesProject =
      !selectedProject || file.projectId === selectedProject;
    const matchesCategory =
      categoryFilter === "All" || file.category === categoryFilter;
    return matchesProject && matchesCategory;
  });

  // Group files by category
  const datasetFiles = filteredFiles.filter((f) => f.category === "Dataset");
  const reportFiles = filteredFiles.filter((f) => f.category === "Report");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadDocumentName || !selectedProject) return;
    console.log("Uploading file:", {
      file: selectedFile.name,
      documentName: uploadDocumentName,
      groupName: uploadGroupName,
      category: uploadCategory,
      projectId: selectedProject,
    });
    // Reset form
    setSelectedFile(null);
    setUploadDocumentName("");
    setUploadGroupName("");
    setUploadCategory("Dataset");
    setShowUploadModal(false);
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <StaffSidebar activeItem="upload" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
              Upload Data
            </h1>
            <p className="text-gray-600">
              Upload and manage datasets and project files
            </p>
          </div>

          {/* Project Selector & Upload Panel */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project *
                </label>
                <div className="relative">
                  <FolderKanban
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    value={selectedProject || ""}
                    onChange={(e) =>
                      setSelectedProject(Number(e.target.value) || null)
                    }
                    className="w-full pl-11 pr-10 py-3 border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer"
                    style={
                      {
                        borderColor: "#e5e7eb",
                        "--tw-ring-color": "#4169e1",
                        color: "#001f54",
                      } as React.CSSProperties
                    }
                  >
                    <option value="">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name} - {project.client}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
                {selectedProjectData && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected:{" "}
                    <span className="font-medium">
                      {selectedProjectData.name}
                    </span>
                  </p>
                )}
              </div>

              {/* Upload Button */}
              <div className="flex items-end">
                <button
                  onClick={() => setShowUploadModal(true)}
                  disabled={!selectedProject}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  <Upload className="w-5 h-5" />
                  Upload File
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium text-gray-700">
              Filter by Category:
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  categoryFilter === "All"
                    ? "text-white"
                    : "border hover:bg-gray-50"
                }`}
                style={
                  categoryFilter === "All"
                    ? { backgroundColor: "#4169e1" }
                    : { borderColor: "#e5e7eb", color: "#374151" }
                }
              >
                All Files
              </button>
              <button
                onClick={() => setCategoryFilter("Dataset")}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  categoryFilter === "Dataset"
                    ? "text-white"
                    : "border hover:bg-gray-50"
                }`}
                style={
                  categoryFilter === "Dataset"
                    ? { backgroundColor: "#9333ea" }
                    : { borderColor: "#e5e7eb", color: "#374151" }
                }
              >
                <Database className="w-4 h-4 inline mr-1" />
                Datasets
              </button>
              <button
                onClick={() => setCategoryFilter("Report")}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  categoryFilter === "Report"
                    ? "text-white"
                    : "border hover:bg-gray-50"
                }`}
                style={
                  categoryFilter === "Report"
                    ? { backgroundColor: "#32cd32" }
                    : { borderColor: "#e5e7eb", color: "#374151" }
                }
              >
                <File className="w-4 h-4 inline mr-1" />
                Reports
              </button>
            </div>
          </div>

          {/* Datasets Section */}
          {(categoryFilter === "All" || categoryFilter === "Dataset") &&
            datasetFiles.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Database className="w-5 h-5" style={{ color: "#9333ea" }} />
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Datasets
                  </h2>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: "#9333ea20", color: "#9333ea" }}
                  >
                    {datasetFiles.length}
                  </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead
                        className="bg-gray-50 border-b"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Document Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Filename
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Version
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Group
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Uploaded
                          </th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        {datasetFiles.map((file) => (
                          <tr
                            key={file.id}
                            className="hover:bg-gray-50 transition-all"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: "#9333ea20" }}
                                >
                                  <Database
                                    className="w-4 h-4"
                                    style={{ color: "#9333ea" }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {file.documentName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {file.size}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900 font-mono">
                                {file.filename}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{
                                  backgroundColor: "#9333ea20",
                                  color: "#9333ea",
                                }}
                              >
                                {file.version}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {file.projectName}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {file.groupName && (
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">
                                  {file.groupName}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <p className="text-gray-900">
                                  {file.uploadDate}
                                </p>
                                <p className="text-xs text-gray-500">
                                  by {file.uploadedBy}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                title="Download"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          {/* Reports Section */}
          {(categoryFilter === "All" || categoryFilter === "Report") &&
            reportFiles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5" style={{ color: "#32cd32" }} />
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Reports
                  </h2>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{ backgroundColor: "#32cd3220", color: "#32cd32" }}
                  >
                    {reportFiles.length}
                  </span>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead
                        className="bg-gray-50 border-b"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Document Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Filename
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Version
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Project
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Group
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Uploaded
                          </th>
                          <th className="px-6 py-3"></th>
                        </tr>
                      </thead>
                      <tbody
                        className="divide-y"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        {reportFiles.map((file) => (
                          <tr
                            key={file.id}
                            className="hover:bg-gray-50 transition-all"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: "#32cd3220" }}
                                >
                                  <FileText
                                    className="w-4 h-4"
                                    style={{ color: "#32cd32" }}
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {file.documentName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {file.size}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900 font-mono">
                                {file.filename}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className="text-xs px-2 py-1 rounded-full font-medium"
                                style={{
                                  backgroundColor: "#32cd3220",
                                  color: "#32cd32",
                                }}
                              >
                                {file.version}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {file.projectName}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {file.groupName && (
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-700">
                                  {file.groupName}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm">
                                <p className="text-gray-900">
                                  {file.uploadDate}
                                </p>
                                <p className="text-xs text-gray-500">
                                  by {file.uploadedBy}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                title="Download"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          {/* Empty State */}
          {filteredFiles.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <Upload className="w-8 h-8" style={{ color: "#4169e1" }} />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "#001f54" }}
              >
                No files found
              </h3>
              <p className="text-gray-600 mb-4">
                {!selectedProject
                  ? "Select a project to view and upload files"
                  : "No files have been uploaded for this project yet"}
              </p>
              {selectedProject && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  <Upload className="w-5 h-5" />
                  Upload First File
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{ color: "#001f54" }}
              >
                Upload File
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Project Info */}
              {selectedProjectData && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-700">
                    <strong>Uploading to:</strong> {selectedProjectData.name} (
                    {selectedProjectData.client})
                  </p>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select File *
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center transition-all hover:border-blue-400"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    {selectedFile ? (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Check
                          className="w-5 h-5"
                          style={{ color: "#32cd32" }}
                        />
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 mb-2">
                        Click to browse or drag and drop
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      All file types supported (Max 50MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Document Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter a descriptive name for this document..."
                  value={uploadDocumentName}
                  onChange={(e) => setUploadDocumentName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setUploadCategory("Dataset")}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      uploadCategory === "Dataset" ? "" : "hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor:
                        uploadCategory === "Dataset" ? "#9333ea" : "#e5e7eb",
                      backgroundColor:
                        uploadCategory === "Dataset"
                          ? "#9333ea10"
                          : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#9333ea20" }}
                      >
                        <Database
                          className="w-5 h-5"
                          style={{ color: "#9333ea" }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dataset</p>
                        <p className="text-xs text-gray-600">Raw data files</p>
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => setUploadCategory("Report")}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      uploadCategory === "Report" ? "" : "hover:bg-gray-50"
                    }`}
                    style={{
                      borderColor:
                        uploadCategory === "Report" ? "#32cd32" : "#e5e7eb",
                      backgroundColor:
                        uploadCategory === "Report"
                          ? "#32cd3210"
                          : "transparent",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "#32cd3220" }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: "#32cd32" }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Report</p>
                        <p className="text-xs text-gray-600">
                          Documents & reports
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Research, Analytics, Documentation"
                  value={uploadGroupName}
                  onChange={(e) => setUploadGroupName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Organize files into groups for easier management
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: "#e5e7eb" }}
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 border rounded-lg font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !uploadDocumentName}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
