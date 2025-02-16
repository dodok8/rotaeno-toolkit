<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte'
  import { scores, best30Average } from '$lib/stores/score.svelte'
</script>

<h1>Average: {$best30Average}</h1>

{#each $scores as score (score.id)}
  <SongCard {score} />
{/each}
