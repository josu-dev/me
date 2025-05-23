<script lang="ts">
  import { dev } from '$app/environment';
  import HyperDebug from '$comps/HyperDebug.svelte';
  import SiteBackground from '$comps/site/SiteBackground.svelte';
  import SiteMenubar from '$comps/site/SiteMenubar.svelte';
  import SitePalette from '$comps/site/SitePalette.svelte';
  import { DEFAULT_SITE_MENUBAR_OPEN, DEFAULT_THEME } from '$lib/constants.js';
  import { globalCommands, globalPages } from '$lib/global/palette.js';
  import { setUserPreferences } from '$lib/global/preferences.svelte.js';
  import { Toaster } from 'svelte-french-toast';
  import '../app.css';

  let { children, data } = $props();

  const preferences = setUserPreferences({
    font: {
      family: data.userPrefs?.fontFamily,
    },
    sitebar: {
      open: data.userPrefs?.sitebar ?? DEFAULT_SITE_MENUBAR_OPEN,
    },
    theme: {
      value: data.userPrefs?.theme ?? DEFAULT_THEME,
    },
  });
</script>

<SiteBackground />

<SitePalette commands={globalCommands} pages={globalPages} />
{#if dev}
  <HyperDebug />
{/if}

<Toaster
  position="bottom-right"
  containerClassName="french-toast-container"
  toastOptions={{ className: 'french-toast-message' }}
/>

<div class="relative flex flex-col h-full overflow-x-hidden overflow-y-auto">
  <header class="block sticky top-0 z-10 h-8 flex-none">
    <SiteMenubar />
  </header>

  <div class="flex-1" style="--subtract-height: 4rem;">
    {@render children()}
  </div>

  <div class="h-8 flex-none"></div>
</div>
