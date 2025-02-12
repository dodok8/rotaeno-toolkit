import { parseRotaenoSong } from './src/parseRotaenoSong'
import { fetchRotaenoSongPage } from './src/fetchRotaenoSongPage'

// Example usage:
const doc = await fetchRotaenoSongPage('Vulcānus')
const songData = parseRotaenoSong(doc)
console.log(songData)
