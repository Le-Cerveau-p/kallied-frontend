import { useState } from "react";
import api from "../api/client";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
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
} from 'lucide-react';


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
        const res = await api.post("/auth/login", {
        email,
        password,
        });

        // save token
        const token = res.data.access_token;
        const expiresIn = res.data.expiresIn; // seconds (1800)

        const expiryTime = Date.now() + expiresIn * 1000;

        localStorage.setItem("token", token);
        localStorage.setItem("token_expiry", expiryTime.toString());
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("username", res.data.user.name);


        setUser({
          email: res.data.user.email,
          role: res.data.user.role,
          token,
        });

        // redirect based on role
        if (res.data.user.role === "ADMIN") {
          window.location.href = "/dashboard/admin";
        } 
        else if (res.data.user.role === "STAFF") {
          window.location.href = "/dashboard/staff";
        } 
        else {
          window.location.href = "/dashboard/client";
}
    } catch (err) {
        setErrors({
        api: err?.response?.data?.message || "Login failed",
        });
    } finally {
        setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #001f54 0%, #4169e1 50%, #a7fc00 100%)' }}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center" style={{ color: '#001f54' }}>
          Welcome Back
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Sign in to continue to your account
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none 
                    ${errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-blue-500"
                    }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative mt-1">
                <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                key={showPassword ? "text" : "password"}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-800 to-blue-500 text-white hover:opacity-90"
            }`}
          >  
            {loading ? (
              <>
                <Loader size={20} className="animate-spin" /> 
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
          {errors.api && (
            <p className="text-center text-sm text-red-500 mt-2">
                {errors.api}
            </p>
            )}

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow border-t" />
            <span className="px-3 text-sm text-gray-400">OR</span>
            <div className="flex-grow border-t" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Footer */}
          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <span className="text-blue-600 cursor-pointer hover:underline">
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
