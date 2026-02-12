import { useState, useRef, useEffect } from "react";
import {
  Download,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  File,
  Eye,
  Share2,
  Copy,
} from "lucide-react";

interface MessageAttachment {
  name: string;
  type: string;
  url: string;
  size?: string;
}

interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

interface MessageDisplayProps {
  content: string;
  attachment?: MessageAttachment;
  isOwnMessage?: boolean;
}

export function MessageDisplay({
  content,
  attachment,
  isOwnMessage,
}: MessageDisplayProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    attachment: MessageAttachment;
  } | null>(null);
  const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Extract URLs from text content
  useEffect(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlRegex);

    if (urls) {
      // Mock link previews - in real app, fetch from API
      const previews: LinkPreview[] = urls.map((url) => {
        if (url.includes("youtube.com") || url.includes("youtu.be")) {
          return {
            url,
            title: "YouTube Video",
            description: "Watch this video on YouTube",
            image:
              "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=225&fit=crop",
            siteName: "YouTube",
          };
        } else if (url.includes("github.com")) {
          return {
            url,
            title: "GitHub Repository",
            description: "Check out this repository on GitHub",
            image:
              "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=225&fit=crop",
            siteName: "GitHub",
          };
        } else {
          return {
            url,
            title: "Website Link",
            description: "Click to visit this link",
            siteName: new URL(url).hostname,
          };
        }
      });
      setLinkPreviews(previews);
    }
  }, [content]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu]);

  const handleContextMenu = (
    e: React.MouseEvent,
    attachment: MessageAttachment,
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      attachment,
    });
  };

  const handleDownload = (attachment: MessageAttachment) => {
    // In real app, trigger download
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
    setContextMenu(null);
  };

  const handleView = (attachment: MessageAttachment) => {
    // Open in new tab
    window.open(attachment.url, "_blank");
    setContextMenu(null);
  };

  const handleCopyLink = (attachment: MessageAttachment) => {
    navigator.clipboard.writeText(attachment.url);
    setContextMenu(null);
  };

  const handleAttachmentClick = (attachment: MessageAttachment) => {
    // Open appropriate viewer based on file type
    if (attachment.type.startsWith("image/")) {
      // Open image in new tab
      window.open(attachment.url, "_blank");
    } else if (attachment.type === "application/pdf") {
      // Open PDF in browser
      window.open(attachment.url, "_blank");
    } else if (
      attachment.type === "application/msword" ||
      attachment.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      attachment.type === "application/vnd.ms-excel" ||
      attachment.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      // Try to open in Google Docs viewer
      window.open(
        `https://docs.google.com/viewer?url=${encodeURIComponent(attachment.url)}`,
        "_blank",
      );
    } else {
      // Download for other types
      handleDownload(attachment);
    }
  };

  const renderMessageContent = () => {
    // Replace URLs with clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:no-underline"
            style={{ color: isOwnMessage ? "white" : "#4169e1" }}
          >
            {part}
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon;
    if (type === "application/pdf") return FileText;
    return File;
  };

  return (
    <>
      <div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {renderMessageContent()}
        </p>

        {/* Link Previews */}
        {linkPreviews.length > 0 && (
          <div className="mt-3 space-y-2">
            {linkPreviews.map((preview, index) => (
              <a
                key={index}
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors"
              >
                {preview.image && (
                  <img
                    src={preview.image}
                    alt={preview.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div
                  className="p-3"
                  style={{
                    backgroundColor: isOwnMessage
                      ? "rgba(255, 255, 255, 0.1)"
                      : "#f9fafb",
                  }}
                >
                  {preview.siteName && (
                    <p className="text-xs font-medium mb-1 opacity-75">
                      {preview.siteName}
                    </p>
                  )}
                  {preview.title && (
                    <p className="text-sm font-semibold mb-1">
                      {preview.title}
                    </p>
                  )}
                  {preview.description && (
                    <p className="text-xs opacity-75 line-clamp-2">
                      {preview.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Attachment */}
        {attachment && (
          <div className="mt-3">
            {attachment.type.startsWith("image/") ? (
              // Image Attachment
              <div
                className="rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer group"
                onClick={() => handleAttachmentClick(attachment)}
                onContextMenu={(e) => handleContextMenu(e, attachment)}
              >
                <div className="relative">
                  <img
                    src={attachment.url}
                    alt={attachment.name}
                    className="w-full h-auto max-h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div
                  className="p-2 flex items-center justify-between text-xs"
                  style={{
                    backgroundColor: isOwnMessage
                      ? "rgba(53, 87, 179, 0.8)"
                      : "#e5e7eb",
                  }}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <ImageIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{attachment.name}</span>
                  </div>
                  {attachment.size && (
                    <span className="ml-2 flex-shrink-0">
                      {attachment.size}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              // File Attachment
              <div
                className="rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: isOwnMessage
                    ? "rgba(53, 87, 179, 0.8)"
                    : "#e5e7eb",
                }}
                onClick={() => handleAttachmentClick(attachment)}
                onContextMenu={(e) => handleContextMenu(e, attachment)}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: isOwnMessage ? "#4169e1" : "#9ca3af",
                  }}
                >
                  {(() => {
                    const Icon = getFileIcon(attachment.type);
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {attachment.name}
                  </p>
                  {attachment.size && (
                    <p className="text-xs opacity-75">{attachment.size}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(attachment);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 py-1 z-[100] min-w-[180px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={() => handleView(contextMenu.attachment)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-3"
            style={{ color: "#001f54" }}
          >
            <Eye className="w-4 h-4" />
            Open
          </button>
          <button
            onClick={() => handleDownload(contextMenu.attachment)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-3"
            style={{ color: "#001f54" }}
          >
            <Download className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => handleCopyLink(contextMenu.attachment)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-3"
            style={{ color: "#001f54" }}
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </button>
          <button
            onClick={() => {
              window.open(contextMenu.attachment.url, "_blank");
              setContextMenu(null);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors flex items-center gap-3"
            style={{ color: "#001f54" }}
          >
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </button>
        </div>
      )}
    </>
  );
}
