import { useEffect, useState, FormEvent } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import {
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Smartphone,
  Key,
  Mail,
  MessageSquare,
  Loader,
  CircleCheck,
  TriangleAlert,
  X,
  Trash2,
} from "lucide-react";
import { getCurrentUser } from "../../api/users";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface ModalState {
  isOpen: boolean;
  type: "delete-account" | "disable-2fa" | "clear-sessions" | null;
  title: string;
  message: string;
  confirmText: string;
  isDangerous: boolean;
}

export default function SettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    productUpdates: true,
    securityAlerts: true,
    marketingEmails: false,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: true,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [notificationSuccess, setNotificationSuccess] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    message: "",
    confirmText: "",
    isDangerous: false,
  });

  const [isModalProcessing, setIsModalProcessing] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserData(user);
      } catch (err) {
        console.error(err);
      }
    };
    loadUser();
  }, []);

  const validatePassword = (): PasswordErrors => {
    const errors: PasswordErrors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)
    ) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    const errors = validatePassword();
    setPasswordErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsChangingPassword(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsChangingPassword(false);
      setPasswordChangeSuccess(true);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        setPasswordChangeSuccess(false);
      }, 3000);
    }
  };

  const toggleNotification = async (key: keyof NotificationSettings) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });

    // Show success message
    setNotificationSuccess(true);
    setTimeout(() => {
      setNotificationSuccess(false);
    }, 2000);
  };

  const toggleSecurity = async (key: keyof SecuritySettings) => {
    if (key === "twoFactorAuth" && security.twoFactorAuth) {
      // Show confirmation modal for disabling 2FA
      openModal({
        type: "disable-2fa",
        title: "Disable Two-Factor Authentication?",
        message:
          "Disabling 2FA will make your account less secure. Are you sure you want to continue?",
        confirmText: "Disable 2FA",
        isDangerous: true,
      });
    } else {
      setSecurity({ ...security, [key]: !security[key] });
      showSecuritySuccess();
    }
  };

  const handleSessionTimeoutChange = (value: string) => {
    setSecurity({ ...security, sessionTimeout: value });
    showSecuritySuccess();
  };

  const showSecuritySuccess = () => {
    setSecuritySuccess(true);
    setTimeout(() => {
      setSecuritySuccess(false);
    }, 2000);
  };

  const openModal = (config: Omit<ModalState, "isOpen">) => {
    setModal({ ...config, isOpen: true });
  };

  const closeModal = () => {
    setModal({
      isOpen: false,
      type: null,
      title: "",
      message: "",
      confirmText: "",
      isDangerous: false,
    });
  };

  const handleModalConfirm = async () => {
    setIsModalProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (modal.type === "disable-2fa") {
      setSecurity({ ...security, twoFactorAuth: false });
      showSecuritySuccess();
    } else if (modal.type === "clear-sessions") {
      // Clear sessions logic
      showSecuritySuccess();
    } else if (modal.type === "delete-account") {
      // Delete account logic
      console.log("Account deleted");
    }

    setIsModalProcessing(false);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Navbar */}
      <AuthNavbar
        currentPage="settings"
        userName={userData?.name}
        userEmail={userData?.email}
        notificationCount={3}
      />

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "#001f54" }}
            >
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your account security and preferences
            </p>
          </div>

          {/* Success Messages */}
          {passwordChangeSuccess && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3 animate-fade-in"
              style={{
                backgroundColor: "#a7fc0020",
                border: "2px solid #a7fc00",
              }}
            >
              <CircleCheck size={24} style={{ color: "#a7fc00" }} />
              <p className="font-semibold" style={{ color: "#001f54" }}>
                Password changed successfully!
              </p>
            </div>
          )}

          {notificationSuccess && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3 animate-fade-in"
              style={{
                backgroundColor: "#a7fc0020",
                border: "2px solid #a7fc00",
              }}
            >
              <CircleCheck size={24} style={{ color: "#a7fc00" }} />
              <p className="font-semibold" style={{ color: "#001f54" }}>
                Notification preferences updated!
              </p>
            </div>
          )}

          {securitySuccess && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3 animate-fade-in"
              style={{
                backgroundColor: "#a7fc0020",
                border: "2px solid #a7fc00",
              }}
            >
              <CircleCheck size={24} style={{ color: "#a7fc00" }} />
              <p className="font-semibold" style={{ color: "#001f54" }}>
                Security settings updated!
              </p>
            </div>
          )}

          {/* Change Password Section */}
          <section className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#4169e120" }}
              >
                <Lock size={24} style={{ color: "#4169e1" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#001f54" }}>
                  Change Password
                </h2>
                <p className="text-gray-600 text-sm">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5">
              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block mb-2 font-semibold text-sm"
                  style={{ color: "#001f54" }}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-300 outline-none ${
                      passwordErrors.currentPassword
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#4169e1]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {passwordErrors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block mb-2 font-semibold text-sm"
                  style={{ color: "#001f54" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-300 outline-none ${
                      passwordErrors.newPassword
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#4169e1]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {passwordErrors.newPassword}
                  </p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Must be at least 8 characters with uppercase, lowercase, and
                  number
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 font-semibold text-sm"
                  style={{ color: "#001f54" }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-300 outline-none ${
                      passwordErrors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-300 focus:border-[#4169e1]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500">
                    {passwordErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
                style={{ backgroundColor: "#a7fc00", color: "#001f54" }}
              >
                {isChangingPassword ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Change Password
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Notification Preferences Section */}
          <section className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#4169e120" }}
              >
                <Bell size={24} style={{ color: "#4169e1" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#001f54" }}>
                  Notification Preferences
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose how you want to be notified
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      Email Notifications
                    </p>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.emailNotifications}
                  onChange={() => toggleNotification("emailNotifications")}
                />
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      Push Notifications
                    </p>
                    <p className="text-sm text-gray-600">
                      Receive push notifications on your devices
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.pushNotifications}
                  onChange={() => toggleNotification("pushNotifications")}
                />
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      SMS Notifications
                    </p>
                    <p className="text-sm text-gray-600">
                      Receive important alerts via SMS
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.smsNotifications}
                  onChange={() => toggleNotification("smsNotifications")}
                />
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Weekly Digest */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold" style={{ color: "#001f54" }}>
                    Weekly Digest
                  </p>
                  <p className="text-sm text-gray-600">
                    Get a summary of your activity every week
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.weeklyDigest}
                  onChange={() => toggleNotification("weeklyDigest")}
                />
              </div>

              {/* Product Updates */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold" style={{ color: "#001f54" }}>
                    Product Updates
                  </p>
                  <p className="text-sm text-gray-600">
                    Stay informed about new features and improvements
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.productUpdates}
                  onChange={() => toggleNotification("productUpdates")}
                />
              </div>

              {/* Security Alerts */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      Security Alerts
                    </p>
                    <p className="text-sm text-gray-600">
                      Important security notifications (recommended)
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications.securityAlerts}
                  onChange={() => toggleNotification("securityAlerts")}
                />
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div>
                  <p className="font-semibold" style={{ color: "#001f54" }}>
                    Marketing Emails
                  </p>
                  <p className="text-sm text-gray-600">
                    Receive promotional content and offers
                  </p>
                </div>
                <ToggleSwitch
                  checked={notifications.marketingEmails}
                  onChange={() => toggleNotification("marketingEmails")}
                />
              </div>
            </div>
          </section>

          {/* Security Settings Section */}
          <section className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#4169e120" }}
              >
                <Shield size={24} style={{ color: "#4169e1" }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: "#001f54" }}>
                  Security Settings
                </h2>
                <p className="text-gray-600 text-sm">
                  Manage your account security
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Smartphone size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={security.twoFactorAuth}
                  onChange={() => toggleSecurity("twoFactorAuth")}
                />
              </div>

              {/* Login Alerts */}
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      Login Alerts
                    </p>
                    <p className="text-sm text-gray-600">
                      Get notified of new login attempts
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={security.loginAlerts}
                  onChange={() => toggleSecurity("loginAlerts")}
                />
              </div>

              {/* Session Timeout */}
              <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Key size={20} className="text-gray-400" />
                  <div>
                    <p className="font-semibold" style={{ color: "#001f54" }}>
                      Session Timeout
                    </p>
                    <p className="text-sm text-gray-600">
                      Automatically log out after period of inactivity
                    </p>
                  </div>
                </div>
                <select
                  value={security.sessionTimeout}
                  onChange={(e) => handleSessionTimeoutChange(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-[#4169e1] outline-none transition-colors"
                  style={{ color: "#001f54" }}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Active Sessions */}
              <div className="p-4 rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                  Active Sessions
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  You're currently logged in on 3 devices
                </p>
                <button
                  onClick={() =>
                    openModal({
                      type: "clear-sessions",
                      title: "Clear All Sessions?",
                      message:
                        "This will log you out of all devices except this one. You will need to log in again on those devices.",
                      confirmText: "Clear Sessions",
                      isDangerous: false,
                    })
                  }
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  style={{ backgroundColor: "#4169e1", color: "white" }}
                >
                  Clear All Sessions
                </button>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white rounded-2xl border-2 border-red-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-100">
                <TriangleAlert size={24} className="text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-600">Danger Zone</h2>
                <p className="text-gray-600 text-sm">
                  Irreversible and destructive actions
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>
                <button
                  onClick={() =>
                    openModal({
                      type: "delete-account",
                      title: "Delete Account?",
                      message:
                        "This action is permanent and cannot be undone. All your data will be permanently deleted. Are you absolutely sure?",
                      confirmText: "Delete My Account",
                      isDangerous: true,
                    })
                  }
                  className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105 bg-red-600 text-white hover:bg-red-700 flex items-center gap-2 justify-center whitespace-nowrap"
                >
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  modal.isDangerous ? "bg-red-100" : "bg-yellow-100"
                }`}
              >
                <TriangleAlert
                  size={24}
                  className={
                    modal.isDangerous ? "text-red-600" : "text-yellow-600"
                  }
                />
              </div>
              <h3 className="text-xl font-bold" style={{ color: "#001f54" }}>
                {modal.title}
              </h3>
            </div>

            <p className="text-gray-600 mb-6">{modal.message}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeModal}
                disabled={isModalProcessing}
                className="flex-1 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ borderColor: "#4169e1", color: "#4169e1" }}
              >
                Cancel
              </button>
              <button
                onClick={handleModalConfirm}
                disabled={isModalProcessing}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  modal.isDangerous
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : ""
                }`}
                style={
                  !modal.isDangerous
                    ? { backgroundColor: "#a7fc00", color: "#001f54" }
                    : {}
                }
              >
                {isModalProcessing ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  modal.confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Toggle Switch Component
interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked ? "" : "bg-gray-300"
      }`}
      style={checked ? { backgroundColor: "#4169e1" } : {}}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
