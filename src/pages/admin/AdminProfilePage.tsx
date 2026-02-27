import { useState, useRef, FormEvent, useEffect } from "react";
import AuthNavbar from "../../components/AuthNavbar";
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  Camera,
  Loader,
  CheckCircle,
  X,
} from "lucide-react";
import { getCurrentUser } from "../../api/users";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  companyName?: string | null;
  department?: string | null;
  address?: string | null;
  phone?: string | null;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

  const getInitials = () => {
    return userData?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const firstName = () => {
    return userData?.name.split(" ")[0];
  };

  const lastName = () => {
    return userData?.name.split(" ")[1];
  };

  const fullName = `${userData?.name}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Navbar */}
      <AuthNavbar
        currentPage="profile"
        userName={fullName}
        userEmail={userData?.email}
        userAvatar=""
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
              My Profile
            </h1>
            {/* <p className="text-gray-600">
              Manage your organisation information and preferences
            </p> */}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            {/* Header with gradient */}
            <div
              className="h-32 relative"
              style={{
                background: "linear-gradient(135deg, #001f54 0%, #4169e1 100%)",
              }}
            >
              <div className="absolute -bottom-16 left-8">
                {/* Profile Photo */}
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold overflow-hidden"
                    style={{
                      backgroundColor: previewAvatar
                        ? "transparent"
                        : "#4169e1",
                      color: "white",
                    }}
                  >
                    {getInitials()}
                  </div>
                  {/* <div className="absolute bottom-0 right-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer shadow-lg border-2 border-white"
                      style={{ backgroundColor: "#a7fc00" }}
                    >
                      <Camera size={20} style={{ color: "#001f54" }} />
                    </label>
                    {previewAvatar}
                  </div> */}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2
                    className="text-3xl font-bold mb-1"
                    style={{ color: "#001f54" }}
                  >
                    {fullName}
                  </h2>
                  <p className="text-gray-600">Admin</p>
                </div>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "#001f54" }}
                  >
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {firstName()}
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {lastName()}
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-gray-500">{userData?.email}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Contact support to change your email address
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Phone Number
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        <Phone size={20} className="text-gray-400" />
                        {userData?.phone || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "#001f54" }}
                  >
                    Company Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Company Name
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        <Briefcase size={20} className="text-gray-400" />
                        {userData?.companyName || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Department
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        <User size={20} className="text-gray-400" />
                        {userData?.department || "N/A"}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Address
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        <MapPin size={20} className="text-gray-400" />
                        {userData?.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                {/* <div className="pt-6 border-t border-gray-200">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "#001f54" }}
                  >
                    Work Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title *
                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        <Briefcase size={20} className="text-gray-400" />
                        {userData.jobTitle}
                      </div>
                    </div>

                    {/* Department (Read-only) 
                    <div>
                      <label
                        htmlFor="department"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Department
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                        <User size={20} className="text-gray-400" />
                        <span className="text-gray-500">
                          {userData.department}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Contact HR to change your department
                      </p>
                    </div>

                    {/* Location 
                    <div className="md:col-span-2">
                      <label
                        htmlFor="location"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: "#001f54" }}
                      >
                        Location
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        <MapPin size={20} className="text-gray-400" />
                        {userData.location}
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Bio Section
                <div className="pt-6 border-t border-gray-200">
                  <h3
                    className="text-xl font-semibold mb-4"
                    style={{ color: "#001f54" }}
                  >
                    About
                  </h3>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block mb-2 font-semibold text-sm"
                      style={{ color: "#001f54" }}
                    >
                      Bio
                    </label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                      {userData.bio || "No bio added yet"}
                    </div>
                  </div>
                </div> */}
              </form>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <Calendar size={24} style={{ color: "#4169e1" }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                Member Since
              </h3>
              <p>{new Date(userData?.createdAt).toLocaleDateString()}</p>
            </div>

            {/* <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <User size={24} style={{ color: "#4169e1" }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                Account Type
              </h3>
              <p className="text-gray-600">Professional Plan</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: "#4169e120" }}
              >
                <CheckCircle size={24} style={{ color: "#4169e1" }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: "#001f54" }}>
                Verification
              </h3>
              <p className="text-gray-600">Email Verified</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
