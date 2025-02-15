<script lang="ts">
  import type { Song } from '@rotaeno-toolkit/shared-types'

  let { song }: { song: Song } = $props()

  const calcRating = (score: number, difficultyDecimal: number) => {
    return difficultyDecimal + 0.5
  }

  // 각 차트별 계산된 점수를 저장할 상태 추가
  let calculatedScores: Record<string, number> = $state({})
  
  const handleInput = (
    event: Event,
    chart: { difficultyLevel: string; difficultyDecimal: number },
    songId: string
  ) => {
    const value = (event.target as HTMLInputElement).value
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      const rating = calcRating(numValue, chart.difficultyDecimal)
      calculatedScores[`${songId}_${chart.difficultyLevel}`] = rating
    }
  }
</script>

<div class="song-card">
  <div class="song-header">
    <img
      class="song-image"
      alt={`File: songs ${song.id}.png`}
      loading="lazy"
      src={`https://wiki.rotaeno.cn/${song.imageUrl}`}
    />
    <div class="song-title">
      <h2>
        {#each Object.entries(song.title_localized) as info, idx}
          {info[1]}
          {#if idx == Object.entries(song.title_localized).length - 1}{:else}{' / '}
          {/if}
        {/each}
      </h2>
      <span class="song-id">ID: {song.id}</span>
    </div>
  </div>

  <div class="charts-container">
    {#each song.charts as chart (chart.difficultyLevel)}
      <div class="chart-row">
        <div class="difficulty-badge">
          <span class="level">{chart.difficultyLevel}</span>
          <span class="decimal">{chart.difficultyDecimal}</span>
        </div>
        <div class="score-container">
          <span class="calculated-score">
            {#if calculatedScores[`${song.id}_${chart.difficultyLevel}`]}
              {calculatedScores[`${song.id}_${chart.difficultyLevel}`].toFixed(2)}
            {:else}
              0
            {/if}
          </span>
          <input
            class="score-input"
            id={`${song.id}_${chart.difficultyLevel}`}
            type="number"
            placeholder="Enter score"
            oninput={(e) => handleInput(e, chart, song.id)}
          />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* 카드 기본 스타일 */
  .song-card {
    container-type: inline-size;
    background: #fff;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    padding: clamp(1rem, 3vw, 2rem);
    margin: clamp(0.75rem, 2vw, 1rem);
    transition: all 0.2s ease;
  }

  .song-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  /* 헤더 영역 */
  .song-header {
    display: flex;
    gap: clamp(1rem, 2vw, 1.5rem);
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
  }

  .song-image {
    width: clamp(120px, 30vw, 180px);
    height: auto;
    aspect-ratio: 1;
    border-radius: clamp(0.375rem, 1vw, 0.5rem);
    object-fit: cover;
  }

  .song-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .song-title h2 {
    margin: 0;
    font-size: clamp(1.25rem, 2vw + 1rem, 1.5rem);
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.3;
  }

  .song-id {
    color: #666;
    font-size: clamp(0.75rem, 1vw + 0.5rem, 0.875rem);
    margin-top: clamp(0.375rem, 1vw, 0.5rem);
  }

  /* 차트 컨테이너 */
  .charts-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: clamp(0.75rem, 1.5vw, 1rem);
  }

  .chart-row {
    display: flex;
    align-items: center;
    gap: clamp(0.75rem, 1.5vw, 1rem);
    padding: clamp(0.625rem, 1.5vw, 0.75rem);
    background: #f8fafc;
    border-radius: clamp(0.375rem, 1vw, 0.5rem);
    transition: background-color 0.2s ease;
  }

  .chart-row:hover {
    background: #f1f5f9;
  }

  .difficulty-badge {
    display: flex;
    align-items: center;
    gap: clamp(0.375rem, 1vw, 0.5rem);
    min-width: clamp(80px, 15vw, 100px);
  }

  .level {
    font-weight: 600;
    color: #334155;
    font-size: clamp(0.875rem, 1vw + 0.75rem, 1rem);
  }

  .decimal {
    color: #ef4444;
    font-weight: 600;
    font-size: clamp(0.875rem, 1vw + 0.75rem, 1rem);
  }

  .score-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }

  .score-input {
    width: 100px;
    padding: 0.375rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.15s ease;
  }

  .calculated-score {
    color: #eab308;
    font-weight: 600;
    font-size: 0.875rem;
    min-width: 3.5rem;
  }

  /* 다크 모드에서의 계산된 점수 색상 */
  @media (prefers-color-scheme: dark) {
    .calculated-score {
      color: #fbbf24;
    }
  }

  .score-input {
    flex: 1;
    padding: clamp(0.375rem, 1vw, 0.5rem);
    border: 2px solid #e2e8f0;
    border-radius: clamp(0.25rem, 0.75vw, 0.375rem);
    font-size: clamp(0.875rem, 1vw + 0.75rem, 1rem);
    transition: all 0.15s ease;
    min-width: 0; /* Prevents input from overflowing */
  }

  .score-input:hover {
    border-color: #cbd5e1;
  }

  .score-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  /* 컨테이너 쿼리 */
  @container (max-width: 500px) {
    .song-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .song-title {
      align-items: center;
    }
  }

  /* 미디어 쿼리 */
  @media (max-width: 640px) {
    .charts-container {
      grid-template-columns: 1fr; /* 모바일에서는 단일 컬럼 */
    }

    .chart-row {
      flex-wrap: wrap;
    }

    .difficulty-badge {
      min-width: 60px;
    }
  }

  /* 다크 모드 지원 */
  @media (prefers-color-scheme: dark) {
    .song-card {
      background: #1e293b;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
    }

    .song-title h2 {
      color: #e2e8f0;
    }

    .song-id {
      color: #94a3b8;
    }

    .chart-row {
      background: #334155;
    }

    .chart-row:hover {
      background: #475569;
    }

    .level {
      color: #e2e8f0;
    }

    .score-input {
      background: #1e293b;
      border-color: #475569;
      color: #e2e8f0;
    }

    .score-input:hover {
      border-color: #64748b;
    }

    .score-input:focus {
      border-color: #60a5fa;
      box-shadow: 0 0 0 3px rgb(96 165 250 / 0.2);
    }
  }

  /* 접근성을 위한 스타일 */
  @media (prefers-reduced-motion: reduce) {
    .song-card,
    .score-input {
      transition: none;
    }

    .song-card:hover {
      transform: none;
    }
  }

  /* 인쇄를 위한 스타일 */
  @media print {
    .song-card {
      box-shadow: none;
      margin: 0;
      padding: 1rem;
      break-inside: avoid;
    }

    .score-input {
      border: 1px solid #000;
    }
  }
</style>
