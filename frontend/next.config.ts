/** @type {import('next').NextConfig} */
const nextConfig = {
  /* ─── Production Domain Mapping ──────────────────────
   *  Deploy target: arthashastra.bismaya.dev
   *
   *  For Vercel:  Add this domain in Project Settings → Domains.
   *  For custom:  Point an A/CNAME record to your host and
   *               set NEXT_PUBLIC_SITE_URL in your .env.
   * ──────────────────────────────────────────────────── */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
