import ky from 'ky'
import { Window } from 'happy-dom'

/**
 * Fetches Rotaeno Wiki page
 * @param {string} pageName - The name of the page to fetch
 * @returns {Promise<Document>} The parsed document
 */
export async function fetchRotaenoWikiPage(pageName: string) {
  const baseUrl = 'https://wiki.rotaeno.cn/'
  console.log(`${baseUrl}${encodeURIComponent(pageName)}`)
  try {
    const response = await ky.get(`${baseUrl}${encodeURIComponent(pageName)}`)
    const html = await response.text()

    // Use happy-dom to parse HTML
    const window = new Window()
    const document = window.document
    document.documentElement.innerHTML = html

    return document
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new Error(`Request timeout for song: ${pageName}`)
    }
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch wiki page for ${pageName}: ${error.message}`
      )
    } else {
      throw new Error(
        `Failed to fetch wiki page for ${pageName}: ${String(error)}`
      )
    }
  }
}
