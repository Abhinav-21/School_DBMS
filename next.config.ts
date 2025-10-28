import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: {
        allowedDevOrigins: [
            "https://3000-firebase-schooldbms-1761665538307.cluster-iktsryn7xnhpexlu6255bftka4.cloudworkstations.dev"
        ]
    },
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
