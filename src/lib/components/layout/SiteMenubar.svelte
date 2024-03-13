<script lang="ts">
  import { page } from '$app/stores';
  import IconArrowlefttoline from '$comps/icons/IconArrowefttoline.svelte';
  import IconArrowrighttoline from '$comps/icons/IconArrowrighttoline.svelte';
  import IconCheck from '$comps/icons/IconCheck.svelte';
  import IconChevronright from '$comps/icons/IconChevronright.svelte';
  import { GITHUB_REPOSITORY } from '$lib/constants.js';
  import { getUserPreferences } from '$lib/global/preferences.svelte.js';
  import { Menubar } from 'bits-ui';
  import { fly, slide } from 'svelte/transition';
  import { helpers } from '$comps/SitePalette.svelte';
  const prefs = getUserPreferences();

  function reloadWindow() {
    window.location.reload();
  }

  function toggleSitebar() {
    prefs.setSitebarOpen(!prefs.sitebar.open);
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

  let currentUrlPathname = $derived($page.url.pathname);
  let pageStatusError = $derived(
    $page.status >= 400 ? $page.status : undefined,
  );

  const localPages = [
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Proyectos publicos', url: '/repos' },
    { name: 'Sobre mi', url: '/about' },
  ];

  const externalPages = [
    { name: 'Repositorio', url: GITHUB_REPOSITORY },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/j-josu/' },
  ];
</script>

<div class="relative h-full text-zinc-200">
  {#if prefs.sitebar.open}
    <div
      in:fly={{ x: 1920, duration: 250 }}
      out:fly={{ x: 1920, duration: 250 }}
      class="h-full flex flex-row border-b border-zinc-500/25 bg-zinc-950/95 px-[3px] shadow-sm"
    >
      <Menubar.Root class="grow w-1/5 h-full flex items-center justify-start ">
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
            <Menubar.Item
              class="menu-item"
              on:click={() => {
                prefs.setSitebarOpen(false);
              }}
            >
              {#if prefs.sitebar.open}
                <div class="icon-left p-0.5">
                  <IconCheck />
                </div>
              {/if}
              <span class="label">Barra principal</span>
            </Menubar.Item>
            <Menubar.Sub>
              <Menubar.SubTrigger class="menu-item">
                <span class="label">Fuente</span>
                <div class="icon-right p-0.5">
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
                      <Menubar.RadioIndicator class="icon-left p-0.5">
                        <IconCheck />
                      </Menubar.RadioIndicator>
                      <span class="label">{family.name}</span>
                    </Menubar.RadioItem>
                  {/each}
                </Menubar.RadioGroup>
              </Menubar.SubContent>
            </Menubar.Sub>
            <Menubar.Separator class="menu-separator" />
            <Menubar.Item
              class="menu-item"
              on:click={() => {
                helpers.toggleOpen();
              }}
            >
              <span class="label">Paleta de comandos</span>
            </Menubar.Item>
            <Menubar.Item class="menu-item" on:click={toggleFullscreen}>
              {#if prefs.fullscreen}
                <div class="icon-left p-0.5">
                  <IconCheck />
                </div>
              {/if}
              <span class="label">Pantalla completa</span>
            </Menubar.Item>
            <Menubar.Item class="menu-item" on:click={reloadWindow}>
              <span class="label">Recargar pagina</span>
            </Menubar.Item>
          </Menubar.Content>
        </Menubar.Menu>

        <Menubar.Menu>
          <Menubar.Trigger class="menu-trigger">Paginas</Menubar.Trigger>
          <Menubar.Content class="menu-content" align="start" sideOffset={1}>
            {#each localPages as page (page.url)}
              {@const current = currentUrlPathname === page.url}
              <Menubar.Item
                class="menu-item aria-[current=page]:underline underline-offset-2"
                href={page.url}
                aria-current={current ? 'page' : undefined}
              >
                {#if current}
                  <div class="icon-left p-0.5">
                    <IconChevronright />
                  </div>
                {/if}
                <span class="label">{page.name}</span>
              </Menubar.Item>
            {/each}
            <Menubar.Separator class="menu-separator" />
            {#each externalPages as page (page.url)}
              <Menubar.Item
                class="menu-item"
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span class="label">{page.name}</span>
              </Menubar.Item>
            {/each}
          </Menubar.Content>
        </Menubar.Menu>
      </Menubar.Root>

      <div
        class="max-w-fit min-w-0 w-3/5 h-full flex items-center justify-center mx-2"
      >
        {#key currentUrlPathname}
          <div
            in:slide={{ axis: 'x', duration: 250 }}
            class="relative h-full flex items-center max-w-full"
          >
            <span class="text-sm font-light text-ellipsis overflow-hidden"
              >{currentUrlPathname}</span
            >
            {#if pageStatusError}
              <span
                class="absolute top-1.5 left-full translate-x-1.5 text-xs leading-none rounded font-extralight px-1 py-0.5 bg-red-950 text-red-500"
              >
                {pageStatusError}
              </span>
            {/if}
          </div>
        {/key}
      </div>

      <div
        class="min-w-0 grow w-1/5 h-full flex items-center justify-end"
      ></div>
    </div>
  {/if}

  <div class="absolute top-0 right-0 h-full">
    <button on:click={toggleSitebar} class="text-zinc-200 h-full p-1">
      {#if prefs.sitebar.open}
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
