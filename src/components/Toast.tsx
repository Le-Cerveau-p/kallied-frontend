import { useEffect } from "react";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

type ToastTone = "info" | "success" | "error";

interface ToastProps {
  message: string;
  tone?: ToastTone;
  duration?: number;
  onClose: () => void;
}

const toneConfig: Record<
  ToastTone,
  { icon: typeof Info; bg: string; text: string; border: string }
> = {
  info: {
    icon: Info,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  success: {
    icon: CheckCircle,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

export default function Toast({
  message,
  tone = "info",
  duration = 3200,
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timeout = window.setTimeout(onClose, duration);
    return () => window.clearTimeout(timeout);
  }, [duration, onClose]);

  const config = toneConfig[tone];
  const Icon = config.icon;

  return (
    <div className="fixed top-24 right-6 z-50 max-w-sm">
      <div
        className={`flex items-start gap-3 border ${config.border} ${config.bg} ${config.text} rounded-xl px-4 py-3 shadow-lg`}
      >
        <Icon className="w-5 h-5 mt-0.5" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="rounded-md p-1 hover:bg-white/60 transition"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
