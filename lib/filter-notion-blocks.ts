import { ExtendedRecordMap } from 'notion-types'
import { hiddenBlocks } from './hidden-blocks'

/**
 * Filters out hidden blocks from a Notion record map
 */
export function filterHiddenBlocks(recordMap: ExtendedRecordMap): ExtendedRecordMap {
  if (!recordMap?.block || !hiddenBlocks.length) {
    console.log('No blocks to filter or hiddenBlocks is empty');
    return recordMap
  }
  
  console.log('Hidden block IDs:', hiddenBlocks);
  console.log('Available block IDs:', Object.keys(recordMap.block).slice(0, 5));

  // Create a new record map with filtered blocks
  const filteredBlocks = { ...recordMap.block }
  
  // Remove any blocks that are in the hiddenBlocks array
  hiddenBlocks.forEach(blockId => {
    if (filteredBlocks[blockId]) {
      console.log(`Filtering block: ${blockId}`);
      delete filteredBlocks[blockId]
    } else {
      console.log(`Block ID not found: ${blockId}`);
    }
  })

  return {
    ...recordMap,
    block: filteredBlocks
  }
}