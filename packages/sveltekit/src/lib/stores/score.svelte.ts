import { writable, derived } from 'svelte/store'
import type { Score, Song, ChartWithScore } from '@rotaeno-toolkit/shared-types'
import songsData from '@rotaeno-toolkit/wiki-crawler/data/songs.json'
import { getBest30, getBest30Average } from '$lib/scores'

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
const scoresStore = writable<Score[]>(initializeScores(songs))

// best30 정보를 derived store로 관리
const best30Store = derived<typeof scoresStore, ChartWithScore[]>(scoresStore, ($scores) =>
  getBest30($scores)
)

// best30Average를 derived store로 관리
const best30AverageStore = derived<typeof best30Store, number>(best30Store, ($best30) =>
  getBest30Average($best30)
)

export { scoresStore as scores, best30Store as best30, best30AverageStore as best30Average }
