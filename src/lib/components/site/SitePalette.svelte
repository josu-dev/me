<script lang="ts" context="module">
  import {
    createPalette,
    defineActionable,
    defineNavigable,
    HYPER_ITEM,
  } from 'svelte-hypercommands';
  import { goto } from '$app/navigation';

  const _palette = createPalette({
    debounce: 250,
    defaults: {
      mode: 'pages',
      open: false,
      placeholder: `Busca paginas... '>' para comandos...`,
    },
    modes: {
      commands: {
        type: HYPER_ITEM.ACTIONABLE,
        prefix: '>',
        mapToSearch: (c) => c.category + c.name,
        closeOn: 'ALWAYS',
        openAction: 'RESET',
        shortcut: ['$mod+Shift+P'],
        sortMode: 'SORTED',
      },
      pages: {
        type: HYPER_ITEM.NAVIGABLE,
        prefix: '',
        mapToSearch: (p) => p.name + p.urlHostPathname,
        onNavigation: (p) => {
          if (p.external) {
            window.open(p.url, '_blank', 'noopener');
          } else {
            goto(p.url);
          }
        },
        closeOn: 'ALWAYS',
        openAction: 'UPDATE',
        shortcut: ['$mod+P'],
        sortBy: ['name', 'urlHostPathname'],
        sortMode: 'SORTED',
      },
    },
    closeOnClickOutside: true,
    closeOnEscape: true,
  });

  function registerCommand<T extends [any, ...any]>(
    ...items: ActionablesDefinition<T>
  ) {
    const commands = defineActionable(items);
    return _palette.helpers.registerItem('commands', commands);
  }

  function registerPage(...items: NavigablesDefinition) {
    const pages = defineNavigable(items);
    return _palette.helpers.registerItem('pages', pages);
  }

  export const helpers = {
    close: _palette.helpers.closePalette,
    open: _palette.helpers.openPalette,
    registerCommand: registerCommand,
    registerPage: registerPage,
    search: _palette.helpers.search,
    toggleOpen: _palette.helpers.togglePalette,
  };

  export const states = _palette.states;
</script>

<script lang="ts">
  import { shortcutToKbd } from 'svelte-hypercommands';
  import type {
    ActionablesDefinition,
    HyperActionable,
    HyperNavigable,
    NavigablesDefinition,
  } from 'svelte-hypercommands';
  import IconGlobe from '$comps/icons/IconGlobe.svelte';
  import IconHome from '$comps/icons/IconHome.svelte';
  import { touchsequence } from '$lib/actions.js';

  type Props = {
    commands: HyperActionable[];
    pages: HyperNavigable[];
  };

  let { commands, pages } = $props<Props>();

  const { palette, panel, form, label, input, item } = _palette.elements;
  const {
    open,
    mode,
    modes: {
      commands: { results: matchingCommands },
      pages: { results: matchingPages },
    },
  } = states;

  $effect(() => {
    const clenaup = _palette.helpers.registerItem('commands', commands);
    return clenaup;
  });

  $effect(() => {
    const cleanup = _palette.helpers.registerItem('pages', pages);
    return cleanup;
  });
</script>

<div
  {...$palette}
  use:palette
  use:touchsequence={{
    handler: (e) => {
      e.preventDefault();
      helpers.toggleOpen();
    },
    touches: 4,
    threshold: 350,
  }}
  class="palette-container"
>
  {#if $open}
    <div
      {...$panel}
      use:panel
      class="palette-panel bg-base-900 shadow-base-950 light:bg-base-950 light:shadow-black/25"
    >
      <form {...$form} use:form class="palette-search">
        <!-- svelte-ignore a11y-label-has-associated-control - $label has the missing for attribute -->
        <label {...$label} use:label>Paleta de commandos</label>
        <input {...$input} use:input class="bg-base-800 light:bg-base-900" />
      </form>
      <ul class="palette-results">
        {#if $mode === 'commands'}
          {#each $matchingCommands as c (c.id)}
            <li
              class="result data-[selected]:opacity-100 data-[selected]:bg-primary-950 light:data-[selected]:bg-primary-300"
              {...$item}
              use:item={c}
            >
              <div class="result-container">
                <div class="result-label" title={c.description}>
                  {#if c.category}
                    <span class="result-label-name">{c.category}: {c.name}</span
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
              <div class="result-name">Ningun comando encontrado</div>
            </li>
          {/if}
        {:else}
          {#each $matchingPages as p (p.id)}
            <li
              class="result data-[selected]:opacity-100 data-[selected]:bg-primary-950 light:data-[selected]:bg-primary-300"
              {...$item}
              use:item={p}
            >
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
              <div class="result-name">Ninguna pagina encontrada</div>
            </li>
          {/if}
        {/if}
      </ul>
    </div>
  {/if}
</div>

<style lang="postcss">
  .palette-container {
    /* @apply contents z-10; */
  }

  .palette-panel {
    @apply fixed top-[10vh] left-1/2 right-1/2 z-[100] -translate-x-1/2
    flex flex-col w-[90vw] max-w-screen-sm max-h-[80vh] pointer-events-auto
    text-base-200 border-solid border border-base-500/25 rounded-md
    overflow-y-hidden text-base shadow-lg;
  }

  .palette-search {
    @apply flex py-2.5 px-2;
  }

  .palette-search input {
    @apply w-full py-1 px-2 rounded-sm border-none text-base ring-1 ring-base-500/25 focus:ring-primary-600;
  }

  .palette-results {
    /* 0.5px preventes for triggering hover on siblings when pointer hover between them */
    @apply flex flex-col gap-[0.5px] pb-2.5 px-2 overflow-y-auto sm:max-h-[40vh] scrollbar-2.5 sb-transparent sb-thumb-base-600/25 sb-thumb-hover-base-600/50;
  }

  .result {
    @apply flex flex-col py-1 px-2.5 rounded-sm opacity-75 cursor-pointer;
  }

  .result:hover {
    @apply opacity-100 bg-base-700/25;
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
    @apply inline-block border border-base-700 rounded bg-base-800;
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
