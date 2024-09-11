/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ui-avatars.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
