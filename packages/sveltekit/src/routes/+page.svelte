<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte'
  import { getBest30, getBest30Average } from '$lib/scores'
  import { scores } from '$lib/shared-state/score.svelte'

  let best30scores = $derived(getBest30(scores)) 
  let best30Average = $derived(getBest30Average(best30scores))
</script>

<h1>Avg.: {best30Average}</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each scores as score (score.id)}
  <SongCard {score} />
{/each}
