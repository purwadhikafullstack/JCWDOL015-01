/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: process.env.NEXT_PUBLIC_API_URL.startsWith('https') ? 'https' : 'http',
          hostname: process.env.NEXT_PUBLIC_IMAGE_HOST,
          port: process.env.NEXT_PUBLIC_IMAGE_HOST === 'localhost' ? '8000' : '',
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  