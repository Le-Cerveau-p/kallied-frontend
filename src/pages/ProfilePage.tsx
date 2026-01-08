import { useState, useRef, FormEvent } from 'react';
import AuthNavbar from '../components/AuthNavbar';
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
} from 'lucide-react';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobTitle: string;
  department: string;
  location: string;
  bio: string;
  avatar: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  jobTitle?: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Senior Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    bio: 'Passionate about building products that make a difference. 10+ years of experience in tech.',
    avatar: '',
  });

  const [editedData, setEditedData] = useState<UserData>(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!editedData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (editedData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!editedData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (editedData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (editedData.phone && !/^\+?[\d\s\-\(\)]+$/.test(editedData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!editedData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    return newErrors;
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedData(userData);
    setPreviewAvatar(userData.avatar);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData(userData);
    setErrors({});
    setPreviewAvatar(userData.avatar);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
        setEditedData({ ...editedData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewAvatar('');
    setEditedData({ ...editedData, avatar: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setUserData(editedData);
      setIsSubmitting(false);
      setIsEditing(false);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  const getInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`.toUpperCase();
  };

  const fullName = `${userData.firstName} ${userData.lastName}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Navbar */}
      <AuthNavbar
        currentPage="profile"
        userName={fullName}
        userEmail={userData.email}
        userAvatar={userData.avatar}
        notificationCount={3}
      />

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2" style={{ color: '#001f54' }}>
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3 animate-fade-in"
              style={{ backgroundColor: '#a7fc0020', border: '2px solid #a7fc00' }}
            >
              <CheckCircle size={24} style={{ color: '#a7fc00' }} />
              <div>
                <p className="font-semibold" style={{ color: '#001f54' }}>
                  Profile updated successfully!
                </p>
                <p className="text-sm text-gray-600">
                  Your changes have been saved.
                </p>
              </div>
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
            {/* Header with gradient */}
            <div
              className="h-32 relative"
              style={{
                background: 'linear-gradient(135deg, #001f54 0%, #4169e1 100%)',
              }}
            >
              <div className="absolute -bottom-16 left-8">
                {/* Profile Photo */}
                <div className="relative">
                  <div
                    className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center text-4xl font-bold overflow-hidden"
                    style={{
                      backgroundColor: previewAvatar || userData.avatar ? 'transparent' : '#4169e1',
                      color: 'white',
                    }}
                  >
                    {previewAvatar || userData.avatar ? (
                      <img
                        src={previewAvatar || userData.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials()
                    )}
                  </div>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer shadow-lg border-2 border-white"
                        style={{ backgroundColor: '#a7fc00' }}
                      >
                        <Camera size={20} style={{ color: '#001f54' }} />
                      </label>
                      {(previewAvatar || userData.avatar) && (
                        <button
                          onClick={handleRemovePhoto}
                          className="absolute -top-12 -right-2 flex items-center justify-center w-8 h-8 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                          type="button"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-20 px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold mb-1" style={{ color: '#001f54' }}>
                    {fullName}
                  </h2>
                  <p className="text-gray-600">{userData.jobTitle}</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="mt-4 md:mt-0 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: '#4169e1', color: 'white' }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#001f54' }}>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="firstName"
                            value={editedData.firstName}
                            onChange={(e) =>
                              setEditedData({ ...editedData, firstName: e.target.value })
                            }
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${
                              errors.firstName
                                ? 'border-red-500'
                                : 'border-gray-300 focus:border-[#4169e1]'
                            }`}
                          />
                          {errors.firstName && (
                            <p className="mt-2 text-sm text-red-500">{errors.firstName}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                          {userData.firstName}
                        </div>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="lastName"
                            value={editedData.lastName}
                            onChange={(e) =>
                              setEditedData({ ...editedData, lastName: e.target.value })
                            }
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${
                              errors.lastName
                                ? 'border-red-500'
                                : 'border-gray-300 focus:border-[#4169e1]'
                            }`}
                          />
                          {errors.lastName && (
                            <p className="mt-2 text-sm text-red-500">{errors.lastName}</p>
                          )}
                        </>
                      ) : (
                        <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                          {userData.lastName}
                        </div>
                      )}
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-gray-500">{userData.email}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Contact support to change your email address
                      </p>
                    </div>

                    {/* Phone */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        Phone Number
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            id="phone"
                            value={editedData.phone}
                            onChange={(e) =>
                              setEditedData({ ...editedData, phone: e.target.value })
                            }
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${
                              errors.phone
                                ? 'border-red-500'
                                : 'border-gray-300 focus:border-[#4169e1]'
                            }`}
                          />
                          {errors.phone && (
                            <p className="mt-2 text-sm text-red-500">{errors.phone}</p>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                          <Phone size={20} className="text-gray-400" />
                          {userData.phone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Work Information Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#001f54' }}>
                    Work Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Title */}
                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="jobTitle"
                            value={editedData.jobTitle}
                            onChange={(e) =>
                              setEditedData({ ...editedData, jobTitle: e.target.value })
                            }
                            className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-300 outline-none ${
                              errors.jobTitle
                                ? 'border-red-500'
                                : 'border-gray-300 focus:border-[#4169e1]'
                            }`}
                          />
                          {errors.jobTitle && (
                            <p className="mt-2 text-sm text-red-500">{errors.jobTitle}</p>
                          )}
                        </>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                          <Briefcase size={20} className="text-gray-400" />
                          {userData.jobTitle}
                        </div>
                      )}
                    </div>

                    {/* Department (Read-only) */}
                    <div>
                      <label
                        htmlFor="department"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        Department
                      </label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                        <User size={20} className="text-gray-400" />
                        <span className="text-gray-500">{userData.department}</span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Contact HR to change your department
                      </p>
                    </div>

                    {/* Location */}
                    <div className="md:col-span-2">
                      <label
                        htmlFor="location"
                        className="block mb-2 font-semibold text-sm"
                        style={{ color: '#001f54' }}
                      >
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="location"
                          value={editedData.location}
                          onChange={(e) =>
                            setEditedData({ ...editedData, location: e.target.value })
                          }
                          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4169e1] transition-all duration-300 outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                          <MapPin size={20} className="text-gray-400" />
                          {userData.location}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-semibold mb-4" style={{ color: '#001f54' }}>
                    About
                  </h3>
                  <div>
                    <label
                      htmlFor="bio"
                      className="block mb-2 font-semibold text-sm"
                      style={{ color: '#001f54' }}
                    >
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        id="bio"
                        rows={4}
                        value={editedData.bio}
                        onChange={(e) =>
                          setEditedData({ ...editedData, bio: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#4169e1] transition-all duration-300 outline-none resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-700">
                        {userData.bio || 'No bio added yet'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                      style={{ backgroundColor: '#a7fc00', color: '#001f54' }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader size={24} className="animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="flex-1 py-4 rounded-lg font-semibold text-lg border-2 transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ borderColor: '#4169e1', color: '#4169e1' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Additional Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: '#4169e120' }}
              >
                <Calendar size={24} style={{ color: '#4169e1' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#001f54' }}>
                Member Since
              </h3>
              <p className="text-gray-600">January 2024</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: '#4169e120' }}
              >
                <User size={24} style={{ color: '#4169e1' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#001f54' }}>
                Account Type
              </h3>
              <p className="text-gray-600">Professional Plan</p>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: '#4169e120' }}
              >
                <CheckCircle size={24} style={{ color: '#4169e1' }} />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#001f54' }}>
                Verification
              </h3>
              <p className="text-gray-600">Email Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
