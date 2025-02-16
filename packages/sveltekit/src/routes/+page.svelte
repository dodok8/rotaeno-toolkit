<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte'
  import { scores } from '$lib/shared-state/score.svelte'

  let searchTerm = $state('')

  let filteredScores = $derived(
    scores.scores.filter((score) => {
      const term = searchTerm.toLowerCase()
      
      // ID 검색
      if (score.id.toLowerCase().includes(term)) return true
      
      // 모든 언어의 title 검색
      return Object.values(score.title_localized)
        .some(title => title.toLowerCase().includes(term))
    })
  )

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all scores?')) {
      scores.reset()
    }
  }
</script>

<div class="search-container">
  <div class="header">
    <input
      type="text"
      placeholder="Search songs..."
      bind:value={searchTerm}
      class="search-input"
    />
    <button class="reset-button" onclick={handleReset}>
      Reset All Scores
    </button>
  </div>
  <h1>Avg.: {scores.best30Average}</h1>
</div>

{#each filteredScores as score (score.id)}
  <SongCard {score} />
{/each}

<style>
  .search-container {
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .header {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .search-input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #e2e8f0;
    border-radius: 0.375rem;
    width: 100%;
    max-width: 400px;
    transition: border-color 0.15s ease;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .reset-button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
    color: #fff;
    background-color: #ef4444;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }

  .reset-button:hover {
    background-color: #dc2626;
  }

  .reset-button:focus {
    outline: none;
    box-shadow: 0 0 0 2px #fecaca;
  }
</style>