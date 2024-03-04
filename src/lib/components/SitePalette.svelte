<script lang="ts" context="module">
  import { createCommandPalette } from 'svelte-hypercommands';

  const _state = createCommandPalette({ defaultOpen: false });

  export const states = _state.states;
  export const helpers = _state.helpers;
</script>

<script lang="ts">
  import {
    defineCommand,
    definePage,
    shortcutToKbd,
  } from 'svelte-hypercommands';
  import IconGlobe from './icons/IconGlobe.svelte';
  import IconHome from './icons/IconHome.svelte';

  type Props = {
    commands: ReturnType<typeof defineCommand>;
    pages: ReturnType<typeof definePage>;
  };

  let { commands, pages } = $props<Props>();

  const { portal, palette, panel, form, label, input, page, command } =
    _state.elements;
  const { open, paletteMode, matchingCommands, matchingPages } = states;

  $effect(() => {
    const unregisterCommands = helpers.registerCommand(commands);
    return unregisterCommands;
  });

  $effect(() => {
    const unregisterPages = helpers.registerPage(pages);
    return unregisterPages;
  });
</script>

<div use:portal>
  <div {...$palette} use:palette class="palette-container">
    {#if $open}
      <div {...$panel} use:panel class="palette-panel">
        <form {...$form} use:form class="palette-search">
          <!-- svelte-ignore a11y-label-has-associated-control - $label has the missing for attribute -->
          <label {...$label} use:label>Paleta de commandos</label>
          <input
            {...$input}
            use:input
            placeholder="Busca paginas... '>' para comandos..."
          />
        </form>
        <ul class="palette-results">
          {#if $paletteMode === 'PAGES'}
            {#each $matchingPages as p (p.id)}
              <li class="result" {...$page} use:page={p}>
                <div class="result-container">
                  <div class="result-page-icon">
                    {#if p.external}
                      <IconGlobe />
                    {:else}
                      <IconHome />
                    {/if}
                  </div>
                  <div class="result-label" title={p.url}>
                    <span class="result-label-name">{p.name}</span
                    >{#if p.name !== p.url}
                      <span class="result-page-url">{p.urlHostPathname}</span>
                    {/if}
                  </div>
                </div>
              </li>
            {/each}
            {#if $matchingPages.length === 0}
              <li class="result">
                <div class="result-name">No pages found</div>
              </li>
            {/if}
          {:else}
            {#each $matchingCommands as c (c.id)}
              <li class="result" {...$command} use:command={c}>
                <div class="result-container">
                  <div class="result-label" title={c.description}>
                    {#if c.category}
                      <span class="result-label-name"
                        >{c.category}: {c.name}</span
                      >
                    {:else}
                      <span class="result-label-name">{c.name}</span>
                    {/if}
                  </div>
                  <div class="keybindings">
                    {#each c.shortcut as s (s)}
                      <kbd class="keybinding">
                        {#each shortcutToKbd(s) as kbd (kbd)}
                          <kbd class="keybinding-key">{kbd}</kbd>
                          <span class="keybinding-key-separator">+</span>
                        {/each}
                      </kbd>
                    {/each}
                  </div>
                </div>
              </li>
            {/each}
            {#if $matchingCommands.length === 0}
              <li class="result">
                <div class="result-name">No commands found</div>
              </li>
            {/if}
          {/if}
        </ul>
      </div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .palette-container {
    @apply contents;
  }

  .palette-panel {
    @apply fixed top-[10vh] left-1/2 right-1/2 z-10 -translate-x-1/2
    flex flex-col w-[90vw] max-w-screen-sm max-h-[80vh] pointer-events-auto
    text-zinc-200 border-solid border border-zinc-500/25 rounded-md
    bg-zinc-900 overflow-y-hidden text-base shadow-lg shadow-zinc-950;
  }

  .palette-search {
    @apply flex py-2.5 px-2;
  }

  .palette-search input {
    @apply w-full py-1 px-2 rounded-sm border-none text-base font-sans bg-zinc-800 ring-1 ring-zinc-500/25 focus:ring-sky-600;
  }

  .palette-results {
    /* 0.5px preventes for triggering hover on siblings when pointer hover between them */
    @apply flex flex-col gap-[0.5px] pb-2.5 px-2 overflow-y-auto sm:max-h-[40vh] scrollbar-2.5 sb-transparent sb-thumb-zinc-600/25 sb-thumb-hover-zinc-600/50;
  }

  .result {
    @apply flex flex-col py-1 px-2.5 rounded-sm opacity-75 cursor-pointer;
  }

  .result:hover {
    @apply opacity-100 bg-zinc-700/25;
  }
  .result[data-selected] {
    @apply opacity-100 bg-sky-950;
  }

  .result-container {
    @apply flex max-w-full text-ellipsis text-nowrap overflow-hidden;
  }

  .result-page-icon {
    @apply flex items-center pr-1.5;
  }

  .result-page-icon :global(:is(svg, img)) {
    @apply square-5;
  }

  .result-label {
    @apply font-normal flex-1 text-base text-ellipsis overflow-hidden;
  }

  .result-label-name {
    @apply font-normal pr-1.5;
  }

  .result-page-url {
    @apply text-xs opacity-75;
  }

  .keybindings {
    @apply flex items-center leading-3;
  }

  .keybinding {
    @apply inline-flex items-center;
  }

  .keybindings kbd {
    @apply tracking-wide;
  }

  .keybinding-key {
    @apply inline-block border border-zinc-700 rounded bg-zinc-800;
    box-shadow: inset 0 -1px 0 hsl(206, 100%, 20%);
    vertical-align: middle;
    font-size: 11px;
    padding: 3px 5px;
    margin: 0 2px;
  }

  .result[data-selected] .keybinding-key {
    box-shadow: inset 0 -1px 0 rgb(0, 116, 204);
  }

  .keybinding-key-separator {
    @apply inline-block last:hidden font-extralight;
  }
</style>
