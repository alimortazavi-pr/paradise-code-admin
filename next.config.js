/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "api.paradisecode.org",
      "paradise-code.cyclic.cloud",
    ],
  },
};

module.exports = nextConfig;
