/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: false,
  images: {
    domains: [
      "firebasestorage.googleapis.com"
    ]
  },
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
  },
  async rewrites() {
    return [
      {
        source: '/api/firebaseproject/authdomain/update',
        destination: 'https://vindyy.com/api/firebaseproject/authdomain/update'
      },
      {
        source: '/api/store/:id',
        destination: 'https://vindyy.com/api/store/:id'
      },
      {
        source: '/api/get-domain',
        destination: 'https://vindyy.com/api/get-domain'
      },
      {
        source: '/api/domain/:domain',
        destination: 'https://vindyy.com/api/domain/:domain'
      },
      {
        source: '/api/remove-domain/:domain',
        destination: 'https://vindyy.com/api/remove-domain/:domain'
      },
      {
        source: '/api/check-domain/:domain',
        destination: 'https://vindyy.com/api/check-domain/:domain'
      },
      {
        source: '/api/git-commit/git-commit',
        destination: 'https://vindyy.com/api/git-commit/git-commit'
      }
    ]
  }
}

// module.exports = nextConfig
