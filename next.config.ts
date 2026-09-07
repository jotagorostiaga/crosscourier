import type { NextConfig } from "next";

/**
 * `NEXT_OUTPUT=export` genera una versión estática del sitio en /out.
 * Se usa para armar la preview navegable; el deploy productivo no la necesita.
 */
const isStaticExport = process.env.NEXT_OUTPUT === "export";

/**
 * En GitHub Pages el sitio no vive en la raíz del dominio sino en
 * /<repositorio>, así que todas las rutas y los assets necesitan ese prefijo.
 * El workflow de deploy lo define; en local queda vacío.
 */
const basePath = process.env.NEXT_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // La fotografía vive en /public/media. El CDN queda como origen alternativo.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d8j0ntlcm91z4.cloudfront.net",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: isStaticExport,
  },
  poweredByHeader: false,
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
