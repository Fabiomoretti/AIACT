/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.fabiomoretti.com",
        pathname: "/wp-content/uploads/**"
      }
    ]
  }
};

export default nextConfig;
