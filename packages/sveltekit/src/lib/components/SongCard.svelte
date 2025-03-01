<script lang="ts">
  import type { Score } from '@rotaeno-toolkit/shared-types'
  import { calculateSongRating } from '$lib/scores'
  import { scores } from '$lib/shared-state/score.svelte';

  let { score = $bindable() }: { score: Score } = $props()

  // 입력값이 변경될 때마다 rating 자동 계산
  $effect(() => {
    score.charts.forEach((chart, idx) => {
      if (chart.score) {
        chart.rating = calculateSongRating(chart.difficultyDecimal, chart.score)
        scores.save()
      }
    })
  })
</script>

<div class="score-card">
  <div class="score-header">
    <img
      class="score-image"
      alt={`File: songs ${score.id}.png`}
      loading="lazy"
      src={`https://wiki.rotaeno.cn/${score.imageUrl}`}
    />
    <div class="score-title">
      <h2>
        {#each Object.entries(score.title_localized) as info, idx}
          {info[1]}
          {#if idx == Object.entries(score.title_localized).length - 1}{:else}{' / '}
          {/if}
        {/each}
      </h2>
      <span class="score-id">ID: {score.id}</span>
    </div>
  </div>

  <div class="charts-container">
    {#each score.charts as chart, idx (chart.difficultyLevel)}
      <div class="chart-row">
        <div class="difficulty-badge">
          <span class="level">{chart.difficultyLevel}</span>
          <span class="decimal">{chart.difficultyDecimal}</span>
        </div>
        <div class="score-container">
          <span class="calculated-score">
            {chart.rating ?? 0}
          </span>
          <input
            class="score-input"
            id={`${score.id}_${chart.difficultyLevel}`}
            type="number"
            bind:value={chart.score}
          />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  /* 카드 기본 스타일 */
  .score-card {
    container-type: inline-size;
    background: #fff;
    border-radius: clamp(0.75rem, 2vw, 1rem);
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    padding: clamp(1rem, 3vw, 2rem);
    margin: clamp(0.75rem, 2vw, 1rem);
    transition: all 0.2s ease;
  }

  .score-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  /* 헤더 영역 */
  .score-header {
    display: flex;
    gap: clamp(1rem, 2vw, 1.5rem);
    margin-bottom: clamp(1rem, 2vw, 1.5rem);
  }

  .score-image {
    width: clamp(120px, 30vw, 180px);
    height: auto;
    aspect-ratio: 1;
    border-radius: clamp(0.375rem, 1vw, 0.5rem);
    object-fit: cover;
  }

  .score-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .score-title h2 {
    margin: 0;
    font-size: clamp(1.25rem, 2vw + 1rem, 1.5rem);
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.3;
  }

  .score-id {
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
    .score-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .score-title {
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
    .score-card {
      background: #1e293b;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.2);
    }

    .score-title h2 {
      color: #e2e8f0;
    }

    .score-id {
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
    .score-card,
    .score-input {
      transition: none;
    }

    .score-card:hover {
      transform: none;
    }
  }

  /* 인쇄를 위한 스타일 */
  @media print {
    .score-card {
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
