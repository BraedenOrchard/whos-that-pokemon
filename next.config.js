/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: '*.github.com',
            port: '',
            pathname: '/PokeAPI/**',
        },
    ],
},
}

module.exports = nextConfig
