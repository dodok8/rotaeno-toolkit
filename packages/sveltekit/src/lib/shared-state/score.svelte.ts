import { getBest30, getBest30Average } from '$lib/scores'
import type { Score, Song } from '@rotaeno-toolkit/shared-types'
import songsData from '@rotaeno-toolkit/wiki-crawler/data/songs.json'

const STORAGE_KEY = 'rotaeno-scores'

// Song[] -> Score[] 변환
const initializeScores = (songs: Song[]): Score[] => {
  // Try to load from localStorage first
  const savedScores = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

  if (savedScores) {
    try {
      const parsed = JSON.parse(savedScores) as Score[]
      // Validate the stored data has the same songs as current data
      if (
        parsed.length === songs.length &&
        parsed.every((score) => songs.find((s) => s.id === score.id))
      ) {
        return parsed
      }
    } catch (e) {
      console.error('Failed to parse saved scores:', e)
    }
  }

  // Fall back to initial scores if localStorage is empty or invalid
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

class Scores {
  scores: Score[] = $state([])
  best30Songs = $derived(getBest30(this.scores))
  best30Average = $derived(getBest30Average(this.best30Songs))

  constructor() {
    this.scores = initializeScores(songs)
  }

  save() {
    if (typeof window !== 'undefined') {
      console.log('saved!')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scores))
    }
  }

  reset() {
    if (typeof window !== 'undefined') {
      console.log('reset!')
      localStorage.removeItem(STORAGE_KEY)
      this.scores = initializeScores(songs)
    }
  }
}

const scores = new Scores()

export { scores }
