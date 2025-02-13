import { parseRotaenoSong } from './src/parseRotaenoSong'
import { fetchRotaenoWikiPage } from './src/fetchRotaenoWikiPage'
import { parseSongList } from './src/parseSongList'
import { write } from 'bun'
import * as semver from 'semver'
import type { Song } from '@rotaeno-toolkit/shared-types'

if (import.meta.main) {
  const songListDom = await fetchRotaenoWikiPage('曲目列表')

  const BATCH_SIZE = 20
  const songList = parseSongList(songListDom)
  console.log(`Total songs to process: ${songList.length}`)
  const chunkedSongList = Array.from(
    { length: Math.ceil(songList.length / BATCH_SIZE) },
    (_, i) => songList.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
  )

  const allSongs: Song[] = []
  for (let i = 0; i < chunkedSongList.length; i++) {
    console.log(`Processing batch ${i + 1}/${chunkedSongList.length}...`)

    const batchSongs = await Promise.all(
      chunkedSongList[i].map(async (song) => {
        const songPage = await fetchRotaenoWikiPage(song)
        return parseRotaenoSong(songPage)
      })
    )

    allSongs.push(...batchSongs)

    console.log(`Batch ${i + 1} completed`)
  }

  const sortedSongs = allSongs.sort((a, b) => {
    if (!a.releaseVersion || !b.releaseVersion) return 0
    return semver.compare(a.releaseVersion, b.releaseVersion) // 최신 버전이 앞으로 오도록 역순 정렬
  })

  await write('data/songs.json', JSON.stringify(sortedSongs, null, 2))
  console.log('All songs data has been saved to songs.json')
}
