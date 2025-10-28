import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "h4i18ptd8tw09zgr.public.blob.vercel-storage.com",
            },
        ],
    },
};

export default nextConfig;
