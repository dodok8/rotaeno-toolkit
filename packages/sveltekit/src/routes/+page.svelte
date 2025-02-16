<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte'
  import { scores } from '$lib/shared-state/score.svelte'

</script>

<h1>Avg.: {scores.best30Average}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each scores.scores as score (score.id)}
  <SongCard {score} />
{/each}
