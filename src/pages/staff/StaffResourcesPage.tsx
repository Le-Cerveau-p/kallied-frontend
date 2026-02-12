import { useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  BookOpen,
  Search,
  Download,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  File,
  Filter,
  Tag,
  Calendar,
} from "lucide-react";
import Toast from "../../components/Toast";

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  type:
    | "document"
    | "spreadsheet"
    | "presentation"
    | "image"
    | "video"
    | "other";
  fileSize: string;
  uploadedDate: string;
  tags: string[];
  downloadUrl: string;
}

export default function StaffResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mock resources data
  const resources: Resource[] = [
    {
      id: 1,
      title: "Project Proposal Template",
      description:
        "Standard template for creating client project proposals with sections for scope, timeline, and budget",
      category: "Templates",
      type: "document",
      fileSize: "245 KB",
      uploadedDate: "Jan 15, 2026",
      tags: ["proposal", "template", "client"],
      downloadUrl: "#",
    },
    {
      id: 2,
      title: "Brand Guidelines 2026",
      description:
        "Complete brand guidelines including logo usage, color palette, typography, and voice guidelines",
      category: "Brand Assets",
      type: "document",
      fileSize: "5.2 MB",
      uploadedDate: "Jan 10, 2026",
      tags: ["brand", "guidelines", "design"],
      downloadUrl: "#",
    },
    {
      id: 3,
      title: "Client Onboarding Checklist",
      description:
        "Step-by-step checklist for onboarding new clients, from initial meeting to project kickoff",
      category: "Guides",
      type: "spreadsheet",
      fileSize: "128 KB",
      uploadedDate: "Jan 5, 2026",
      tags: ["onboarding", "checklist", "process"],
      downloadUrl: "#",
    },
    {
      id: 4,
      title: "PowerBI Dashboard Design Best Practices",
      description:
        "Guidelines and examples for creating effective and visually appealing PowerBI dashboards",
      category: "Guides",
      type: "presentation",
      fileSize: "3.8 MB",
      uploadedDate: "Dec 28, 2025",
      tags: ["powerbi", "dashboard", "analytics"],
      downloadUrl: "#",
    },
    {
      id: 5,
      title: "Meeting Minutes Template",
      description:
        "Template for documenting client and internal meetings with action items and decisions",
      category: "Templates",
      type: "document",
      fileSize: "92 KB",
      uploadedDate: "Dec 20, 2025",
      tags: ["meeting", "template", "documentation"],
      downloadUrl: "#",
    },
    {
      id: 6,
      title: "Icon Library - UI Components",
      description:
        "Collection of 500+ SVG icons for use in client projects and internal tools",
      category: "Brand Assets",
      type: "image",
      fileSize: "12.5 MB",
      uploadedDate: "Dec 15, 2025",
      tags: ["icons", "design", "ui"],
      downloadUrl: "#",
    },
    {
      id: 7,
      title: "Data Security Policy",
      description:
        "Internal policy document covering data handling, security protocols, and compliance requirements",
      category: "Policies",
      type: "document",
      fileSize: "415 KB",
      uploadedDate: "Dec 10, 2025",
      tags: ["security", "policy", "compliance"],
      downloadUrl: "#",
    },
    {
      id: 8,
      title: "Project Status Report Template",
      description:
        "Template for weekly/monthly project status reports with KPIs and milestone tracking",
      category: "Templates",
      type: "spreadsheet",
      fileSize: "256 KB",
      uploadedDate: "Dec 5, 2025",
      tags: ["reporting", "template", "status"],
      downloadUrl: "#",
    },
    {
      id: 9,
      title: "API Integration Tutorial",
      description:
        "Video walkthrough of integrating third-party APIs with examples and code snippets",
      category: "Training",
      type: "video",
      fileSize: "85 MB",
      uploadedDate: "Nov 28, 2025",
      tags: ["api", "tutorial", "development"],
      downloadUrl: "#",
    },
    {
      id: 10,
      title: "Timesheet Submission Guidelines",
      description:
        "Instructions for properly logging hours, categorizing work, and submitting timesheets",
      category: "Guides",
      type: "document",
      fileSize: "178 KB",
      uploadedDate: "Nov 20, 2025",
      tags: ["timesheet", "process", "guidelines"],
      downloadUrl: "#",
    },
    {
      id: 11,
      title: "Client Communication Best Practices",
      description:
        "Guide for professional client communication including email templates and meeting protocols",
      category: "Guides",
      type: "document",
      fileSize: "305 KB",
      uploadedDate: "Nov 15, 2025",
      tags: ["communication", "client", "best-practices"],
      downloadUrl: "#",
    },
    {
      id: 12,
      title: "Presentation Deck Template",
      description:
        "Branded PowerPoint template for client presentations and project updates",
      category: "Templates",
      type: "presentation",
      fileSize: "1.8 MB",
      uploadedDate: "Nov 10, 2025",
      tags: ["presentation", "template", "client"],
      downloadUrl: "#",
    },
  ];

  // Get unique categories
  const categories = [
    "All",
    ...Array.from(new Set(resources.map((r) => r.category))),
  ];

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (type: Resource["type"]) => {
    switch (type) {
      case "document":
        return FileText;
      case "spreadsheet":
        return FileSpreadsheet;
      case "presentation":
        return Presentation;
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      default:
        return File;
    }
  };

  const getFileTypeColor = (type: Resource["type"]) => {
    switch (type) {
      case "document":
        return "#4169e1";
      case "spreadsheet":
        return "#52c41a";
      case "presentation":
        return "#fa8c16";
      case "image":
        return "#eb2f96";
      case "video":
        return "#722ed1";
      default:
        return "#8c8c8c";
    }
  };

  const handleDownload = (resource: Resource) => {
    // In a real application, this would trigger an actual download
    setToastMessage(`Downloading: ${resource.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toastMessage && (
        <Toast
          message={toastMessage}
          tone="info"
          onClose={() => setToastMessage(null)}
        />
      )}
      <AuthNavbar />
      <StaffSidebar activeItem="resources" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: "#e6f0ff" }}
              >
                <BookOpen className="w-6 h-6" style={{ color: "#4169e1" }} />
              </div>
              <h1 className="text-3xl" style={{ color: "#001f54" }}>
                Resources
              </h1>
            </div>
            <p className="text-gray-600">
              Access templates, guides, and internal documents
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-all"
                style={{ color: "#001f54" }}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-600" />
              <h3 className="text-sm text-gray-600">Filter by Category</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category
                      ? "text-white shadow-sm"
                      : "text-gray-600 bg-white border border-gray-200 hover:border-gray-300"
                  }`}
                  style={
                    selectedCategory === category
                      ? { backgroundColor: "#4169e1" }
                      : {}
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium" style={{ color: "#001f54" }}>
                {filteredResources.length}
              </span>{" "}
              resource{filteredResources.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Resource Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No resources found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            ) : (
              filteredResources.map((resource) => {
                const FileIcon = getFileIcon(resource.type);
                const fileColor = getFileTypeColor(resource.type);

                return (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden group"
                  >
                    {/* Card Header */}
                    <div className="p-4 border-b border-gray-100 flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${fileColor}15` }}
                        >
                          <FileIcon
                            className="w-5 h-5"
                            style={{ color: fileColor }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-medium mb-1 line-clamp-1"
                            style={{ color: "#001f54" }}
                          >
                            {resource.title}
                          </h3>
                          <span
                            className="inline-block px-2 py-1 rounded text-xs"
                            style={{
                              backgroundColor: "#e6f0ff",
                              color: "#4169e1",
                            }}
                          >
                            {resource.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {resource.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {resource.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {resource.uploadedDate}
                        </div>
                        <span>{resource.fileSize}</span>
                      </div>

                      {/* Download Button */}
                      <button
                        onClick={() => handleDownload(resource)}
                        className="w-full py-2.5 rounded-lg text-white transition-all hover:shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                        style={{ backgroundColor: "#4169e1" }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Spacing */}
          <div className="h-8"></div>
        </div>
      </main>
    </div>
  );
}
