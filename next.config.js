/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma", "puppeteer-core", "@sparticuz/chromium", "googleapis"],
  },
}

module.exports = nextConfig
