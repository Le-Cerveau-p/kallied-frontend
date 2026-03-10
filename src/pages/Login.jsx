import { useEffect, useRef, useState } from "react";
import { api } from "../api/index";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { loginWithGoogle } from "../api/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { setUser } = useAuth();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleReadyRef = useRef(false);
  const googlePromptActiveRef = useRef(false);

  const handleAuthSuccess = (res) => {
    const token = res.access_token;
    const expiresIn = res.expiresIn;
    const expiryTime = Date.now() + expiresIn * 1000;

    localStorage.setItem("token", token);
    localStorage.setItem("token_expiry", expiryTime.toString());
    localStorage.setItem("role", res.user.role);
    localStorage.setItem("email", res.user.email);
    localStorage.setItem("username", res.user.name);

    setUser({
      email: res.user.email,
      role: res.user.role,
      token,
    });

    if (res.user.role === "ADMIN") {
      window.location.href = "/admin/dashboard";
    } else if (res.user.role === "STAFF") {
      window.location.href = "/staff/dashboard";
    } else {
      window.location.href = "/client/dashboard";
    }
  };

  useEffect(() => {
    if (!googleClientId) return;

    const existing = document.getElementById("google-identity-script");

    const initializeGoogle = () => {
      const google = window?.google;

      if (!google?.accounts?.id) return;

      google.accounts.id.initialize({
        client_id: googleClientId,
        use_fedcm_for_prompt: true,
        callback: async (response) => {
          googlePromptActiveRef.current = false;
          setGoogleLoading(false);

          try {
            if (!response?.credential) {
              throw new Error("No credential returned from Google");
            }

            const res = await loginWithGoogle(response.credential);

            if (res?.requiresSignup) {
              window.location.href = "/signup";
              return;
            }

            handleAuthSuccess(res);
          } catch (err) {
            setErrors({
              api:
                err?.response?.data?.message ||
                "Google login failed. Please try again.",
            });
          }
        },
      });

      googleReadyRef.current = true;
    };

    if (existing) {
      initializeGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-identity-script";

    script.onload = () => {
      console.info("[google-login] GSI script loaded");
      initializeGoogle();
    };

    script.onerror = () => {
      console.error("[google-login] Failed to load GSI script");
    };

    document.body.appendChild(script);
  }, [googleClientId]);

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

      handleAuthSuccess(res.data);
    } catch (err) {
      setErrors({
        api: err?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (googleLoading) return;
    if (!googleClientId) {
      console.error("[google-login] Missing VITE_GOOGLE_CLIENT_ID");
      setErrors({ api: "Google client ID is not configured." });
      return;
    }
    console.log("googleClientId:", googleClientId);

    const google = window?.google;

    if (!googleReadyRef.current || !google?.accounts?.id) {
      console.error("[google-login] GSI not ready", {
        scriptLoaded: googleReadyRef.current,
        hasGoogle: Boolean(google),
      });

      setErrors({ api: "Google Sign-In is not available yet. Try again." });
      return;
    }

    if (googlePromptActiveRef.current) return;

    googlePromptActiveRef.current = true;
    setGoogleLoading(true);

    google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();

        console.warn("[google-login] prompt not displayed", reason);

        setErrors({
          api:
            reason === "not_allowed"
              ? "Google Sign-In blocked by browser settings or extensions."
              : "Google Sign-In could not be displayed. Check OAuth origins.",
        });

        googlePromptActiveRef.current = false;
        setGoogleLoading(false);
      }

      if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
        googlePromptActiveRef.current = false;
        setGoogleLoading(false);
      }
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #001f54 0%, #4169e1 50%, #a7fc00 100%)",
      }}
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: "#001f54" }}
        >
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
                    ${
                      errors.email
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
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/reset-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
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
              "Sign in"
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
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full border py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <Loader size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continue with Google
              </>
            )}
          </button>

          {/* Footer */}
          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <Link to="/signup">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Sign up
              </span>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
