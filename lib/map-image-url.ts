import { Block } from 'notion-types'
import { defaultMapImageUrl } from 'react-notion-x'

import { defaultPageCover, defaultPageIcon } from './config'

export const mapImageUrl = (url: string, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  // Bypass Next.js image optimization for GIFs to preserve animation frames.
  // Next.js converts GIFs to WebP/AVIF which strips animation.
  if (url.toLowerCase().includes('.gif')) {
    // If already a Notion-proxied URL, return as-is
    if (url.startsWith('https://www.notion.so/image/')) {
      return url
    }
    // Otherwise wrap in Notion's image proxy (bypasses /_next/image)
    return `https://www.notion.so/image/${encodeURIComponent(url)}?table=block&id=${block.id}&cache=v2`
  }

  return defaultMapImageUrl(url, block)
}
