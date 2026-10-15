import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

/*
 * Browser security headers. The site is static and loads everything from its own origin
 * (fonts, images, scripts and Vercel Analytics), so the policy only allows 'self'.
 * Inline scripts and styles stay allowed: Next.js inlines its startup data and each
 * component ships a <style> block. Only `next dev` (the development-server phase, not NODE_ENV,
 * which a build environment could override) relaxes the policy for fast refresh.
 */
const policy = (dev: boolean) => [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${dev ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(dev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = (dev: boolean) => [
  { key: "Content-Security-Policy", value: policy(dev) },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

export default function nextConfig(phase: string): NextConfig {
  const dev = phase === PHASE_DEVELOPMENT_SERVER;
  return {
    distDir: dev ? ".next-dev" : ".next",
    devIndicators: false,
    poweredByHeader: false,
    async headers() {
      return [{ source: "/:path*", headers: securityHeaders(dev) }];
    },
  };
}
