const apiOrigin = process.env.SEISMIC_API_ORIGIN ?? "http://localhost:8000";

export default {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: new URL("/api/v1/:path*", apiOrigin).href,
      },
    ];
  },
};
