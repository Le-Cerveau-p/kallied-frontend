import { useCallback, useEffect, useRef, useState } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import StaffSidebar from "../../components/StaffSidebar";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  Users,
  Building,
  Mail,
  Phone,
  Plus,
  Upload,
  Download,
  FileText,
  MessageCircle,
  DollarSign,
  Send,
  Image,
  Paperclip,
  X,
  ChevronRight,
  Edit,
  Trash2,
  ExternalLink,
  HelpCircle,
  Bug,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getStaffProjectById, uploadProjectDocument } from "../../api/staff";
import {
  addProcurementItem,
  createProcurement,
  deleteProcurementItem,
  submitProcurement,
  updateProcurement,
  updateProcurementItem,
} from "../../api/procurement";
import {
  getProjectThreads,
  getThreadMessages,
  markChatThreadRead,
  sendThreadMessage,
} from "../../api/chat";
import { getChatSocket } from "../../utils/chatSocket";
import { getCurrentUser } from "../../api/users";
import { MessageDisplay } from "../../components/MessageDisplay";

interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  clientInfo: UserSummary;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "AWAITING_APPROVAL";
  progress: number;
  assignedStaff: StaffMember[];
  createdDate: string;
  deadline: string;
  updates: Update[];
  latestUpdate: string;
  documents: Document[];
  procurementRequests: ProcurementRequest[];
}

interface StaffMember {
  staff: UserSummary;
}

interface Update {
  id: number;
  createdAt: string;
  staff: UserSummary;
  progress: number;
  notes: string;
  eventType: string;
}

interface Document {
  id: string;
  name: string;
  category: string;
  version: number;
  uploadedBy: string;
  uploadedDate: string;
  fileUrl: string;
}

type ProcurementStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";
type ProcurementItemType = "MATERIAL" | "SERVICE";

interface ProcurementItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  type: ProcurementItemType;
}

interface ProcurementRequest {
  id: string;
  title: string;
  description: string | null;
  status: ProcurementStatus;
  cost?: number | null;
  createdAt: string;
  items: ProcurementItem[];
  rejectionReason?: string | null;
}

interface ProcurementItemForm {
  id?: string;
  tempId: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  type: ProcurementItemType;
}

interface Message {
  id: string;
  senderId: string;
  sender: string;
  role: "client" | "staff" | "admin";
  content: string;
  timestamp: string;
  attachments?: { name: string; type: string; url: string; size?: string }[];
}

interface Thread {
  id: string;
  name: string;
  type: "main" | "staff";
  lastMessage: string;
  unreadCount: number;
}

interface CustomerRequest {
  id: number;
  title: string;
  description: string;
  category: "question" | "bug" | "feature-request" | "change-request";
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  submittedDate: string;
  submittedBy: string;
  assignedTo?: string;
  resolvedDate?: string;
}

export default function StaffProjectDetailPage() {
  const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [userData, setUserData] = useState<UserSummary | null>(null);
  useEffect(() => {
    setLoading(true);
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();

    setLoading(false);
  }, []);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "overview" | "milestones" | "documents" | "procurement" | "messages"
    // | "requests"
  >("overview");
  const [showAddUpdateModal, setShowAddUpdateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateProcurementModal, setShowCreateProcurementModal] =
    useState(false);
  const [editingProcurement, setEditingProcurement] =
    useState<ProcurementRequest | null>(null);
  const [selectedProcurement, setSelectedProcurement] =
    useState<ProcurementRequest | null>(null);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadMessages, setThreadMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageAttachment, setMessageAttachment] = useState<File | null>(null);
  const messageFileRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<ReturnType<typeof getChatSocket> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // New update form state
  const [newUpdateProgress, setNewUpdateProgress] = useState(75);
  const [newUpdateNotes, setNewUpdateNotes] = useState("");

  // Upload form state
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("REPORT");
  const [uploadGroup, setUploadGroup] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const uploadFileRef = useRef<HTMLInputElement>(null);

  // Procurement form state
  const [procurementTitle, setProcurementTitle] = useState("");
  const [procurementDescription, setProcurementDescription] = useState("");
  const [procurementItems, setProcurementItems] = useState<
    ProcurementItemForm[]
  >([]);
  const [isSavingProcurement, setIsSavingProcurement] = useState(false);
  const [procurementError, setProcurementError] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProject = useCallback(async () => {
    if (!id) return;
    const data = await getStaffProjectById(id);
    setProject(data);
    setUpdates(data.updates);
  }, [id]);

  useEffect(() => {
    void loadProject();
  }, [loadProject]);

  useEffect(() => {
    if (!project || !selectedProcurement) return;
    const match = project.procurementRequests.find(
      (request) => request.id === selectedProcurement.id,
    );
    if (!match) {
      setSelectedProcurement(null);
      return;
    }
    if (match !== selectedProcurement) {
      setSelectedProcurement(match);
    }
  }, [project, selectedProcurement]);

  useEffect(() => {
    if (!id) return;
    const loadThreads = async () => {
      try {
        const data = await getProjectThreads(id);
        const mapped: Thread[] = data.map((thread: any) => ({
          id: thread.id,
          name:
            thread.type === "STAFF_ONLY" ? "Staff-Only Thread" : "Main Thread",
          type: thread.type === "STAFF_ONLY" ? "staff" : "main",
          lastMessage: thread.lastMessage ?? "No messages yet",
          unreadCount: thread.unreadCount ?? 0,
        }));
        setThreads(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    loadThreads();
  }, [id]);

  const refreshThreads = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getProjectThreads(id);
      const mapped: Thread[] = data.map((thread: any) => ({
        id: thread.id,
        name:
          thread.type === "STAFF_ONLY" ? "Staff-Only Thread" : "Main Thread",
        type: thread.type === "STAFF_ONLY" ? "staff" : "main",
        lastMessage: thread.lastMessage ?? "No messages yet",
        unreadCount: thread.unreadCount ?? 0,
      }));
      setThreads(mapped);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    const socket = getChatSocket();
    socketRef.current = socket;

    const handleNewMessage = (message: any) => {
      const messageThreadId = message.threadId;
      const senderId = message.sender?.id ?? "";
      const isActiveThread = selectedThread?.id === messageThreadId;
      const mappedMessage: Message = {
        id: message.id,
        senderId,
        sender: message.sender?.name ?? "Unknown",
        role: (
          message.sender?.role ?? "STAFF"
        ).toLowerCase() as Message["role"],
        content: message.content ?? "",
        timestamp: new Date(message.createdAt).toLocaleString(),
        attachments: mapAttachment(message.attachments)
          ? [mapAttachment(message.attachments)!]
          : undefined,
      };

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== messageThreadId) return thread;
          const shouldIncrement =
            senderId && senderId !== userData?.id && !isActiveThread;
          return {
            ...thread,
            lastMessage: mappedMessage.content || "Sent an attachment",
            unreadCount: shouldIncrement
              ? (thread.unreadCount ?? 0) + 1
              : (thread.unreadCount ?? 0),
          };
        }),
      );

      setThreadMessages((prev) => {
        if (!isActiveThread) {
          return prev;
        }
        return [...prev, mappedMessage];
      });

      if (isActiveThread && senderId && senderId !== userData?.id) {
        markChatThreadRead(messageThreadId).catch(console.error);
      }
    };

    const handleThreadUpdated = () => {
      void refreshThreads();
    };

    const handleThreadRead = (payload: any) => {
      if (payload?.userId && payload.userId === userData?.id) {
        void refreshThreads();
      }
    };

    socket.on("new-message", handleNewMessage);
    socket.on("thread-updated", handleThreadUpdated);
    socket.on("thread-read", handleThreadRead);
    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("thread-updated", handleThreadUpdated);
      socket.off("thread-read", handleThreadRead);
    };
  }, [selectedThread, userData, refreshThreads]);

  useEffect(() => {
    const threadType = searchParams.get("thread");
    if (threadType !== "main" && threadType !== "staff") return;

    const match = threads.find((t) => t.type === threadType) ?? null;
    setActiveTab("messages");
    if (match) {
      setSelectedThread(match);
      socketRef.current?.emit("join-thread", match.id);
      loadMessages(match.id);
    }
  }, [searchParams, threads]);

  useEffect(() => {
    const threadType = searchParams.get("thread");
    if (threadType === "main" || threadType === "staff") return;

    const tabParam = searchParams.get("tab");
    const normalized = tabParam?.toLowerCase();
    if (!normalized) return;

    const validTabs = new Set([
      "overview",
      "milestones",
      "documents",
      "procurement",
      "messages",
    ]);
    if (!validTabs.has(normalized)) return;

    setActiveTab(normalized as typeof activeTab);
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages, selectedThread?.id, activeTab]);

  // Mock customer requests data
  const customerRequests: CustomerRequest[] = [
    {
      id: 1,
      title: "Add dark mode toggle to navigation",
      description:
        "Would like to see a dark mode option in the main navigation bar so users can switch between light and dark themes easily.",
      category: "feature-request",
      priority: "Medium",
      status: "Open",
      submittedDate: "Jan 22, 2026",
      submittedBy: "John Smith",
      assignedTo: "Sarah Chen",
    },
    {
      id: 2,
      title: "Login button not working on mobile",
      description:
        "The login button on the homepage doesn't respond when clicked on iOS Safari. Tested on iPhone 14 Pro. Desktop version works fine.",
      category: "bug",
      priority: "High",
      status: "In Progress",
      submittedDate: "Jan 21, 2026",
      submittedBy: "John Smith",
      assignedTo: "Mike Johnson",
    },
    {
      id: 3,
      title: "Question about product filtering functionality",
      description:
        "Can the product page include filters for price range, category, and availability? Want to understand if this is included in the current scope.",
      category: "question",
      priority: "Low",
      status: "Resolved",
      submittedDate: "Jan 18, 2026",
      submittedBy: "John Smith",
      assignedTo: "Emily Davis",
      resolvedDate: "Jan 19, 2026",
    },
    {
      id: 4,
      title: "Change hero section background color",
      description:
        "After reviewing the latest mockups, we'd like to change the hero section background from blue to a gradient. Can provide specific color codes.",
      category: "change-request",
      priority: "Medium",
      status: "Resolved",
      submittedDate: "Jan 15, 2026",
      submittedBy: "John Smith",
      assignedTo: "Sarah Chen",
      resolvedDate: "Jan 17, 2026",
    },
    {
      id: 5,
      title: "Footer links not aligned properly",
      description:
        "The footer links appear misaligned on tablet devices (iPad). They overlap with the social media icons.",
      category: "bug",
      priority: "Medium",
      status: "Open",
      submittedDate: "Jan 20, 2026",
      submittedBy: "John Smith",
    },
    {
      id: 6,
      title: "Add newsletter subscription form",
      description:
        "Would like to add a newsletter signup form in the footer with email validation and integration with our MailChimp account.",
      category: "feature-request",
      priority: "High",
      status: "Open",
      submittedDate: "Jan 23, 2026",
      submittedBy: "John Smith",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "In Progress":
        return { backgroundColor: "#4169e120", color: "#4169e1", icon: Clock };
      case "On Track":
        return {
          backgroundColor: "#32cd3220",
          color: "#32cd32",
          icon: CheckCircle,
        };
      case "At Risk":
        return {
          backgroundColor: "#ff980020",
          color: "#ff9800",
          icon: AlertCircle,
        };
      case "Completed":
        return {
          backgroundColor: "#32cd3220",
          color: "#32cd32",
          icon: CheckCircle,
        };
      default:
        return { backgroundColor: "#71718220", color: "#717182", icon: Clock };
    }
  };

  const getProcurementStatusStyle = (status: ProcurementStatus) => {
    switch (status) {
      case "DRAFT":
        return { backgroundColor: "#71718220", color: "#717182" };
      case "SUBMITTED":
        return { backgroundColor: "#4169e120", color: "#4169e1" };
      case "APPROVED":
        return { backgroundColor: "#32cd3220", color: "#32cd32" };
      case "REJECTED":
        return { backgroundColor: "#dc262620", color: "#dc2626" };
      default:
        return { backgroundColor: "#71718220", color: "#717182" };
    }
  };

  const getProcurementStatusLabel = (status: ProcurementStatus) => {
    switch (status) {
      case "DRAFT":
        return "Draft";
      case "SUBMITTED":
        return "Submitted";
      case "APPROVED":
        return "Approved";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const getProcurementTotal = (request: ProcurementRequest) =>
    request.items.reduce(
      (sum, item) => sum + (item.estimatedCost ?? 0) * item.quantity,
      0,
    );

  const formatProcurementDate = (value: string) =>
    new Date(value).toLocaleDateString();

  const handleAddUpdate = () => {
    console.log("Adding update:", {
      progress: newUpdateProgress,
      notes: newUpdateNotes,
    });
    setNewUpdateProgress(75);
    setNewUpdateNotes("");
    setShowAddUpdateModal(false);
  };

  const handleUploadDocument = async () => {
    if (!id || !uploadFile || !uploadFileName.trim()) return;
    try {
      await uploadProjectDocument(id, {
        file: uploadFile,
        name: uploadFileName.trim(),
        category: uploadCategory,
        groupName: uploadGroup.trim() || "General",
      });
      await loadProject();
      setUploadFileName("");
      setUploadCategory("REPORT");
      setUploadGroup("");
      setUploadFile(null);
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadFilePick = () => {
    uploadFileRef.current?.click();
  };

  const handleUploadFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    setUploadFile(file);
    if (file && !uploadFileName.trim()) {
      setUploadFileName(file.name);
    }
  };

  const buildTempId = () =>
    `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const resetProcurementForm = () => {
    setProcurementTitle("");
    setProcurementDescription("");
    setProcurementItems([]);
    setEditingProcurement(null);
    setProcurementError(null);
  };

  const isProcurementFormValid = () => {
    if (!procurementTitle.trim()) return false;
    if (!procurementDescription.trim()) return false;
    if (!procurementItems.length) return false;
    return procurementItems.every(
      (item) =>
        item.name.trim() &&
        item.unit.trim() &&
        item.quantity > 0 &&
        (item.estimatedCost ?? 0) > 0 &&
        item.type,
    );
  };

  const handleOpenCreateProcurement = () => {
    resetProcurementForm();
    setShowCreateProcurementModal(true);
  };

  const handleEditProcurement = () => {
    if (!selectedProcurement) return;
    setEditingProcurement(selectedProcurement);
    setProcurementTitle(selectedProcurement.title);
    setProcurementDescription(selectedProcurement.description ?? "");
    setProcurementItems(
      selectedProcurement.items.map((item) => ({
        id: item.id,
        tempId: item.id,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        estimatedCost: item.estimatedCost ?? 0,
        type: item.type,
      })),
    );
    setShowCreateProcurementModal(true);
  };

  const handleCreateProcurement = async () => {
    if (!id || !isProcurementFormValid()) return;
    setIsSavingProcurement(true);
    setProcurementError(null);
    try {
      let requestId = editingProcurement?.id;
      const isEditing = Boolean(editingProcurement?.id);

      if (isEditing && requestId) {
        await updateProcurement(requestId, {
          title: procurementTitle.trim(),
          description: procurementDescription.trim(),
        });
      } else {
        const created = await createProcurement({
          projectId: id,
          title: procurementTitle.trim(),
          description: procurementDescription.trim(),
        });
        requestId = created.id;
      }

      if (!requestId) {
        throw new Error("Unable to resolve procurement request id");
      }

      const existingIds = new Set(
        (editingProcurement?.items ?? []).map((item) => item.id),
      );
      const currentIds = new Set(
        procurementItems
          .map((item) => item.id)
          .filter((itemId): itemId is string => Boolean(itemId)),
      );

      const itemsToDelete = Array.from(existingIds).filter(
        (itemId) => !currentIds.has(itemId),
      );

      const itemsToUpdate = procurementItems.filter((item) => item.id);
      const itemsToAdd = procurementItems.filter((item) => !item.id);

      await Promise.all([
        ...itemsToDelete.map((itemId) => deleteProcurementItem(itemId)),
        ...itemsToUpdate.map((item) =>
          updateProcurementItem(item.id as string, {
            name: item.name.trim(),
            quantity: item.quantity,
            unit: item.unit.trim(),
            estimatedCost: item.estimatedCost ?? 0,
            type: item.type,
          }),
        ),
        ...itemsToAdd.map((item) =>
          addProcurementItem(requestId as string, {
            name: item.name.trim(),
            quantity: item.quantity,
            unit: item.unit.trim(),
            estimatedCost: item.estimatedCost ?? 0,
            type: item.type,
          }),
        ),
      ]);

      await loadProject();
      setShowCreateProcurementModal(false);
      resetProcurementForm();
    } catch (err) {
      console.error(err);

      console.log(err?.response?.data?.message);
      setProcurementError("Failed to save procurement request. Try again.");
    } finally {
      setIsSavingProcurement(false);
    }
  };

  const handleSubmitProcurement = async () => {
    if (!selectedProcurement) return;
    try {
      await submitProcurement(selectedProcurement.id);
      await loadProject();
    } catch (err) {
      console.error(err);
    }
  };

  const mapAttachment = (attachments: any[] | undefined) => {
    const attachmentItem = attachments?.[0];
    if (!attachmentItem) return undefined;
    const name = attachmentItem.fileUrl?.split("/").pop() ?? "attachment";
    const rawUrl = attachmentItem.fileUrl ?? "";
    const url = rawUrl.startsWith("http") ? rawUrl : `${apiBaseUrl}${rawUrl}`;
    return {
      name,
      type: attachmentItem.mimeType,
      url,
    };
  };

  const loadMessages = async (threadId: string) => {
    const data = await getThreadMessages(threadId);
    const mappedMessages: Message[] = data.map((message: any) => ({
      id: message.id,
      senderId: message.sender?.id ?? "",
      sender: message.sender?.name ?? "Unknown",
      role: (message.sender?.role ?? "STAFF").toLowerCase() as Message["role"],
      content: message.content ?? "",
      timestamp: new Date(message.createdAt).toLocaleString(),
      attachments: mapAttachment(message.attachments)
        ? [mapAttachment(message.attachments)!]
        : undefined,
    }));
    setThreadMessages(mappedMessages);
  };

  const handleSelectThread = async (thread: Thread) => {
    setSelectedThread(thread);
    setThreads((prev) =>
      prev.map((item) =>
        item.id === thread.id ? { ...item, unreadCount: 0 } : item,
      ),
    );
    socketRef.current?.emit("join-thread", thread.id);
    await loadMessages(thread.id);
    await markChatThreadRead(thread.id);
  };

  const handleSendMessage = async () => {
    if (!selectedThread) return;
    if (!newMessage.trim() && !messageAttachment) return;

    try {
      await sendThreadMessage(selectedThread.id, {
        content: newMessage.trim() || undefined,
        file: messageAttachment,
      });
      setNewMessage("");
      setMessageAttachment(null);
      await loadMessages(selectedThread.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMessageAttachClick = () => {
    messageFileRef.current?.click();
  };

  const handleMessageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    setMessageAttachment(file);
  };

  const statusStyle = getStatusStyle(project?.status);
  const StatusIcon = statusStyle.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <AuthNavbar
        currentPage="dashboard"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <StaffSidebar activeItem="projects" />

      <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 text-sm font-medium transition-all hover:underline"
            style={{ color: "#4169e1" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Projects
          </button>

          {/* Project Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1
                  className="text-3xl font-semibold mb-2"
                  style={{ color: "#001f54" }}
                >
                  {project?.name}
                </h1>
                <p className="text-lg text-gray-600">{project?.clientName}</p>
              </div>
              <span
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full font-medium"
                style={statusStyle}
              >
                <StatusIcon className="w-4 h-4" />
                {project?.status}
              </span>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Started: {project?.createdDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Due: {project?.deadline}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="font-semibold" style={{ color: "#4169e1" }}>
                  {project?.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${project?.progress}%`,
                    backgroundColor: "#4169e1",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
            <div className="flex border-b" style={{ borderColor: "#e5e7eb" }}>
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-b-2 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "overview" ? { borderColor: "#4169e1" } : {}
                }
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("milestones")}
                className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "milestones"
                    ? "border-b-2 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "milestones" ? { borderColor: "#4169e1" } : {}
                }
              >
                Milestones & Updates
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "documents"
                    ? "border-b-2 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "documents" ? { borderColor: "#4169e1" } : {}
                }
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab("procurement")}
                className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "procurement"
                    ? "border-b-2 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "procurement" ? { borderColor: "#4169e1" } : {}
                }
              >
                Procurement
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "messages"
                    ? "border-b-2 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "messages" ? { borderColor: "#4169e1" } : {}
                }
              >
                Messages
                {threads.reduce((sum, t) => sum + t.unreadCount, 0) > 0 && (
                  <span
                    className="ml-2 inline-block w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    {threads.reduce((sum, t) => sum + t.unreadCount, 0)}
                  </span>
                )}
              </button>
              {/* <button
                onClick={() => setActiveTab("requests")}
                className={`px-6 py-4 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === "requests"
                    ? "border-b-2 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                style={
                  activeTab === "requests" ? { borderColor: "#4169e1" } : {}
                }
              >
                Requests
                {customerRequests.filter((r) => r.status === "Open").length >
                  0 && (
                  <span
                    className="ml-2 inline-block w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                    style={{ backgroundColor: "#dc2626" }}
                  >
                    {customerRequests.filter((r) => r.status === "Open").length}
                  </span>
                )}
              </button> */}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "#001f54" }}
                  >
                    Project Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {project?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Assigned Staff */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#001f54" }}
                    >
                      Assigned Team
                    </h3>
                    <div className="space-y-3">
                      {project?.assignedStaff.slice(0, 2).map((s) => (
                        <div
                          key={s.staff.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
                            style={{ backgroundColor: "#4169e1" }}
                          >
                            {s.staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {s.staff.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {s.staff.role}
                            </p>
                          </div>
                          <a
                            href={`mailto:${s.staff.email}`}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                            title={s.staff.email}
                          >
                            <Mail className="w-4 h-4 text-gray-400" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Client Information */}
                  <div>
                    <h3
                      className="text-lg font-semibold mb-3"
                      style={{ color: "#001f54" }}
                    >
                      Client Information
                    </h3>
                    <div
                      className="p-4 border rounded-lg space-y-3"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      {/* <div className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {project?.clientInfo.name}
                        </span>
                      </div> */}
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {project?.clientInfo.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <a
                          href={`mailto:${project?.clientInfo.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {project?.clientInfo.email}
                        </a>
                      </div>
                      {/* <div className="flex items-center gap-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {project?.clientInfo.phone}
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* Latest Update */}
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "#001f54" }}
                  >
                    Latest Update
                  </h3>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-gray-700 leading-relaxed">
                      {project?.latestUpdate}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones & Updates Tab */}
            {activeTab === "milestones" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Project Timeline
                  </h3>
                  <button
                    onClick={() => setShowAddUpdateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{ backgroundColor: "#4169e1", color: "white" }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Update
                  </button>
                </div>

                <div className="space-y-4">
                  {!project.updates ? (
                    <div>Loading Updates</div>
                  ) : (
                    <>
                      {updates?.map((update, index) => (
                        <div
                          key={update.id}
                          className="relative pl-8 pb-8 border-l-2"
                          style={{
                            borderColor:
                              index === project.updates.length - 1
                                ? "transparent"
                                : "#e5e7eb",
                          }}
                        >
                          {/* Timeline dot */}
                          <div
                            className="absolute left-0 top-0 w-4 h-4 rounded-full -ml-[9px]"
                            style={{ backgroundColor: "#4169e1" }}
                          />

                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {update.staff.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {update.createdAt}
                                </p>
                              </div>
                              <span
                                className="text-sm font-semibold px-3 py-1 rounded-full"
                                style={{
                                  backgroundColor: "#4169e120",
                                  color: "#4169e1",
                                }}
                              >
                                {update.progress}% Complete
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                              {update.eventType}
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                              {update.notes}
                            </p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Project Documents
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{ backgroundColor: "#4169e1", color: "white" }}
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>
                </div>

                {/* Group documents by category */}
                {[
                  "REPORT",
                  "CONTRACT",
                  "DRAWING",
                  "INVOICE",
                  "ANALYTICS",
                  "OTHER",
                ].map((category) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {project?.documents
                        .filter((doc) => doc.category === category)
                        .map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-all"
                            style={{ borderColor: "#e5e7eb" }}
                          >
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
                              <p className="font-medium text-gray-900">
                                {doc.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {doc.version} • Uploaded by {doc.uploadedBy} on{" "}
                                {doc.uploadedDate} • {/*doc.size*/}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                title="Upload new version"
                              >
                                <Upload className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                title="Download"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Procurement Tab */}
            {activeTab === "procurement" && !selectedProcurement && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Procurement Requests
                  </h3>
                  <button
                    onClick={handleOpenCreateProcurement}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                    style={{ backgroundColor: "#4169e1", color: "white" }}
                  >
                    <Plus className="w-4 h-4" />
                    Create Request
                  </button>
                </div>

                <div className="space-y-3">
                  {project?.procurementRequests?.map((request) => {
                    const statusStyle = getProcurementStatusStyle(
                      request.status,
                    );
                    return (
                      <div
                        key={request.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
                        style={{ borderColor: "#e5e7eb" }}
                        onClick={() => setSelectedProcurement(request)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {request.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {request.description}
                            </p>
                          </div>
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-medium ml-4"
                            style={statusStyle}
                          >
                            {getProcurementStatusLabel(request.status)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            ₦ {getProcurementTotal(request).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatProcurementDate(request.createdAt)}
                          </span>
                          <span className="ml-auto flex items-center gap-1 text-blue-600 font-medium">
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Procurement Detail View */}
            {activeTab === "procurement" && selectedProcurement && (
              <div>
                <button
                  onClick={() => setSelectedProcurement(null)}
                  className="flex items-center gap-2 mb-4 text-sm font-medium transition-all hover:underline"
                  style={{ color: "#4169e1" }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Procurement List
                </button>

                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3
                        className="text-xl font-semibold mb-2"
                        style={{ color: "#001f54" }}
                      >
                        {selectedProcurement.title}
                      </h3>
                      <p className="text-gray-600">
                        {selectedProcurement.description}
                      </p>
                    </div>
                    <span
                      className="text-sm px-3 py-1.5 rounded-full font-medium"
                      style={getProcurementStatusStyle(
                        selectedProcurement.status,
                      )}
                    >
                      {getProcurementStatusLabel(selectedProcurement.status)}
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Items
                </h4>
                <div
                  className="border rounded-lg overflow-hidden mb-6"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <table className="w-full">
                    <thead
                      className="bg-gray-50 border-b"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Item Name
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                          Unit Cost
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className="divide-y"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      {selectedProcurement.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-center">
                            {item.quantity} {item.unit}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            ₦{(item.estimatedCost ?? 0).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                            ₦
                            {(
                              item.quantity * (item.estimatedCost ?? 0)
                            ).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot
                      className="bg-gray-50 border-t"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-3 text-sm font-semibold text-gray-900 text-right"
                        >
                          Total Estimated Cost:
                        </td>
                        <td
                          className="px-4 py-3 text-lg font-bold text-right"
                          style={{ color: "#001f54" }}
                        >
                          ₦
                          {getProcurementTotal(
                            selectedProcurement,
                          ).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {selectedProcurement.status === "REJECTED" &&
                  selectedProcurement.rejectionReason && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                        Rejection Reason
                      </h4>
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                        {selectedProcurement.rejectionReason}
                      </div>
                    </div>
                  )}

                {selectedProcurement.status === "DRAFT" && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSubmitProcurement}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{ backgroundColor: "#4169e1", color: "white" }}
                    >
                      Submit for Approval
                    </button>
                    <button
                      onClick={handleEditProcurement}
                      className="flex items-center gap-2 px-6 py-3 border rounded-lg font-medium transition-all hover:bg-gray-50"
                      style={{ borderColor: "#e5e7eb" }}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Request
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && !selectedThread && (
              <div>
                <h3
                  className="text-lg font-semibold mb-6"
                  style={{ color: "#001f54" }}
                >
                  Project Conversations
                </h3>

                <div className="space-y-3">
                  {threads.map((thread) => (
                    <button
                      key={thread.id}
                      onClick={() => handleSelectThread(thread)}
                      className="w-full text-left p-4 border-2 rounded-xl hover:bg-gray-50 transition-all"
                      style={{
                        borderColor:
                          thread.type === "main" ? "#4169e1" : "#32cd32",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor:
                              thread.type === "main"
                                ? "#4169e120"
                                : "#32cd3220",
                          }}
                        >
                          {thread.type === "main" ? (
                            <Users
                              className="w-5 h-5"
                              style={{ color: "#4169e1" }}
                            />
                          ) : (
                            <Users
                              className="w-5 h-5"
                              style={{ color: "#32cd32" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {thread.name}
                            </h4>
                            {thread.unreadCount > 0 && (
                              <span
                                className="inline-block w-5 h-5 rounded-full text-white text-xs flex items-center justify-center"
                                style={{ backgroundColor: "#dc2626" }}
                              >
                                {thread.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {thread.lastMessage}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Thread View */}
            {activeTab === "messages" && selectedThread && (
              <div className="flex flex-col h-[600px]">
                {/* Thread Header */}
                <div
                  className="flex items-center gap-3 pb-4 border-b"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <button
                    onClick={() => {
                      setSelectedThread(null);
                      setThreadMessages([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {selectedThread.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedThread.type === "main"
                        ? "Client-facing communication"
                        : "Internal staff communication"}
                    </p>
                  </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                  {threadMessages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                        style={{
                          backgroundColor:
                            message.role === "client"
                              ? "#4169e1"
                              : message.role === "admin"
                                ? "#ff9800"
                                : "#32cd32",
                        }}
                      >
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {message.sender}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp}
                          </span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <MessageDisplay
                            content={message.content}
                            attachment={message.attachments?.[0]}
                            isOwnMessage={message.senderId === userData?.id}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Composer */}
                <div
                  className="pt-4 border-t"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={handleMessageAttachClick}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      title="Upload image"
                    >
                      <Image className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={handleMessageAttachClick}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      title="Attach file"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>
                    <input
                      ref={messageFileRef}
                      type="file"
                      className="hidden"
                      onChange={handleMessageFileChange}
                    />
                    {messageAttachment && (
                      <div className="text-xs text-gray-600 self-center">
                        Attached: {messageAttachment.name}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      className="flex-1 px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                      style={
                        {
                          borderColor: "#e5e7eb",
                          "--tw-ring-color": "#4169e1",
                        } as React.CSSProperties
                      }
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && !messageAttachment}
                      className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md"
                      style={{ backgroundColor: "#4169e1", color: "white" }}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {/* {activeTab === "requests" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-lg font-semibold"
                    style={{ color: "#001f54" }}
                  >
                    Customer Requests
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-600">
                      {
                        customerRequests.filter((r) => r.status === "Open")
                          .length
                      }{" "}
                      Open
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
                      {
                        customerRequests.filter(
                          (r) => r.status === "In Progress",
                        ).length
                      }{" "}
                      In Progress
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
                      {
                        customerRequests.filter((r) => r.status === "Resolved")
                          .length
                      }{" "}
                      Resolved
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {customerRequests.map((request) => {
                    const getCategoryIcon = (category: string) => {
                      switch (category) {
                        case "question":
                          return HelpCircle;
                        case "bug":
                          return Bug;
                        case "feature-request":
                          return Lightbulb;
                        case "change-request":
                          return RefreshCw;
                        default:
                          return FileText;
                      }
                    };

                    const getCategoryColor = (category: string) => {
                      switch (category) {
                        case "question":
                          return { bg: "#e6f0ff", text: "#4169e1" };
                        case "bug":
                          return { bg: "#fff2f0", text: "#dc2626" };
                        case "feature-request":
                          return { bg: "#f6ffed", text: "#52c41a" };
                        case "change-request":
                          return { bg: "#fffbe6", text: "#faad14" };
                        default:
                          return { bg: "#f5f5f5", text: "#8c8c8c" };
                      }
                    };

                    const getPriorityColor = (priority: string) => {
                      switch (priority) {
                        case "High":
                          return { bg: "#fff2f0", text: "#dc2626" };
                        case "Medium":
                          return { bg: "#fffbe6", text: "#faad14" };
                        case "Low":
                          return { bg: "#f6ffed", text: "#52c41a" };
                        default:
                          return { bg: "#f5f5f5", text: "#8c8c8c" };
                      }
                    };

                    const getStatusColor = (status: string) => {
                      switch (status) {
                        case "Open":
                          return { bg: "#fff2f0", text: "#dc2626" };
                        case "In Progress":
                          return { bg: "#e6f0ff", text: "#4169e1" };
                        case "Resolved":
                          return { bg: "#f6ffed", text: "#52c41a" };
                        case "Closed":
                          return { bg: "#f5f5f5", text: "#8c8c8c" };
                        default:
                          return { bg: "#f5f5f5", text: "#8c8c8c" };
                      }
                    };

                    const CategoryIcon = getCategoryIcon(request.category);
                    const categoryColor = getCategoryColor(request.category);
                    const priorityColor = getPriorityColor(request.priority);
                    const statusColor = getStatusColor(request.status);

                    return (
                      <div
                        key={request.id}
                        className="border rounded-lg p-5 hover:shadow-md transition-all"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        {/* Header 
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className="p-2 rounded-lg flex-shrink-0"
                              style={{ backgroundColor: categoryColor.bg }}
                            >
                              <CategoryIcon
                                className="w-5 h-5"
                                style={{ color: categoryColor.text }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4
                                className="font-semibold mb-1"
                                style={{ color: "#001f54" }}
                              >
                                {request.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">
                                {request.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Metadata 
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium capitalize"
                            style={{
                              backgroundColor: categoryColor.bg,
                              color: categoryColor.text,
                            }}
                          >
                            {request.category.replace("-", " ")}
                          </span>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: priorityColor.bg,
                              color: priorityColor.text,
                            }}
                          >
                            {request.priority} Priority
                          </span>
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: statusColor.bg,
                              color: statusColor.text,
                            }}
                          >
                            {request.status}
                          </span>
                        </div>

                        {/* Footer 
                        <div
                          className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t"
                          style={{ borderColor: "#e5e7eb" }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{request.submittedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{request.submittedDate}</span>
                            </div>
                            {request.assignedTo && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">
                                  Assigned to:
                                </span>
                                <span
                                  className="font-medium"
                                  style={{ color: "#4169e1" }}
                                >
                                  {request.assignedTo}
                                </span>
                              </div>
                            )}
                          </div>
                          {request.resolvedDate && (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Resolved {request.resolvedDate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {customerRequests.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No customer requests</p>
                  </div>
                )}
              </div>
            )} */}
          </div>
        </div>
      </main>

      {/* Add Update Modal */}
      {showAddUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: "#001f54" }}
              >
                Add Project Update
              </h2>
              <button
                onClick={() => setShowAddUpdateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Progress: {newUpdateProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newUpdateProgress}
                  onChange={(e) => setNewUpdateProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Notes *
                </label>
                <textarea
                  placeholder="Describe what has been accomplished..."
                  value={newUpdateNotes}
                  onChange={(e) => setNewUpdateNotes(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all resize-none"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: "#e5e7eb" }}
            >
              <button
                onClick={() => setShowAddUpdateModal(false)}
                className="px-6 py-3 border rounded-lg font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddUpdate}
                disabled={!newUpdateNotes}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                Add Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full">
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: "#001f54" }}
              >
                Upload Document
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File *
                </label>
                <input
                  ref={uploadFileRef}
                  type="file"
                  onChange={handleUploadFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                />
                <button
                  type="button"
                  onClick={handleUploadFilePick}
                  className="w-full border-2 border-dashed rounded-lg p-8 text-center transition-all hover:bg-gray-50"
                  style={{ borderColor: "#e5e7eb" }}
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to browse or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, XLS, XLSX (Max 50MB)
                  </p>
                  {uploadFile && (
                    <p className="text-xs text-gray-700 mt-3">
                      Selected: {uploadFile.name}
                    </p>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter document name..."
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                >
                  <option value="REPORT">Report</option>
                  <option value="ANALYTICS">Analytics / Dataset</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="DRAWING">Drawing</option>
                  <option value="INVOICE">Invoice</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q1 Reports, Phase 1 Documents"
                  value={uploadGroup}
                  onChange={(e) => setUploadGroup(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>
            </div>

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
                onClick={handleUploadDocument}
                disabled={!uploadFile || !uploadFileName.trim()}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Procurement Modal */}
      {showCreateProcurementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#e5e7eb" }}
            >
              <h2
                className="text-xl font-semibold"
                style={{ color: "#001f54" }}
              >
                {editingProcurement
                  ? "Edit Procurement Request"
                  : "Create Procurement Request"}
              </h2>
              <button
                onClick={() => {
                  setShowCreateProcurementModal(false);
                  resetProcurementForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Procurement requests are tied to this
                  project: <strong>{project?.name}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter request title..."
                  value={procurementTitle}
                  onChange={(e) => setProcurementTitle(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all"
                  style={
                    {
                      borderColor: "#e5e7eb",
                      "--tw-ring-color": "#4169e1",
                    } as React.CSSProperties
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe what you need and why..."
                  value={procurementDescription}
                  onChange={(e) => setProcurementDescription(e.target.value)}
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Items
                  </label>
                  <button
                    onClick={() =>
                      setProcurementItems([
                        ...procurementItems,
                        {
                          tempId: buildTempId(),
                          name: "",
                          quantity: 1,
                          unit: "",
                          estimatedCost: 0,
                          type: "MATERIAL",
                        },
                      ])
                    }
                    className="text-sm font-medium hover:underline"
                    style={{ color: "#4169e1" }}
                  >
                    + Add Item
                  </button>
                </div>

                {procurementItems.length === 0 ? (
                  <div
                    className="p-8 border-2 border-dashed rounded-lg text-center"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <p className="text-sm text-gray-600">
                      No items added yet. Click "Add Item" to get started.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-5 gap-3 text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                      <span>Item Name</span>
                      <span>Quantity</span>
                      <span>Unit</span>
                      <span>Type</span>
                      <span>Unit Cost</span>
                    </div>
                    {procurementItems.map((item, index) => (
                      <div
                        key={item.tempId}
                        className="flex gap-3 items-start p-3 border rounded-lg"
                        style={{ borderColor: "#e5e7eb" }}
                      >
                        <div className="flex-1 grid grid-cols-5 gap-3">
                          <input
                            type="text"
                            placeholder="Item name"
                            value={item.name}
                            onChange={(e) => {
                              const updated = [...procurementItems];
                              updated[index].name = e.target.value;
                              setProcurementItems(updated);
                            }}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                            style={
                              {
                                borderColor: "#e5e7eb",
                                "--tw-ring-color": "#4169e1",
                              } as React.CSSProperties
                            }
                          />
                          <input
                            type="number"
                            placeholder="Qty"
                            min={1}
                            value={item.quantity}
                            onChange={(e) => {
                              const updated = [...procurementItems];
                              updated[index].quantity = Number(e.target.value);
                              setProcurementItems(updated);
                            }}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                            style={
                              {
                                borderColor: "#e5e7eb",
                                "--tw-ring-color": "#4169e1",
                              } as React.CSSProperties
                            }
                          />
                          <input
                            type="text"
                            placeholder="Unit (e.g., pcs)"
                            value={item.unit}
                            onChange={(e) => {
                              const updated = [...procurementItems];
                              updated[index].unit = e.target.value;
                              setProcurementItems(updated);
                            }}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                            style={
                              {
                                borderColor: "#e5e7eb",
                                "--tw-ring-color": "#4169e1",
                              } as React.CSSProperties
                            }
                          />
                          <select
                            value={item.type}
                            onChange={(e) => {
                              const updated = [...procurementItems];
                              updated[index].type = e.target
                                .value as ProcurementItemType;
                              setProcurementItems(updated);
                            }}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 cursor-pointer"
                            style={
                              {
                                borderColor: "#e5e7eb",
                                "--tw-ring-color": "#4169e1",
                              } as React.CSSProperties
                            }
                          >
                            <option value="MATERIAL">Material</option>
                            <option value="SERVICE">Service</option>
                          </select>
                          <input
                            type="number"
                            placeholder="Unit cost"
                            min={0}
                            value={item.estimatedCost ?? 0}
                            onChange={(e) => {
                              const updated = [...procurementItems];
                              updated[index].estimatedCost = Number(
                                e.target.value,
                              );
                              setProcurementItems(updated);
                            }}
                            className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2"
                            style={
                              {
                                borderColor: "#e5e7eb",
                                "--tw-ring-color": "#4169e1",
                              } as React.CSSProperties
                            }
                          />
                        </div>
                        <button
                          onClick={() =>
                            setProcurementItems(
                              procurementItems.filter((_, i) => i !== index),
                            )
                          }
                          className="p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {procurementError && (
                <p className="text-sm text-red-600">{procurementError}</p>
              )}
            </div>

            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: "#e5e7eb" }}
            >
              <button
                onClick={() => {
                  setShowCreateProcurementModal(false);
                  resetProcurementForm();
                }}
                className="px-6 py-3 border rounded-lg font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: "#e5e7eb", color: "#374151" }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProcurement}
                disabled={!isProcurementFormValid() || isSavingProcurement}
                className="px-6 py-3 rounded-lg font-medium transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1", color: "white" }}
              >
                {isSavingProcurement
                  ? "Saving..."
                  : editingProcurement
                    ? "Save Changes"
                    : "Create Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
