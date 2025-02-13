import { parseRotaenoSong } from './src/parseRotaenoSong'
import { fetchRotaenoWikiPage } from './src/fetchRotaenoWikiPage'
import { parseSongList } from './src/parseSongList'
import { write } from 'bun'

// 기존 코드 뒤에 추가
const songListDom = await fetchRotaenoWikiPage('曲目列表')

// HTML 문서를 문자열로 변환하여 저장
// const htmlContent = songListDom.documentElement.innerHTML
// await write('downloaded.html', htmlContent)

console.log('HTML file has been saved as downloaded.html')

const songList = parseSongList(songListDom)
console.log(songList)
