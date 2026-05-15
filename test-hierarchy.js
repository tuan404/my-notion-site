const { notion } = require('./lib/notion-api')

async function test() {
  const pageId = '4e321a37-1c02-46ac-86ee-1eaab3d2e093' // hong-ngoc-ha page ID (from the screenshot earlier)
  console.log('Fetching sub-page:', pageId)
  
  const recordMap = await notion.getPage(pageId)
  
  // Unwrap trick
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

  let currentId = Object.keys(recordMap.block)[0]
  console.log('Start ID:', currentId)
  
  let depth = 0
  while (currentId && depth < 10) {
    let parentId, parentTable
    
    // Check block
    if (recordMap.block[currentId]) {
      parentId = recordMap.block[currentId].value.parent_id
      parentTable = recordMap.block[currentId].value.parent_table
      console.log(`[Block] ${currentId} -> parent is a ${parentTable} with ID ${parentId}`)
    } else if (recordMap.collection && recordMap.collection[currentId]) {
      parentId = recordMap.collection[currentId].value.parent_id
      parentTable = recordMap.collection[currentId].value.parent_table
      console.log(`[Collection] ${currentId} -> parent is a ${parentTable} with ID ${parentId}`)
    } else {
      console.log(`Missing data for ${currentId} in recordMap. Cannot traverse higher.`)
      break
    }
    
    currentId = parentId
    depth++
  }
}

test().catch(console.error)
