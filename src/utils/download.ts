import { api } from "../api";

const parseFilename = (contentDisposition?: string | null) => {
  if (!contentDisposition) return null;
  const match = contentDisposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ?? null;
};

export const downloadFile = async (url: string, fallbackName?: string) => {
  const fullUrl = url.startsWith("http")
    ? url
    : `${api.defaults.baseURL}${url}`;
  const response = await api.get(fullUrl, { responseType: "blob" });
  const filename =
    parseFilename(response.headers["content-disposition"]) || fallbackName;
  const blobUrl = window.URL.createObjectURL(response.data);
  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  if (filename) {
    anchor.download = filename;
  }
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(blobUrl);
};
