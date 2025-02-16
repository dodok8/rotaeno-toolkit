<script lang="ts">
  import SongCard from '$lib/components/SongCard.svelte'
  import { scores } from '$lib/shared-state/score.svelte'
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each scores as score (score.id)}
  <SongCard {score} />
{/each}
