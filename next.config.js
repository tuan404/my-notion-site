// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  staticPageGenerationTimeout: 300,
  images: {
    domains: [
      'www.notion.so',
      'notion.so',
      'images.unsplash.com',
      'pbs.twimg.com',
      'abs.twimg.com',
      's3.us-west-2.amazonaws.com',
      'transitivebullsh.it'
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  async redirects() {
    return [
      {
        source: '/hong-ngoc-ha',
        destination: '/my-work/hong-ngoc-ha',
        permanent: true
      },
      {
        source: '/tmc-travel-management-company',
        destination: '/my-work/tmc-travel-management-company',
        permanent: true
      },
      {
        source: '/tourops-internal-tour-operation-system',
        destination: '/my-work/tourops-internal-tour-operation-system',
        permanent: true
      },
      {
        source: '/dms-data-mining-system',
        destination: '/my-work/dms-data-mining-system',
        permanent: true
      },
      {
        source: '/linebase',
        destination: '/my-work/linebase',
        permanent: true
      },
      {
        source: '/seo-tools',
        destination: '/my-work/seo-tools',
        permanent: true
      },
      {
        source: '/vsses',
        destination: '/my-work/vsses',
        permanent: true
      }
    ]
  }
})
