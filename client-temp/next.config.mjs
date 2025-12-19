/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      // TODO: remove unused endpoint
      {
        source: '/runs',
        destination: 'http://localhost:8080/runs',
        source: '/activities',
        destination: 'http://localhost:8080/activities',
      },
    ]
  },
}

export default nextConfig
