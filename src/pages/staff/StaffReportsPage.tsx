import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  Upload,
  Download,
  FileText,
  FolderKanban,
  ChevronDown,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  History,
  Send,
  Check,
} from "lucide-react";

interface ReportVersion {
  id: number;
  version: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  filename: string;
}

interface Report {
  id: number;
  name: string;
  projectName: string;
  projectId: number;
  status: "Draft" | "Submitted" | "Approved" | "Revision Required";
  currentVersion: string;
  lastUpdated: string;
  versions: ReportVersion[];
  description?: string;
}

export default function StaffReportsPage() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState<Report | null>(
    null,
  );
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Upload form state
  const [uploadReportName, setUploadReportName] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isNewVersion, setIsNewVersion] = useState(false);
  const [replacingReport, setReplacingReport] = useState<Report | null>(null);

  // Mock projects data
  const projects = [
    { id: 1, name: "Website Redesign", client: "Acme Corporation" },
    { id: 2, name: "Mobile App Development", client: "TechStart Inc" },
    { id: 3, name: "E-commerce Platform", client: "Retail Solutions" },
    { id: 4, name: "Brand Identity Package", client: "Creative Studios" },
    { id: 5, name: "CRM System Integration", client: "Enterprise Solutions" },
  ];

  // Mock reports data
  const allReports: Report[] = [
    {
      id: 1,
      name: "Project Requirements Document",
      projectName: "Website Redesign",
      projectId: 1,
      status: "Approved",
      currentVersion: "v2.1",
      lastUpdated: "Dec 20, 2025",
      description: "Comprehensive project requirements and specifications",
      versions: [
        {
          id: 1,
          version: "v2.1",
          uploadedBy: "Emily Davis",
          uploadDate: "Dec 20, 2025",
          size: "2.4 MB",
          filename: "project_requirements_v2.1.pdf",
        },
        {
          id: 2,
          version: "v2.0",
          uploadedBy: "Emily Davis",
          uploadDate: "Dec 15, 2025",
          size: "2.3 MB",
          filename: "project_requirements_v2.0.pdf",
        },
        {
          id: 3,
          version: "v1.0",
          uploadedBy: "Sarah Chen",
          uploadDate: "Dec 1, 2025",
          size: "1.8 MB",
          filename: "project_requirements_v1.0.pdf",
        },
      ],
    },
    {
      id: 2,
      name: "Design Mockups Report",
      projectName: "Website Redesign",
      projectId: 1,
      status: "Submitted",
      currentVersion: "v3.0",
      lastUpdated: "Jan 15, 2026",
      description: "Final design mockups and component library documentation",
      versions: [
        {
          id: 1,
          version: "v3.0",
          uploadedBy: "Sarah Chen",
          uploadDate: "Jan 15, 2026",
          size: "15.8 MB",
          filename: "design_mockups_v3.0.pdf",
        },
        {
          id: 2,
          version: "v2.5",
          uploadedBy: "Sarah Chen",
          uploadDate: "Jan 10, 2026",
          size: "14.2 MB",
          filename: "design_mockups_v2.5.pdf",
        },
      ],
    },
    {
      id: 3,
      name: "Technical Specifications",
      projectName: "Website Redesign",
      projectId: 1,
      status: "Revision Required",
      currentVersion: "v1.2",
      lastUpdated: "Jan 8, 2026",
      description: "Technical architecture and implementation details",
      versions: [
        {
          id: 1,
          version: "v1.2",
          uploadedBy: "Mike Johnson",
          uploadDate: "Jan 8, 2026",
          size: "1.8 MB",
          filename: "technical_specs_v1.2.pdf",
        },
        {
          id: 2,
          version: "v1.1",
          uploadedBy: "Mike Johnson",
          uploadDate: "Jan 3, 2026",
          size: "1.5 MB",
          filename: "technical_specs_v1.1.pdf",
        },
      ],
    },
    {
      id: 4,
      name: "User Research Report",
      projectName: "Website Redesign",
      projectId: 1,
      status: "Draft",
      currentVersion: "v1.0",
      lastUpdated: "Jan 18, 2026",
      description: "Analysis of user interviews and survey results",
      versions: [
        {
          id: 1,
          version: "v1.0",
          uploadedBy: "Emily Davis",
          uploadDate: "Jan 18, 2026",
          size: "3.2 MB",
          filename: "user_research_v1.0.pdf",
        },
      ],
    },
    {
      id: 5,
      name: "API Integration Report",
      projectName: "Mobile App Development",
      projectId: 2,
      status: "Approved",
      currentVersion: "v1.1",
      lastUpdated: "Jan 10, 2026",
      description: "API endpoints documentation and integration guidelines",
      versions: [
        {
          id: 1,
          version: "v1.1",
          uploadedBy: "Mike Johnson",
          uploadDate: "Jan 10, 2026",
          size: "4.2 MB",
          filename: "api_integration_v1.1.pdf",
        },
        {
          id: 2,
          version: "v1.0",
          uploadedBy: "David Kim",
          uploadDate: "Jan 5, 2026",
          size: "3.8 MB",
          filename: "api_integration_v1.0.pdf",
        },
      ],
    },
    {
      id: 6,
      name: "Performance Analysis Report",
      projectName: "Mobile App Development",
      projectId: 2,
      status: "Submitted",
      currentVersion: "v2.0",
      lastUpdated: "Jan 20, 2026",
      description: "App performance metrics and optimization recommendations",
      versions: [
        {
          id: 1,
          version: "v2.0",
          uploadedBy: "David Kim",
          uploadDate: "Jan 20, 2026",
          size: "5.1 MB",
          filename: "performance_analysis_v2.0.pdf",
        },
      ],
    },
  ];

  // Filter reports
  const filteredReports = allReports.filter((report) => {
    return !selectedProject || report.projectId === selectedProject;
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !uploadReportName || !selectedProject) return;
    console.log("Uploading report:", {
      file: selectedFile.name,
      reportName: uploadReportName,
      description: uploadDescription,
      projectId: selectedProject,
      isNewVersion,
      replacingReport: replacingReport?.name,
    });
    // Reset form
    setSelectedFile(null);
    setUploadReportName("");
    setUploadDescription("");
    setIsNewVersion(false);
    setReplacingReport(null);
    setShowUploadModal(false);
  };

  const handleReplaceVersion = (report: Report) => {
    setReplacingReport(report);
    setUploadReportName(report.name);
    setUploadDescription(report.description || "");
    setIsNewVersion(true);
    setShowUploadModal(true);
  };

  const handleSubmitReport = (report: Report) => {
    console.log("Submitting report:", report.name);
    // Would update the status to 'Submitted'
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Draft":
        return { backgroundColor: "#71718220", color: "#717182", icon: Clock };
      case "Submitted":
        return { backgroundColor: "#4169e120", color: "#4169e1", icon: Clock };
      case "Approved":
        return {
          backgroundColor: "#32cd3220",
          color: "#32cd32",
          icon: CheckCircle,
        };
      case "Revision Required":
        return {
          backgroundColor: "#ff980020",
          color: "#ff9800",
          icon: AlertCircle,
        };
      default:
        return { backgroundColor: "#71718220", color: "#717182", icon: Clock };
    }
  };

  const selectedProjectData = projects.find((p) => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar />
      <StaffSidebar activeItem="reports" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-4xl mb-2" style={{ color: "#001f54" }}>
              Reports
            </h1>
            <p className="text-gray-600">
              Prepare and submit deliverables for projects
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
                  onClick={() => {
                    setReplacingReport(null);
                    setIsNewVersion(false);
                    setShowUploadModal(true);
                  }}
                  disabled={!selectedProject}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  <Upload className="w-5 h-5" />
                  Upload New Report
                </button>
              </div>
            </div>
          </div>

          {/* Reports List */}
          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <FileText className="w-8 h-8" style={{ color: "#4169e1" }} />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "#001f54" }}
              >
                No reports found
              </h3>
              <p className="text-gray-600 mb-4">
                {!selectedProject
                  ? "Select a project to view and upload reports"
                  : "No reports have been uploaded for this project yet"}
              </p>
              {selectedProject && (
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  <Upload className="w-5 h-5" />
                  Upload First Report
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const statusStyle = getStatusStyle(report.status);
                const StatusIcon = statusStyle.icon;

                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: "#4169e120" }}
                            >
                              <FileText
                                className="w-5 h-5"
                                style={{ color: "#4169e1" }}
                              />
                            </div>
                            <div className="flex-1">
                              <h3
                                className="text-lg font-semibold mb-1"
                                style={{ color: "#001f54" }}
                              >
                                {report.name}
                              </h3>
                              {report.description && (
                                <p className="text-sm text-gray-600">
                                  {report.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <span
                          className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full font-medium"
                          style={statusStyle}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {report.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Project
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.projectName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Current Version
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "#4169e1" }}
                          >
                            {report.currentVersion}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Last Updated
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.lastUpdated}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Total Versions
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            {report.versions.length}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {report.status === "Draft" && (
                          <button
                            onClick={() => handleSubmitReport(report)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                            style={{
                              backgroundColor: "#32cd32",
                              color: "white",
                            }}
                          >
                            <Send className="w-4 h-4" />
                            Submit Report
                          </button>
                        )}
                        <button
                          onClick={() => handleReplaceVersion(report)}
                          className="flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all hover:bg-gray-50"
                          style={{ borderColor: "#4169e1", color: "#4169e1" }}
                        >
                          <Upload className="w-4 h-4" />
                          Upload New Version
                        </button>
                        <button
                          onClick={() => setShowVersionHistory(report)}
                          className="flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all hover:bg-gray-50"
                          style={{ borderColor: "#e5e7eb", color: "#374151" }}
                        >
                          <History className="w-4 h-4" />
                          Version History ({report.versions.length})
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-all hover:bg-gray-50"
                          style={{ borderColor: "#e5e7eb", color: "#374151" }}
                        >
                          <Download className="w-4 h-4" />
                          Download Latest
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                {isNewVersion ? "Upload New Version" : "Upload New Report"}
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setReplacingReport(null);
                  setIsNewVersion(false);
                }}
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
                    <strong>Project:</strong> {selectedProjectData.name} (
                    {selectedProjectData.client})
                  </p>
                  {isNewVersion && replacingReport && (
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Updating:</strong> {replacingReport.name}{" "}
                      (Current: {replacingReport.currentVersion})
                    </p>
                  )}
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
                    accept=".pdf,.doc,.docx"
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
                      PDF, DOC, DOCX (Max 50MB)
                    </p>
                  </label>
                </div>
              </div>

              {/* Report Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter report name..."
                  value={uploadReportName}
                  onChange={(e) => setUploadReportName(e.target.value)}
                  disabled={isNewVersion}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Describe the contents and purpose of this report..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              {isNewVersion && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> This will create a new version of "
                    {replacingReport?.name}". Previous versions will be
                    preserved in the version history.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: "#e5e7eb" }}
            >
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setReplacingReport(null);
                  setIsNewVersion(false);
                }}
                className="px-6 py-3 border rounded-lg font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !uploadReportName}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                {isNewVersion ? "Upload New Version" : "Upload Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div>
                <h2
                  className="text-2xl font-semibold mb-1"
                  style={{ color: "#001f54" }}
                >
                  Version History
                </h2>
                <p className="text-sm text-gray-600">
                  {showVersionHistory.name}
                </p>
              </div>
              <button
                onClick={() => setShowVersionHistory(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-3">
                {showVersionHistory.versions.map((version, index) => (
                  <div
                    key={version.id}
                    className={`p-4 border rounded-lg ${
                      index === 0 ? "border-2" : ""
                    }`}
                    style={{
                      borderColor: index === 0 ? "#4169e1" : "#e5e7eb",
                      backgroundColor:
                        index === 0 ? "#4169e110" : "transparent",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#4169e120" }}
                      >
                        <FileText
                          className="w-5 h-5"
                          style={{ color: "#4169e1" }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-sm font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: "#4169e120",
                              color: "#4169e1",
                            }}
                          >
                            {version.version}
                          </span>
                          {index === 0 && (
                            <span
                              className="text-xs px-2 py-0.5 rounded font-medium"
                              style={{
                                backgroundColor: "#32cd3220",
                                color: "#32cd32",
                              }}
                            >
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-900 font-mono mb-1">
                          {version.filename}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-600">
                          <span>Uploaded by {version.uploadedBy}</span>
                          <span>•</span>
                          <span>{version.uploadDate}</span>
                          <span>•</span>
                          <span>{version.size}</span>
                        </div>
                      </div>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                        title="Download this version"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="p-6 border-t text-center"
              style={{ borderColor: "#e5e7eb" }}
            >
              <p className="text-sm text-gray-600">
                Total versions:{" "}
                <strong>{showVersionHistory.versions.length}</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
