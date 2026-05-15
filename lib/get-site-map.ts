import { getAllPagesInSpace, uuidToId } from 'notion-utils'

import * as config from './config'
import * as types from './types'
import { includeNotionIdInUrls } from './config'
import { db } from './db'
import { getCanonicalPageId } from './get-canonical-page-id'
import { getPage as getNotionPage } from './notion'

const uuid = !!includeNotionIdInUrls

// Cache TTL: 1 hour in ms
const SITEMAP_CACHE_TTL = 60 * 60 * 1000
const SITEMAP_CACHE_KEY = `sitemap:${config.rootNotionPageId}`

export async function getSiteMap(): Promise<types.SiteMap> {
  // 1. Try Redis cache first
  try {
    const cached = await db.get(SITEMAP_CACHE_KEY)
    if (cached) {
      console.log('getSiteMap: returning cached siteMap from Redis')
      return cached as types.SiteMap
    }
  } catch (err) {
    console.warn('getSiteMap: Redis cache read error', err.message)
  }

  // 2. Build siteMap fresh
  console.log('getSiteMap: building fresh siteMap...')
  const partialSiteMap = await getAllPagesImpl(
    config.rootNotionPageId,
    config.rootNotionSpaceId
  )

  const siteMap = {
    site: config.site,
    ...partialSiteMap
  } as types.SiteMap

  // 3. Cache in Redis
  try {
    await db.set(SITEMAP_CACHE_KEY, siteMap, SITEMAP_CACHE_TTL)
    console.log('getSiteMap: siteMap cached in Redis (1h TTL)')
  } catch (err) {
    console.warn('getSiteMap: Redis cache write error', err.message)
  }

  return siteMap
}

async function getAllPagesImpl(
  rootNotionPageId: string,
  rootNotionSpaceId: string
): Promise<Partial<types.SiteMap>> {
  const getPage = async (pageId: string, ...args) => {
    console.log('\nnotion getPage', uuidToId(pageId))
    return getNotionPage(pageId, ...args)
  }

  const pageMap = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    getPage
  )

  const canonicalPageMap = Object.keys(pageMap).reduce(
    (map, pageId: string) => {
      const recordMap = pageMap[pageId]
      if (!recordMap) {
        // Skip pages that failed to load instead of throwing
        console.warn(`getSiteMap: skipping page "${pageId}" - failed to load`)
        return map
      }

      const canonicalPageId = getCanonicalPageId(pageId, recordMap, {
        uuid
      })

      if (map[canonicalPageId]) {
        // you can have multiple pages in different collections that have the same id
        console.warn('error duplicate canonical page id', {
          canonicalPageId,
          pageId,
          existingPageId: map[canonicalPageId]
        })

        return map
      } else {
        return {
          ...map,
          [canonicalPageId]: pageId
        }
      }
    },
    {}
  )

  return {
    pageMap,
    canonicalPageMap
  }
}
