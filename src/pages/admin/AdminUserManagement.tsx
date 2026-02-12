import { useState, useEffect } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import AdminSidebar from "../../components/AdminSidebar";
import {
  Search,
  UserPlus,
  Edit,
  UserX,
  ShieldCheck,
  Users,
  Filter,
  X,
  Mail,
  Lock,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  getUserProjects,
  getUsers,
  removeStaffFromProject,
  createAdminUser,
  requestAdminOtp,
  verifyAdminOtp,
  updateAdminUser,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "../../api/admin";
import { adminSocket } from "../../socket/adminSocket";
import { getCurrentUser } from "../../api/users";
import Toast from "../../components/Toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF" | "CLIENT";
  status: "ENABLED" | "DISABLED";
  createdAt: string;
}

type ActionType = "add" | "edit" | "disable" | "enable" | "role-change";

interface PendingAction {
  type: ActionType;
  user?: User;
  data?: any;
}

export default function AdminUserManagement() {
  const [userData, setUserData] = useState<User | null>(null);
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
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "All" | "ADMIN" | "STAFF" | "CLIENT"
  >("All");
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);
  const [showRoleChangeDialog, setShowRoleChangeDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // OTP States
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [enteredOTP, setEnteredOTP] = useState("");
  const [otpRecipientEmail, setOtpRecipientEmail] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
  const [isOTPExpired, setIsOTPExpired] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"ADMIN" | "STAFF" | "CLIENT">(
    "CLIENT",
  );
  const [newUserCompanyName, setNewUserCompanyName] = useState("");
  const [newUserDepartment, setNewUserDepartment] = useState("");
  const [newUserAddress, setNewUserAddress] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [newRoleSelection, setNewRoleSelection] = useState<
    "ADMIN" | "STAFF" | "CLIENT"
  >("STAFF");

  // Authorized email for OTP
  const [authorizedEmail, setAuthorizedEmail] = useState(
    "techcity025@gmail.com",
  );
  const approvedOtpRecipients = [
    "aremupp@gmail.com",
    "lecerveau.techcity@gmail.com",
  ];

  // Mock user data
  const [users, setUsers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [projects, setProjects] = useState([]);

  const openProjectModal = async (staffId: string) => {
    setSelectedStaff(staffId);
    const data = await getUserProjects(staffId);
    setProjects(data);
  };
  const removeStaff = async (projectId: string) => {
    if (!selectedStaff) return;

    await removeStaffFromProject(projectId, selectedStaff);

    setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
  };

  adminSocket.on("user-removed-from-project", ({ projectId, userId }) => {
    if (userId === selectedStaff) {
      setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
    }
  });

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  // OTP Timer countdown
  useEffect(() => {
    let interval: number | undefined;
    if (showOTPDialog && otpSent && otpTimer > 0 && !isOTPExpired) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setIsOTPExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOTPDialog, otpTimer, isOTPExpired]);

  // Initialize OTP request
  const requestOTP = async (action: PendingAction) => {
    setPendingAction(action);
    setEnteredOTP("");
    setOtpError("");
    setOtpTimer(300); // Reset to 5 minutes
    setIsOTPExpired(false);
    setOtpSent(false);
    setOtpRecipientEmail("");
    setShowOTPDialog(true);
  };

  const isApprovedRecipient = (email: string) =>
    approvedOtpRecipients.includes(email.toLowerCase());

  const sendOtpNow = async () => {
    const email = otpRecipientEmail.trim().toLowerCase();
    if (!email) {
      setOtpError("Please enter an approved email.");
      return;
    }
    if (!isApprovedRecipient(email)) {
      setToastMessage("Email entered is not approved.");
      return;
    }

    setOtpError("");
    setOtpTimer(300);
    setIsOTPExpired(false);

    try {
      const response = await requestAdminOtp("USER_MANAGEMENT", email);
      if (response?.email) {
        setAuthorizedEmail(response.email);
      } else {
        setAuthorizedEmail(email);
      }
      setOtpSent(true);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Failed to send OTP.";
      setOtpError(message);
      setOtpSent(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setEnteredOTP("");
    await sendOtpNow();
  };

  // Verify OTP and execute action
  const verifyOTPAndExecute = async () => {
    if (!otpSent) {
      setOtpError("Send the OTP before verifying.");
      return;
    }
    if (isOTPExpired) {
      setOtpError("OTP has expired. Please request a new one.");
      return;
    }

    try {
      await verifyAdminOtp(enteredOTP, "USER_MANAGEMENT");
    } catch (error: any) {
      const message = error?.response?.data?.message || "Invalid OTP.";
      setOtpError(message);
      return;
    }

    // OTP is valid, execute the pending action
    if (pendingAction) {
      await executeAction(pendingAction);
    }

    // Close OTP dialog
    setShowOTPDialog(false);
    setEnteredOTP("");
    setOtpError("");
    setOtpSent(false);
  };

  // Execute the actual action after OTP verification
  const executeAction = async (action: PendingAction) => {
    try {
      switch (action.type) {
        case "add":
          await createAdminUser({
            name: action.data.name,
            email: action.data.email,
            password: action.data.password,
            role: action.data.role,
            companyName: action.data.companyName,
            department: action.data.department,
            address: action.data.address,
            phone: action.data.phone,
          });
          setUsers(await getUsers());
          setShowAddUserDialog(false);
          showSuccess(
            `User "${action.data.name}" has been added successfully.`,
          );
          resetAddUserForm();
          break;

        case "edit":
          await updateAdminUser(action.user?.id, {
            name: action.data.name,
            email: action.data.email,
          });
          setUsers(await getUsers());
          setShowEditDialog(false);
          showSuccess(
            `User "${action.data.name}" has been updated successfully.`,
          );
          break;

        case "disable":
        case "enable":
          await updateAdminUserStatus(
            action.user?.id,
            action.user?.status === "ENABLED" ? "DISABLED" : "ENABLED",
          );
          setUsers(await getUsers());
          setShowDisableDialog(false);
          showSuccess(
            `User "${action.user?.name}" has been ${
              action.user?.status === "ENABLED" ? "disabled" : "enabled"
            } successfully.`,
          );
          break;

        case "role-change":
          await updateAdminUserRole(action.user?.id, action.data.newRole);
          setUsers(await getUsers());
          setShowRoleChangeDialog(false);
          showSuccess(
            `User "${action.user?.name}" role has been changed to ${action.data.newRole}.`,
          );
          break;
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Action failed. Please try again.";
      setToastMessage(message);
    }

    setPendingAction(null);
    setSelectedUser(null);
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const resetAddUserForm = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setNewUserRole("CLIENT");
    setNewUserCompanyName("");
    setNewUserDepartment("");
    setNewUserAddress("");
    setNewUserPhone("");
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { bg: "#fce4ec", text: "#d4183d" };
      case "STAFF":
        return { bg: "#e3f2fd", text: "#4169e1" };
      case "CLIENT":
        return { bg: "#f1f8e9", text: "#558b2f" };
      default:
        return { bg: "#f5f5f5", text: "#717182" };
    }
  };

  const getStatusColor = (status: string) => {
    return status === "ENABLED"
      ? { bg: "#f1f8e9", text: "#558b2f" }
      : { bg: "#f5f5f5", text: "#717182" };
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Handler functions that request OTP
  const handleAddUser = () => {
    if (!newUserName || !newUserEmail || !newUserPassword) {
      setToastMessage("Please fill in all required fields.");
      return;
    }
    requestOTP({
      type: "add",
      data: {
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
        companyName: newUserCompanyName || undefined,
        department: newUserDepartment || undefined,
        address: newUserAddress || undefined,
        phone: newUserPhone || undefined,
      },
    });
  };

  const handleSaveEdit = () => {
    if (!editUserName || !editUserEmail) {
      setToastMessage("Please fill in all required fields.");
      return;
    }
    requestOTP({
      type: "edit",
      user: selectedUser!,
      data: { name: editUserName, email: editUserEmail },
    });
  };

  const handleDisableUser = (user: User) => {
    setSelectedUser(user);
    setShowDisableDialog(true);
  };

  const confirmDisableUser = () => {
    requestOTP({
      type: selectedUser?.status === "ENABLED" ? "disable" : "enable",
      user: selectedUser!,
    });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setShowEditDialog(true);
  };

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRoleSelection(user.role);
    setShowRoleChangeDialog(true);
  };

  const confirmRoleChange = (newRole: "ADMIN" | "STAFF" | "CLIENT") => {
    if (newRole === selectedUser?.role) {
      return;
    }
    requestOTP({
      type: "role-change",
      user: selectedUser!,
      data: { newRole },
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const roleOptions: Array<"ADMIN" | "STAFF" | "CLIENT"> = [
    "ADMIN",
    "STAFF",
    "CLIENT",
  ];

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
        currentPage="dashboard"
        userName={userData?.name}
        userEmail={userData?.email}
        userAvatar=""
        notificationCount={3}
      />
      <AdminSidebar activeItem="users" />

      <main className="lg:pl-64 pt-16">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Success Message */}
          {showSuccessMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Page Heading */}
          <div className="mb-6">
            <h1 className="text-2xl mb-2" style={{ color: "#001f54" }}>
              User Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage system users, roles, and permissions
            </p>
          </div>

          {/* Top Controls */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Role Filter */}
              <div className="relative sm:w-48">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                >
                  <option value="All">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                  <option value="CLIENT">Client</option>
                </select>
              </div>

              {/* Add User Button */}
              <button
                onClick={() => setShowAddUserDialog(true)}
                className="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-opacity flex items-center gap-2 justify-center"
                style={{ backgroundColor: "#4169e1" }}
              >
                <UserPlus className="w-5 h-5" />
                Add New User
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#e3f2fd" }}
                >
                  <Users className="w-5 h-5" style={{ color: "#4169e1" }} />
                </div>
                <h3 className="text-gray-600 text-sm">Total Users</h3>
              </div>
              <p className="text-2xl" style={{ color: "#001f54" }}>
                {users.length}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#f1f8e9" }}
                >
                  <ShieldCheck
                    className="w-5 h-5"
                    style={{ color: "#558b2f" }}
                  />
                </div>
                <h3 className="text-gray-600 text-sm">Active Users</h3>
              </div>
              <p className="text-2xl" style={{ color: "#001f54" }}>
                {users.filter((u) => u.status === "ENABLED").length}
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: "#fce4ec" }}
                >
                  <UserX className="w-5 h-5" style={{ color: "#d4183d" }} />
                </div>
                <h3 className="text-gray-600 text-sm">Disabled Users</h3>
              </div>
              <p className="text-2xl" style={{ color: "#001f54" }}>
                {users.filter((u) => u.status === "DISABLED").length}
              </p>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: "#001f54" }}>
                  <tr>
                    <th className="px-6 py-3 text-left text-white text-sm">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-white text-sm">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-white text-sm">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-white text-sm">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-white text-sm">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-white text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user?) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                              style={{ backgroundColor: "#4169e1" }}
                            >
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span
                              className="font-medium text-sm"
                              style={{ color: "#001f54" }}
                            >
                              {user.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleRoleChange(user)}
                            className="px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
                            style={{
                              backgroundColor: getRoleColor(user.role).bg,
                              color: getRoleColor(user.role).text,
                            }}
                            title="Click to change role"
                          >
                            {user.role}
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: getStatusColor(user.status).bg,
                              color: getStatusColor(user.status).text,
                            }}
                          >
                            {user.status === "ENABLED" ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {user.createdAt}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              title="Edit user"
                              style={{ color: "#4169e1" }}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDisableUser(user)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.status === "ENABLED"
                                  ? "hover:bg-red-50"
                                  : "hover:bg-green-50"
                              }`}
                              title={
                                user.status === "ENABLED"
                                  ? "Disable user"
                                  : "Enable user"
                              }
                              style={{
                                color:
                                  user.status === "ENABLED"
                                    ? "#d4183d"
                                    : "#558b2f",
                              }}
                            >
                              <UserX className="w-4 h-4" />
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
        </div>
      </main>

      {/* OTP Verification Dialog */}
      {showOTPDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e3f2fd" }}
              >
                <Lock className="w-8 h-8" style={{ color: "#4169e1" }} />
              </div>
              <h2 className="text-2xl mb-2" style={{ color: "#001f54" }}>
                OTP Verification Required
              </h2>
              <p className="text-gray-600 text-sm">
                An OTP has been sent to authorized personnel
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4" style={{ color: "#4169e1" }} />
                <p className="text-sm" style={{ color: "#001f54" }}>
                  OTP sent to:
                </p>
              </div>
              <p className="text-sm font-medium" style={{ color: "#4169e1" }}>
                {otpSent ? authorizedEmail : "Not sent yet"}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-700">
                Approved Recipient Email
              </label>
              <input
                type="email"
                value={otpRecipientEmail}
                onChange={(e) => {
                  setOtpRecipientEmail(e.target.value);
                  setOtpError("");
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="authorized@gmail.com"
                disabled={otpSent}
              />
              <p className="text-xs text-gray-500 mt-1">
                Approved emails: aremupp@gmail.com, lecerveau.techcity@gmail.com
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-2 text-gray-700">
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                value={enteredOTP}
                onChange={(e) => {
                  setEnteredOTP(e.target.value.replace(/\D/g, ""));
                  setOtpError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
                placeholder="000000"
                disabled={isOTPExpired || !otpSent}
              />
            </div>

            {otpError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">{otpError}</p>
              </div>
            )}

            <div className="flex items-center justify-between mb-6 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span
                  className={`${
                    otpTimer < 60 ? "text-red-600 font-medium" : "text-gray-600"
                  }`}
                >
                  {!otpSent
                    ? "Not started"
                    : isOTPExpired
                      ? "Expired"
                      : formatTime(otpTimer)}
                </span>
              </div>
              <button
                onClick={handleResendOTP}
                className="text-sm flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ color: "#4169e1" }}
                disabled={!otpRecipientEmail.trim()}
              >
                <RefreshCw className="w-4 h-4" />
                Resend OTP
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOTPDialog(false);
                  setEnteredOTP("");
                  setOtpError("");
                  setPendingAction(null);
                  setOtpSent(false);
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                onClick={verifyOTPAndExecute}
                disabled={enteredOTP.length !== 6 || isOTPExpired || !otpSent}
                className="flex-1 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#4169e1" }}
              >
                Verify & Proceed
              </button>
            </div>
            {!otpSent && (
              <button
                onClick={sendOtpNow}
                className="w-full mt-3 px-4 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#001f54" }}
              >
                Send OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add User Dialog */}
      {showAddUserDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#001f54" }}>
                Add New User
              </h2>
              <button
                onClick={() => {
                  setShowAddUserDialog(false);
                  resetAddUserForm();
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#717182" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Set a temporary password"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="CLIENT">Client</option>
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Company Name
                </label>
                <input
                  type="text"
                  value={newUserCompanyName}
                  onChange={(e) => setNewUserCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Client Company Name"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Department
                </label>
                <input
                  type="text"
                  value={newUserDepartment}
                  onChange={(e) => setNewUserDepartment(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Client Department"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Address
                </label>
                <input
                  type="text"
                  value={newUserAddress}
                  onChange={(e) => setNewUserAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="456 Client Avenue, Floor 5"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <Lock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  OTP verification will be required to complete this action
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddUserDialog(false);
                    resetAddUserForm();
                  }}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  style={{ color: "#001f54" }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#4169e1" }}
                  onClick={handleAddUser}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      {showEditDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl" style={{ color: "#001f54" }}>
                Edit User
              </h2>
              <button
                onClick={() => setShowEditDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: "#717182" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  className="block text-sm mb-2"
                  style={{ color: "#001f54" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <Lock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  OTP verification will be required to complete this action
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  style={{ color: "#001f54" }}
                >
                  Cancel
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#4169e1" }}
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disable/Enable User Confirmation Dialog */}
      {showDisableDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  backgroundColor:
                    selectedUser.status === "ENABLED" ? "#fce4ec" : "#f1f8e9",
                }}
              >
                <UserX
                  className="w-6 h-6"
                  style={{
                    color:
                      selectedUser.status === "ENABLED" ? "#d4183d" : "#558b2f",
                  }}
                />
              </div>
              <h2
                className="text-xl text-center mb-2"
                style={{ color: "#001f54" }}
              >
                {selectedUser.status === "ENABLED"
                  ? "Disable User"
                  : "Enable User"}
              </h2>
              <p className="text-center text-gray-600 text-sm">
                Are you sure you want to{" "}
                {selectedUser.status === "ENABLED" ? "disable" : "enable"}{" "}
                <span className="font-medium" style={{ color: "#001f54" }}>
                  {selectedUser.name}
                </span>
                ?
              </p>
              {selectedUser.status === "ENABLED" && (
                <p className="text-center text-sm text-gray-500 mt-2">
                  This user will no longer be able to access the system.
                </p>
              )}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2 mt-4">
                <Lock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  OTP verification will be required to complete this action
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDisableDialog(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{ color: "#001f54" }}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor:
                    selectedUser.status === "ENABLED" ? "#d4183d" : "#32cd32",
                }}
                onClick={confirmDisableUser}
              >
                {selectedUser.status === "ENABLED" ? "Disable" : "Enable"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Confirmation Dialog */}
      {showRoleChangeDialog && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#e3f2fd" }}
              >
                <ShieldCheck className="w-6 h-6" style={{ color: "#4169e1" }} />
              </div>
              <h2
                className="text-xl text-center mb-2"
                style={{ color: "#001f54" }}
              >
                Change User Role
              </h2>
              <p className="text-center text-gray-600 text-sm mb-4">
                Select a new role for{" "}
                <span className="font-medium" style={{ color: "#001f54" }}>
                  {selectedUser.name}
                </span>
              </p>
              <p className="text-center text-sm mb-4">
                Current role:{" "}
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: getRoleColor(selectedUser.role).bg,
                    color: getRoleColor(selectedUser.role).text,
                  }}
                >
                  {selectedUser.role}
                </span>
              </p>
              <div className="space-y-2 mb-4">
                {roleOptions.map((role) => (
                  <button
                    key={role}
                    onClick={() => confirmRoleChange(role)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={role === selectedUser.role}
                  >
                    <span style={{ color: "#001f54" }}>{role}</span>
                    {role === selectedUser.role && (
                      <span className="text-xs text-gray-500">(Current)</span>
                    )}
                  </button>
                ))}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <Lock className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  OTP verification will be required to complete this action
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRoleChangeDialog(false)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              style={{ color: "#001f54" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
