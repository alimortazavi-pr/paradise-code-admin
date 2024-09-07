/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "api.paradisecode.org",
      "edu-paradise-code.liara.run",
    ],
  },
};

module.exports = nextConfig;
