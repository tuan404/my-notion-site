const { notion } = require('./lib/notion-api')
const { rootNotionPageId } = require('./lib/config')

async function run() {
  const recordMap = await notion.getPage(rootNotionPageId)
  const rootBlock = recordMap.block[rootNotionPageId] || Object.values(recordMap.block).find(b => b.value.parent_id === rootNotionPageId || b.value.type === 'page')
  if (rootBlock) {
    console.log('Icon:', rootBlock.value.format?.page_icon)
  } else {
    console.log('Root block not found in its own page fetch?!')
  }
}
run().catch(console.error)
