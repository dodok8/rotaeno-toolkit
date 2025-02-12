import ky from "ky";
import { Window } from "happy-dom";

/**
 * Fetches Rotaeno Wiki page
 * @param {string} songName - The name of the song to fetch
 * @returns {Promise<Document>} The parsed document
 */
export async function fetchRotaenoSongPage(songName: string) {
  const baseUrl = "https://wiki.rotaeno.cn/";

  try {
    const response = await ky.get(`${baseUrl}${encodeURIComponent(songName)}`);
    const html = await response.text();

    // Use happy-dom to parse HTML
    const window = new Window();
    const document = window.document;
    document.write(html);

    return document;
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new Error(`Request timeout for song: ${songName}`);
    }
    if (error instanceof Error) {
      throw new Error(
        `Failed to fetch wiki page for ${songName}: ${error.message}`
      );
    } else {
      throw new Error(
        `Failed to fetch wiki page for ${songName}: ${String(error)}`
      );
    }
  }
}
