import { Document } from 'happy-dom'

/**
 * Parse Song info from Wiki DOM
 * @param document
 * @returns
 */
export function parseRotaenoSong(document: Document): {
  id: string
  artist: string
  releaseVersion: string
  title_localized: Record<string, string>
  source_localized?: {
    default: string
  }
  charts: {
    difficultyLevel: string
    difficultyDecimal: number
    chartDesigner: string
    jacketDesigner: any
  }[]
} {
  // Helper function to safely get text content
  const getText = (element) => {
    return element?.textContent?.trim() || ''
  }

  // Helper function to find next sibling with specific tag
  const findNextElementWithTag = (element, tag) => {
    let sibling = element.nextElementSibling
    while (sibling) {
      if (sibling.tagName.toLowerCase() === tag.toLowerCase()) {
        return sibling
      }
      sibling = sibling.nextElementSibling
    }
    return null
  }

  // Helper function to find cell by label in a table
  const findCell = (label, table) => {
    const cells = Array.from(table.getElementsByTagName('td'))
    const labelCell = cells.find((cell) => getText(cell) === label)
    return (labelCell as HTMLElement)?.nextElementSibling || null
  }

  // Find main table
  const allTables = Array.from(document.getElementsByTagName('table'))
  const mainTable = allTables.find((table) => table.className === 'rotable')

  if (!mainTable) {
    throw new Error('Could not find song information table')
  }

  // Extract ID from image URL
  const imageLink = mainTable.querySelector('td[rowspan="13"] a')
  const imageUrl = imageLink?.getAttribute('href') || ''
  const idMatch = imageUrl.match(/Songs_(.+?)\.png/)
  const id = idMatch ? idMatch[1].toLowerCase() : ''

  // Get title
  const titleRow = mainTable.getElementsByTagName('tr')[0]
  const defaultTitle = getText(titleRow?.getElementsByTagName('th')[0])

  // Parse localized titles from the second row
  const titleLocalizedRow = mainTable.getElementsByTagName('tr')[1]
  const titleLocalizedText = getText(
    titleLocalizedRow?.getElementsByTagName('th')[0]
  )
  const titleParts = titleLocalizedText.split(' | ')

  const title_localized: Record<string, string> = {
    default: defaultTitle,
  }

  // Remove the "英文:" prefix from each part
  const titles = titleParts.map((part) => part.replace(/^英文:/, '').trim())

  // If only one alternative title exists, it's English
  if (titles.length === 1) {
    title_localized['en'] = titles[0]
  }
  // If three alternative titles exist, follow zh-Hans, en, zh-Hant order
  else if (titles.length === 3) {
    title_localized['zh-Hans'] = titles[0]
    title_localized['en'] = titles[1]
    title_localized['zh-Hant'] = titles[2]
  }

  // Find difficulty constants section
  const h3Elements = Array.from(document.getElementsByTagName('h3'))
  const difficultySection = h3Elements.find((h3) =>
    getText(h3).includes('曲目定数')
  )

  // Get difficulty values
  const constTable = findNextElementWithTag(difficultySection, 'table')
  if (!constTable) {
    throw new Error('Could not find difficulty constants table')
  }

  const constValues = Array.from(constTable.getElementsByTagName('tr'))
    .filter((_, index) => index === 1) // Get second row
    .flatMap((row) =>
      Array.from((row as HTMLTableRowElement).getElementsByTagName('td'))
    )
    .map((td) => parseFloat(getText(td)))
    .filter((val) => !isNaN(val))

  if (constValues.length !== 4) {
    throw new Error(`Expected 4 difficulty values, found ${constValues.length}`)
  }

  // Get chart designer information
  const chartDesignerRow = Array.from(
    mainTable.getElementsByTagName('tr')
  ).find((row) =>
    Array.from(row.getElementsByTagName('td')).some(
      (td) => getText(td) === '谱师'
    )
  )

  let chartDesigners: Array<string> = []
  if (chartDesignerRow) {
    const cells = Array.from(chartDesignerRow.getElementsByTagName('td'))
    const designerCells = cells.slice(1) // Skip the label cell

    if (designerCells[0]?.getAttribute('colspan') === '4') {
      // Single designer for all difficulties

      chartDesigners = Array(4).fill(getText(designerCells[0]))
    } else {
      // Multiple designers
      chartDesigners = designerCells.map((cell) => getText(cell))
    }
  }

  // Get jacket designer
  const jacketDesignerCell = findCell('画师', mainTable)
  const jacketDesigner = getText(jacketDesignerCell)

  // Get other information
  const getFieldValue = (label) => getText(findCell(label, mainTable))

  // Construct the final object
  return {
    id,
    artist: getFieldValue('曲师'),
    releaseVersion: getFieldValue('更新版本').replace('v', ''),
    title_localized,
    source_localized: {
      default: getFieldValue('来源'),
    },
    charts: ['I', 'II', 'III', 'IV'].map((diff, index) => ({
      difficultyLevel: diff,
      difficultyDecimal: constValues[index],
      chartDesigner: chartDesigners[index] || '',
      jacketDesigner,
    })),
  }
}
