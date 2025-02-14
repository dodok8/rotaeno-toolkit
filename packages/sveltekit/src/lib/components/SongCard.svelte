<script lang="ts">
  import type { Song } from '@rotaeno-toolkit/shared-types'

  let { song }: { song: Song } = $props()

  const handleInput = (
    event: Event,
    chart: { difficultyLevel: string; difficultyDecimal: number },
    songId: string
  ) => {
    const value = (event.target as HTMLInputElement).value
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      console.log(
        `${songId}, Chart ${chart.difficultyLevel}: ${numValue + 10} decimal ${chart.difficultyDecimal}`
      )
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
        <input
          class="score-input"
          id={`${song.id}_${chart.difficultyLevel}`}
          type="number"
          placeholder="Enter score"
          oninput={(e) => handleInput(e, chart, song.id)}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .song-card {
    background: #fff;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    padding: 1.5rem;
    margin: 1rem;
    transition: all 0.2s ease;
  }

  .song-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  }

  .song-header {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .song-image {
    width: 120px;
    height: 120px;
    border-radius: 0.5rem;
    object-fit: cover;
  }

  .song-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .song-title h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  .song-id {
    color: #666;
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }

  .charts-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .chart-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 0.5rem;
  }

  .difficulty-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 100px;
  }

  .level {
    font-weight: 600;
    color: #334155;
  }

  .decimal {
    color: #ef4444;
    font-weight: 600;
  }

  .score-input {
    flex: 1;
    padding: 0.5rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.15s ease;
  }

  .score-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  @media (max-width: 640px) {
    .song-header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .song-image {
      width: 180px;
      height: 180px;
    }
  }
</style>
