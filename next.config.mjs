/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['undici'],
  },
  // Configure server timeout settings
  serverRuntimeConfig: {
    // Set longer timeouts for external API calls
    requestTimeout: 1800000, // 30 minutes
  },
  // Environment variables for undici configuration
  env: {
    UNDICI_HEADERS_TIMEOUT: '1800000', // 30 minutes
    UNDICI_BODY_TIMEOUT: '1800000',    // 30 minutes
  },
  images: { 
    domains: ["i.pravatar.cc", "images.unsplash.com", "via.placeholder.com", "fal.media", "tempfile.aiquickdraw.com"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fal.media',
        port: '',
        pathname: '/files/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's.sprunki.run',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tempfile.aiquickdraw.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;
