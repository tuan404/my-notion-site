import { siteConfig } from './lib/site-config'

export default siteConfig({
  // the site's root Notion page (required)
  rootNotionPageId: '758d7e1d682d4c598313fcddc64f0f90',

  // if you want to restrict pages to a single notion workspace (optional)
  // (this should be a Notion ID; see the docs for how to extract this)
  rootNotionSpaceId: null,

  // basic site info (required)
  name: 'Howdy, I am Tuan',
  domain: 'truongtuan.site',
  author: 'Tuan Truong',

  // open graph metadata (optional)
  description: 'Crafting Designs, Solving Problems, Building Experiences.',

  // social usernames (optional)

  // default notion icon and cover images for site-wide consistency (optional)
  // page-specific values will override these site-wide defaults
  defaultPageIcon: null,
  defaultPageCover: null,
  defaultPageCoverPosition: 0.5,

  // whether or not to enable support for LQIP preview images (optional)
  isPreviewImageSupportEnabled: true,

  // whether or not redis is enabled for caching generated preview images (optional)
  // NOTE: if you enable redis, you need to set the `REDIS_HOST` and `REDIS_PASSWORD`
  // environment variables. see the readme for more info
  // @ts-ignore
  isRedisEnabled: typeof process !== 'undefined' ? !!process.env.REDIS_HOST : false,

  pageUrlOverrides: {
    '/about-me': '8ac0a4321e2843b8bb9302496fe693e8',
    '/my-works': '5583591bdf5146c498c0d94c09f7d3e6',
    // My Works sub-pages
    '/hong-ngoc-ha': '13d7c3b21633804f873cff53c7da67ad',
    '/tmc-travel-management-company': '1367c3b216338185905ec6a11d103acf',
    '/tourops-internal-tour-operation-system': '1367c3b21633815e8d25eb9beba60533',
    '/dms-data-mining-system': 'c232ede8416e47ddab00fd7222362258',
    '/linebase': '68d7ed2275cc4ecfba841315d7d37316',
    '/seo-tools': '0b0e0e7c87664a09bc6bfae3cc54426a',
    '/vsses': '1dac6126b8d94008ab2a78817d0a6676'
  },

  // whether to use the default notion navigation style or a custom one with links to
  // important pages
  // navigationStyle: 'default'
  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'My works',
      pageId: '5583591bdf5146c498c0d94c09f7d3e6',
      activePaths: [
        '/hong-ngoc-ha',
        '/tmc-travel-management-company',
        '/tourops-internal-tour-operation-system',
        '/dms-data-mining-system',
        '/linebase',
        '/seo-tools',
        '/vsses'
      ]
    },
    {
      title: 'About',
      pageId: '8ac0a4321e2843b8bb9302496fe693e8'
    }
  ]
})
