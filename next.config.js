/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Menos módulos que analizar en dev (Turbopack/Webpack): iconos y charts por entrada
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@tabler/icons-react',
      'recharts',
    ],
  },
  // Deshabilitar ESLint durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pps.whatsapp.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig