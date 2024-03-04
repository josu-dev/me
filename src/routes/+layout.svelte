<script lang="ts">
  import { dev } from '$app/environment';
  import HyperDebug from '$comps/HyperDebug.svelte';
  import SiteBackground from '$comps/SiteBackground.svelte';
  import SitePalette from '$comps/SitePalette.svelte';
  import { globalCommands } from '$lib/palette/global.js';
  import { Toaster } from 'svelte-french-toast';
  import { definePage } from 'svelte-hypercommands';
  import '../app.pcss';

  let {children} = $props();

  const globalPages = definePage([
    { url: '/'},
    { url: '/test1'},
    { url: '/test2'},
    { url: '/test3'},
    { url: '/test4'},
    { url: '/test5'},
    { url: '/test6'},
    { url: '/test7'},
    { url: '/test8'},
    { url: '/test9'},
    { url: '/test10'} 
  ]);
</script>

<SiteBackground />

<SitePalette commands={globalCommands} pages={globalPages} />
{#if dev}
  <HyperDebug/>
{/if}

<Toaster
  position="bottom-left"
  containerClassName="omc-toast-container"
  toastOptions={{ className: 'omc-toast' }}
/>

{@render children()}
