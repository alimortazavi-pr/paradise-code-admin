/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "api.paradisecode.org"],
  },
};

module.exports = nextConfig;
