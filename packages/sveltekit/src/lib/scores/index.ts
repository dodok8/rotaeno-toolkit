import type { ChartWithScore, Score } from '@rotaeno-toolkit/shared-types'

export function calculateSongRating(difficulty: number, achievementRate: number): number {
  let rating: number

  if (achievementRate < 500000) {
    rating = 0
  } else if (achievementRate < 900000) {
    rating = difficulty - (1000000 - achievementRate) / 100000
  } else if (achievementRate < 950000) {
    rating = difficulty - 1 + (achievementRate - 900000) / 50000
  } else if (achievementRate < 980000) {
    rating = difficulty + (achievementRate - 950000) / 30000
  } else if (achievementRate < 1000000) {
    rating = difficulty + 1 + (achievementRate - 980000) / 20000
  } else if (achievementRate < 1004000) {
    rating = difficulty + 2 + (achievementRate - 1000000) / 10000
  } else if (achievementRate < 1008000) {
    rating = difficulty + 2.4 + (achievementRate - 1004000) / 4000
  } else {
    rating = difficulty + 3.4 + (achievementRate - 1008000) / 10000
  }

  // If the player fails, ensure the rating doesn't exceed 6.0
  if (achievementRate < 900000) {
    rating = Math.min(6.0, rating)
  }

  // If the rating is negative, set it to 0
  rating = Math.max(0, rating)

  // Round to four decimal places
  return Math.round(rating * 10000) / 10000
}

export function getBest30(scores: Score[]): ChartWithScore[] {
  return scores
    .flatMap((song): ChartWithScore[] =>
      song.charts
        .filter((chart) => (chart.rating ?? 0) > 0)
        .map((chart) => ({
          songId: song.id,
          songTitle: song.title_localized.default,
          imageUrl: song.imageUrl,
          difficultyLevel: chart.difficultyLevel,
          difficultyDecimal: chart.difficultyDecimal,
          score: chart.score ?? 0,
          rating: chart.rating ?? 0,
        }))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 30)
}

export function getBest30Average(charts: ChartWithScore[]): number {
  return charts.length > 0
    ? charts.reduce((sum, chart) => sum + chart.rating, 0) / charts.length
    : 0
}
