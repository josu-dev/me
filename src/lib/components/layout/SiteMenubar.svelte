<script lang="ts">
  import IconArrowlefttoline from '$comps/icons/IconArrowefttoline.svelte';
  import IconArrowrighttoline from '$comps/icons/IconArrowrighttoline.svelte';
  import IconCheck from '$comps/icons/IconCheck.svelte';
  import IconChevronright from '$comps/icons/IconChevronright.svelte';
  import { getUserPreferences } from '$lib/global/preferences.svelte.js';
  import { Menubar } from 'bits-ui';
  import { fly } from 'svelte/transition';

  const prefs = getUserPreferences();

  function reloadWindow() {
    window.location.reload();
  }

  function toggleNavbar() {
    prefs.navbar.open = !prefs.navbar.open;
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => {
          prefs.fullscreen = false;
        })
        .catch(() => {
          prefs.fullscreen = true;
        });
      return;
    }
    document.documentElement
      .requestFullscreen()
      .then(() => {
        prefs.fullscreen = true;
      })
      .catch(() => {
        prefs.fullscreen = false;
      });
  }
</script>

<div class="this relative h-full text-zinc-200">
  {#if prefs.navbar.open}
    <div
      in:fly={{ x: 1920, duration: 250 }}
      out:fly={{ x: 1920, duration: 250 }}
      class="h-full"
    >
      <Menubar.Root
        class="pl-2 flex h-full items-center border-b border-zinc-500/25 bg-zinc-950/95 px-[3px] shadow-sm"
      >
        <Menubar.Menu>
          <Menubar.Trigger class="menu-trigger">General</Menubar.Trigger>
          <Menubar.Content class="menu-content" align="start" sideOffset={1}>
            <Menubar.Item class="menu-item">
              <span class="label">Nada</span>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger class="menu-trigger">Vista</Menubar.Trigger>
          <Menubar.Content class="menu-content" align="start" sideOffset={1}>
            <Menubar.Sub>
              <Menubar.SubTrigger class="menu-item">
                <span class="label">Fuente</span>
                <div class="icon-right">
                  <IconChevronright />
                </div>
              </Menubar.SubTrigger>
              <Menubar.SubContent
                class="menu-content"
                align="start"
                sideOffset={0}
              >
                <Menubar.RadioGroup bind:value={prefs.font.family}>
                  {#each prefs.font.available as family (family)}
                    <Menubar.RadioItem value={family.value} class="menu-item">
                      <span class="label">{family.name}</span>
                      <Menubar.RadioIndicator class="icon-right">
                        <IconCheck />
                      </Menubar.RadioIndicator>
                    </Menubar.RadioItem>
                  {/each}
                </Menubar.RadioGroup>
              </Menubar.SubContent>
            </Menubar.Sub>
            <Menubar.Separator class="menu-separator" />
            <Menubar.Item
              class="menu-item"
              on:click={() => {
                prefs.navbar.open = false;
              }}
            >
              <span class="label">Ocultar barra principal</span>
            </Menubar.Item>
            <Menubar.Item class="menu-item" on:click={toggleFullscreen}>
              <span class="label">
                {#if prefs.fullscreen}
                  Salir de pantalla completa
                {:else}
                  Pantalla completa
                {/if}
              </span>
            </Menubar.Item>
            <Menubar.Item class="menu-item" on:click={reloadWindow}>
              <span class="label">Recargar</span>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>
    </div>
  {/if}

  <div class="absolute top-0 right-0 h-full">
    <button on:click={toggleNavbar} class="text-zinc-200 h-full p-1">
      {#if prefs.navbar.open}
        <div
          in:fly={{ x: -32, duration: 250, delay: 250 }}
          out:fly={{ x: 32, duration: 250 }}
          class="h-full"
        >
          <IconArrowrighttoline />
        </div>
      {:else}
        <div
          in:fly={{ x: 32, duration: 250, delay: 250 }}
          out:fly={{ x: -32, duration: 250 }}
          class="h-full"
        >
          <IconArrowlefttoline />
        </div>
      {/if}
    </button>
  </div>
</div>

<style lang="postcss">
  :global(.menu-trigger) {
    @apply inline-flex items-center justify-center rounded px-3 cursor-pointer text-base font-light;
  }
  :global(.menu-trigger[data-state='open']) {
    @apply bg-zinc-500/25;
  }
  :global(.menu-trigger[data-highlighted]) {
    @apply bg-zinc-500/25;
  }

  :global(.menu-content) {
    @apply z-50 w-full max-w-[min(24rem,90vw)] rounded border border-zinc-500/50 bg-zinc-900 px-1 py-1.5 shadow-sm text-gray-100;
  }

  :global(.menu-item) {
    @apply grid grid-cols-[1.5rem,1fr,1.5rem] gap-1 items-center rounded px-2 py-px cursor-pointer select-none text-base font-light;
  }
  :global(.menu-item .icon-left) {
    @apply col-start-1;
  }
  :global(.menu-item .label) {
    @apply col-start-2;
  }
  :global(.menu-item .icon-right) {
    @apply col-start-3;
  }
  :global(.menu-item[data-highlighted]) {
    @apply bg-zinc-500/25;
  }

  :global(.menu-separator) {
    @apply my-1 -ml-1 -mr-1 block h-px bg-zinc-500/50;
  }
</style>
