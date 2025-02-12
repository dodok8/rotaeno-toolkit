import { Document } from 'happy-dom'

/**
 * Parse song lists from all matching tables in the document
 * @param document - DOM Document object
 * @returns Array of song titles from all tables
 */
export function parseSongList(document: Document): string[] {
  // Try first with exact class attribute match
  let tables = document.querySelectorAll('table[class="sortable rotable"]')

  // If no tables found, try with individual class selectors
  if (!tables.length) {
    tables = document.querySelectorAll('table.sortable.rotable')
  }

  // Return empty array if still no tables found
  if (!tables.length) {
    console.log('NO')
    return []
  }

  // Process all tables and flatten the results into a single array
  return Array.from(tables)
    .flatMap((table) =>
      Array.from(table.querySelectorAll('tbody tr td:nth-child(2)')).map(
        (cell) => {
          const link = cell.querySelector('a')
          return link
            ? link.textContent?.trim() || ''
            : cell.textContent?.trim() || ''
        }
      )
    )
    .filter((title) => title !== '')
}
