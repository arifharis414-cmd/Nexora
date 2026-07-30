// Uploaded images are served by the backend at e.g. http://localhost:5000/uploads/xyz.jpg
// but our API calls go to http://localhost:5000/api. This strips the trailing /api
// so <img> tags can point at the right host in both dev and production.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVER_ORIGIN = API_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path; // already a full URL
  return `${SERVER_ORIGIN}${path}`;
};
