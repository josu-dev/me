<script lang="ts">
  import { dev } from '$app/environment';
  import HyperDebug from '$comps/HyperDebug.svelte';
  import SiteBackground from '$comps/SiteBackground.svelte';
  import SitePalette from '$comps/SitePalette.svelte';
  import SiteMenubar from '$comps/layout/SiteMenubar.svelte';
  import { DEFAULT_SITE_MENUBAR_OPEN } from '$lib/constants.js';
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
