/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pixellabs3.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost:3000",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
module.exports = nextConfig;
