<script lang="ts">
  import { dev } from '$app/environment';
  import HyperDebug from '$comps/HyperDebug.svelte';
  import SiteBackground from '$comps/site/SiteBackground.svelte';
  import SitePalette from '$comps/site/SitePalette.svelte';
  import SiteMenubar from '$comps/site/SiteMenubar.svelte';
  import { DEFAULT_SITE_MENUBAR_OPEN, DEFAULT_THEME } from '$lib/constants.js';
  import { globalCommands, globalPages } from '$lib/global/palette.js';
  import { setUserPreferences } from '$lib/global/preferences.svelte.js';
  import { Toaster } from 'svelte-french-toast';
  import '../app.pcss';

  let {children, data} = $props();

  const preferences = setUserPreferences({
    font:{
      family: data.userPrefs?.fontFamily
    },
    sitebar: {
      open: data.userPrefs?.sitebar ?? DEFAULT_SITE_MENUBAR_OPEN
    },
    theme: {
      value: data.userPrefs?.theme ?? DEFAULT_THEME
    }
  });
</script>

<SiteBackground />

<SitePalette commands={globalCommands} pages={globalPages} />
{#if dev}
  <HyperDebug/>
{/if}

<Toaster
  position="bottom-right"
  containerClassName="french-toast-container"
  toastOptions={{ className: 'french-toast-message' }}
/>

<div class="relative flex flex-col h-full overflow-x-hidden overflow-y-auto">  
  <header class="block sticky top-0 h-8 flex-none">
    <SiteMenubar />
  </header>

  <div class="h-[calc(100%-4rem)] [&:has(main.page-scroll)]:h-max">
    {@render children()}
  </div>
  
  <div class="h-8 flex-none">
  </div>
</div>

<style lang="postcss">
  :global(.french-toast-container div.french-toast-message ){
    @apply text-zinc-100 bg-primary-950 border border-base-500/25;
  }
  :global(.french-toast-container svg.lucide-circle-x ){
    @apply size-5 fill-red-700;
  }
  :global(.french-toast-container svg.lucide-circle-alert ){
    @apply size-5 fill-amber-700;
  }
  :global(.french-toast-container svg.lucide-circle-check ){
    @apply size-5 fill-green-700;
  }
  :global(.french-toast-container svg.lucide-info ){
    @apply size-5 fill-blue-700;
  }
</style>
