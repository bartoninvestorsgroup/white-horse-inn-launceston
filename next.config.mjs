import { networkInterfaces } from "os";

const localIp =
  Object.values(networkInterfaces())
    .flat()
    .find((i) => i.family === "IPv4" && !i.internal)?.address || "127.0.0.1";

const ngrokDevOrigins = ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  allowedDevOrigins: [localIp, `${localIp}:3000`, ...ngrokDevOrigins],
  experimental: {
    serverActions: {
      allowedOrigins: [
        `${localIp}:3000`,
        localIp,
        "localhost:3000",
        "localhost",
        ...ngrokDevOrigins,
      ],
    },
  },
};

export default nextConfig;
