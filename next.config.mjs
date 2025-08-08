/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Suppress dev CORS warning for local alternate origins (e.g., 127.0.0.1 vs localhost)
    allowedDevOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"],
  },
};

export default nextConfig;
