import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow dev server access from LAN IPs (HMR + asset loading)
  allowedDevOrigins: ["192.168.1.106"],
};

export default nextConfig;