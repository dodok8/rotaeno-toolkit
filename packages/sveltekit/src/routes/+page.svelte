<script lang="ts">
  import songsData from '@rotaeno-toolkit/wiki-crawler/data/songs.json' assert { type: 'json' }
  import SongCard from '$lib/components/SongCard.svelte'
  import type { Song } from '@rotaeno-toolkit/shared-types'

  let songs: Song[] = songsData as Song[]
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#each songs as song (song.id)}
  <SongCard {song} />
{/each}
