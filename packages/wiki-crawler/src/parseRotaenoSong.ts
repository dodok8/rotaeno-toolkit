import type { Song } from '@rotaeno-toolkit/shared-types'
import { Document } from 'happy-dom'

/**
 * Parse Song info from Wiki DOM
 * @param document
 * @returns
 */
export function parseRotaenoSong(document: Document): Song {
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
  const imageLink = mainTable.querySelector(
    'td[style="height:256px;width:256px"] a'
  )
  const imageOriginUrl = imageLink?.querySelector('img')?.getAttribute('src')
  const imageUrl = imageLink?.getAttribute('href') || ''
  const idMatch = imageUrl.match(/Songs_(.+?)\.png/)
  const id = idMatch ? idMatch[1] : ''

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
  if (titles.length === 1 && titles[0] !== '曲目信息') {
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

    let currentIndex = 0
    for (const cell of designerCells) {
      const colspan = parseInt(cell.getAttribute('colspan') || '1')
      const designer = getText(cell)

      // Fill the array with the same designer name for the colspan amount
      for (let i = 0; i < colspan; i++) {
        chartDesigners[currentIndex] = designer
        currentIndex++
      }
    }
  }

  // Get jacket designer
  const jacketDesignerCell = findCell('画师', mainTable)
  const jacketDesigner = getText(jacketDesignerCell)

  // Get other information
  const getFieldValue = (label) => {
    const cell = findCell(label, mainTable)
    // For cells that contain links, get the text from the link
    const link = cell?.querySelector('a')
    if (link) {
      return getText(link)
    }
    return getText(cell)
  }

  const constLabels =
    constValues.length == 4
      ? ['I', 'II', 'III', 'IV']
      : ['I', 'II', 'III', 'IV', 'IV-α']

  // Construct the final object
  return {
    id,
    imageUrl: imageOriginUrl as string,
    artist: getFieldValue('曲师'),
    releaseVersion: getFieldValue('更新版本').replace('v', ''),
    chapter: getFieldValue('曲包'),
    title_localized,
    source_localized: {
      default: getFieldValue('来源') || 'Original',
    },
    charts: constLabels.map((diff, index) => ({
      difficultyLevel: diff,
      difficultyDecimal: constValues[index],
      chartDesigner: chartDesigners[index] || '',
      jacketDesigner,
    })),
  }
}
