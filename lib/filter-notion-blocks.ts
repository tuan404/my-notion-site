import { ExtendedRecordMap } from 'notion-types'
import { hiddenBlocks } from './hidden-blocks'

/**
 * Filters out hidden blocks from a Notion record map
 */
export function filterHiddenBlocks(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  if (!recordMap?.block || !hiddenBlocks.length) {
    return recordMap
  }

  // Create a new record map with filtered blocks
  const filteredBlocks = { ...recordMap.block }
  
  // Remove any blocks that are in the hiddenBlocks array
  hiddenBlocks.forEach(blockId => {
    if (filteredBlocks[blockId]) {
      delete filteredBlocks[blockId]
    }
  })

  return {
    ...recordMap,
    block: filteredBlocks
  }
}