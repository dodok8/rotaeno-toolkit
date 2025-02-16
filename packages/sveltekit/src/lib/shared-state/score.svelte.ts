import type { Score, Song } from '@rotaeno-toolkit/shared-types'
import songsData from '@rotaeno-toolkit/wiki-crawler/data/songs.json'

// Song[] -> Score[] 변환
const initializeScores = (songs: Song[]): Score[] => {
  return songs.map((song) => ({
    id: song.id,
    imageUrl: song.imageUrl,
    artist: song.artist,
    releaseVersion: song.releaseVersion,
    chapter: song.chapter,
    title_localized: song.title_localized,
    source_localized: song.source_localized,
    charts: song.charts.map((chart) => ({
      ...chart,
      score: 0,
      rating: 0,
    })),
  }))
}

const songs = songsData as Song[]
const scores = $state(initializeScores(songs))

export { scores }
