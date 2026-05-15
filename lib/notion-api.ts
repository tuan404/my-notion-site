import { NotionAPI } from 'notion-client'

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

const originalFetch = notion.fetch.bind(notion)

// Retry with exponential backoff on 429 Too Many Requests
notion.fetch = async function (args: any) {
  const maxRetries = 5
  let delay = 1000 // start with 1 second

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await originalFetch(args)

      // Unwrap double-nested value.value from Notion API v6.16+
      if (result && result.recordMap) {
        unwrapRecordMap(result.recordMap)
      }

      return result
    } catch (err: any) {
      const is429 =
        err?.response?.statusCode === 429 ||
        err?.code === 'ERR_NON_2XX_3XX_RESPONSE' ||
        err?.message?.includes('429') ||
        err?.message?.includes('Too Many Requests')

      if (is429 && attempt < maxRetries) {
        const waitMs = delay + Math.random() * 500
        console.warn(
          `Notion API rate limited (429). Retrying in ${Math.round(waitMs)}ms... (attempt ${attempt + 1}/${maxRetries})`
        )
        await sleep(waitMs)
        delay *= 2 // exponential backoff
        continue
      }

      throw err
    }
  }
}

function unwrapRecordMap(recordMap: any) {
  if (!recordMap) return
  const keys = ['block', 'collection', 'collection_view', 'notion_user', 'space']
  for (const key of keys) {
    if (!recordMap[key]) continue
    for (const id in recordMap[key]) {
      const item = recordMap[key][id]
      if (item && item.value && item.value.value) {
        item.value = item.value.value
      }
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
