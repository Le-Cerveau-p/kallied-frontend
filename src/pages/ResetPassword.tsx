import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, KeyRound, Lock, Loader, CircleCheck } from "lucide-react";
import { requestPasswordResetOtp, resetPassword } from "../api/auth";

type Step = "request" | "reset" | "success";

export default function ResetPassword() {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Resend cooldown countdown
  useEffect(() => {
    let interval: number | undefined;
    if (step === "reset" && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => (prev <= 1 ? 0 : prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordResetOtp(email.trim());
      setStep("reset");
      setMessage("OTP sent. Check your email.");
      setResendTimer(60);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }
    if (!newPassword.trim()) {
      setError("New password is required");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword: newPassword.trim(),
      });
      setStep("success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordResetOtp(email.trim());
      setMessage("OTP resent. Check your email.");
      setResendTimer(60);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to resend OTP");
    } finally {
      setLoading(false);
    }
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
        <h2
          className="text-2xl font-bold text-center"
          style={{ color: "#001f54" }}
        >
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          {step === "request" && "Enter your email to receive an OTP."}
          {step === "reset" && "Enter the OTP and your new password."}
          {step === "success" && "Your password has been reset."}
        </p>

        {message && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {step === "request" && (
          <form onSubmit={handleRequestOtp} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

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
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP Code
              </label>
              <div className="relative">
                <KeyRound className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

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
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading || resendTimer > 0}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ color: "#001f54" }}
            >
              {resendTimer > 0
                ? `Resend OTP (${formatTime(resendTimer)})`
                : "Resend OTP"}
            </button>
          </form>
        )}

        {step === "success" && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 text-green-600 mb-3">
              <CircleCheck size={24} />
            </div>
            <p className="text-sm text-gray-600">
              You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
