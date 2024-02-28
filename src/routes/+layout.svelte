<script lang="ts">
  import { dev } from '$app/environment';
  import HyperDebug from '$comps/HyperDebug.svelte';
  import { Toaster } from 'svelte-french-toast';
  import { defineCommand, definePage } from 'svelte-hypercommands';
  import CommandPalette from 'svelte-hypercommands/CommandPalette.svelte';
  import '../app.pcss';
  
  let {children} = $props();

  const globalCommands = defineCommand([
    {
      name: 'Open Command Palette',
      shortcut: 'mod+shift+p',
      onAction: () => {
        const commandPalette = document.querySelector('command-palette');
        if (commandPalette) {
          commandPalette.dispatchEvent(new CustomEvent('open'));
        }
      },
    },
  ]);

  const globalPages = definePage([
    {
      name: 'Home',
      url: '/',
    },
  ]);
</script>

<CommandPalette commands={globalCommands} pages={globalPages} />
{#if dev}
  <HyperDebug/>
{/if}

<Toaster
  position="bottom-left"
  containerClassName="omc-toast-container"
  toastOptions={{ className: 'omc-toast' }}
/>

{@render children()}
