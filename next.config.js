/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.macrosandmeals.com',
        port: '', 
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'mui.com',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
       {
        protocol: "https",
        hostname: "mam-be.onrender.com", // ✅ added your backend domain
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
