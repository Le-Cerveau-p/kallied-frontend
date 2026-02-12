import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import ClientDashboard from "./pages/client/ClientDashboard";
import DashboardRouter from "./pages/DashboardRouter";
import Features from "./pages/Features";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ClientProjectsPage from "./pages/client/ClientProjectsPage";
import ClientChatThreadsPage from "./pages/client/ClientChatThreadsPage";
import ThreadsRouter from "./pages/ThreadsRouter";
import ProjectsRouter from "./pages/ProjectsRouter";
import ClientDashboardsPage from "./pages/client/ClientDashboardsPage";
import ClientInvoicesPage from "./pages/client/ClientInvoicesPage";
import ClientReportsPage from "./pages/client/ClientReportsPage";
import ClientRequestsPage from "./pages/client/ClientRequestsPage";
import StaffDashboardsPage from "./pages/staff/StaffDashboardsPage";
import StaffMessagesPage from "./pages/staff/StaffMessagesPage";
import StaffProjectsPage from "./pages/staff/StaffProjectsPage";
import StaffProjectDetailPage from "./pages/staff/StaffProjectDetailPage";
import StaffReportsPage from "./pages/staff/StaffReportsPage";
import StaffResourcesPage from "./pages/staff/StaffResourcesPage";
import StaffTimesheetsPage from "./pages/staff/StaffTimesheetsPage";
import StaffUploadDataPage from "./pages/staff/StaffUploadDataPage";
import StaffInvoicesPage from "./pages/staff/StaffInvoicesPage";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminBillingContracts from "./pages/admin/AdminBillingContracts";
import AdminMessagesPage from "./pages/admin/AdminMessagesPage";
import AdminProcurementManagement from "./pages/admin/AdminProcurementManagement";
import AdminProjectsManagement from "./pages/admin/AdminProjectsManagement";
import AdminResources from "./pages/admin/AdminResources";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import ProfileRouter from "./pages/ProfileRouter";
import SettingsRouter from "./pages/SettingsRouter";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import ClientProfilePage from "./pages/client/ClientProfilePage";
import StaffProfilePage from "./pages/staff/StaffProfilePage";
import AdminTimesheetsPage from "./pages/admin/AdminTimesheetsPage";
import ClientSettingsPage from "./pages/client/ClientSettingsPage";
import StaffSettingsPage from "./pages/staff/StaffSettingsPage";

function App() {
  return (
    <Routes>
      {/* {Public} */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/features" element={<Features />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Protected (later) */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminDashboard />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/logs"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminActivityLogs />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminAnalytics />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/billing"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminBillingContracts />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/timesheets"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminTimesheetsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/threads"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminMessagesPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/procurements"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminProcurementManagement />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminProjectsManagement />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminResources />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminSettingsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminUserManagement />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            {" "}
            <AdminProfilePage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/dashboard"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffDashboard />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/dashboards"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffDashboardsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/threads"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffMessagesPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/projects"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffProjectsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/projects/:id"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffProjectDetailPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/reports"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffReportsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/resources"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffResourcesPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/timesheets"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffTimesheetsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/upload"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffUploadDataPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/invoices"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffInvoicesPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/profile"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffProfilePage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/staff/settings"
        element={
          <ProtectedRoute roles={["STAFF"]}>
            {" "}
            <StaffSettingsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientDashboard />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/projects"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientProjectsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/threads"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientChatThreadsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/dashboards"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientDashboardsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/invoices"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientInvoicesPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/reports"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientReportsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/requests"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientRequestsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/profile"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientProfilePage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/client/settings"
        element={
          <ProtectedRoute roles={["CLIENT"]}>
            {" "}
            <ClientSettingsPage />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["ADMIN", "STAFF", "CLIENT"]}>
            {" "}
            <DashboardRouter />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute roles={["ADMIN", "STAFF", "CLIENT"]}>
            {" "}
            <ProjectsRouter />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/threads"
        element={
          <ProtectedRoute roles={["ADMIN", "STAFF", "CLIENT"]}>
            {" "}
            <ThreadsRouter />{" "}
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute roles={["ADMIN", "STAFF", "CLIENT"]}>
            {" "}
            <ProfileRouter />{" "}
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute roles={["ADMIN", "STAFF", "CLIENT"]}>
            {" "}
            <SettingsRouter />{" "}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
