const apiOrigin = process.env.SEISMIC_API_ORIGIN ??
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "https://linkoteq-seismic-api.vercel.app");

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
