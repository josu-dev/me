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
  import { helpers } from '$comps/site/SitePalette.svelte';
  import { userViewTime } from '$lib/stores/user_view_time.js';
  import { Popover, Separator } from 'bits-ui';
  import IconSun from '$comps/icons/IconSun.svelte';
  import IconMoon from '$comps/icons/IconMoon.svelte';
  import Logo from '$comps/site/Logo.svelte';
  import { untrack } from 'svelte';

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
    { name: 'Cita diaria', url: '/daily_quote' },
    { name: 'Proyectos destacados', url: '/featured' },
    { name: 'Proyectos publicos', url: '/repositories' },
    { name: 'Sobre mi', url: '/about_me' },
  ];

  const externalPages = [
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/j-josu/' },
    { name: 'Repositorio', url: GITHUB_REPOSITORY },
  ];
  let themeIsDark = $derived(prefs.theme.value === 'dark');
  let selectedFont = $state(prefs.font.family);
  $effect(() => {
    if (untrack(() => prefs.font.family) === selectedFont) {
      return;
    }

    prefs.setFontFamily(selectedFont);
  });
</script>

<div class="relative h-full text-base-200">
  {#if prefs.sitebar.open}
    <div
      in:fly={{ x: 1920, duration: 250 }}
      out:fly={{ x: 1920, duration: 250 }}
      class="h-full flex flex-row border-b border-base-500/25 bg-base-950 px-[3px] shadow-sm"
    >
      <div class="grow w-1/5 h-full flex items-center justify-start">
        <button title="Abrir menus" class="h-full p-1 lg:hidden">
          <Logo class="size-6 border border-base-500/50" />
        </button>
        <div class="hidden h-full p-1 lg:block">
          <Logo class="size-6 border border-base-500/50" />
        </div>

        <Menubar.Root class="hidden h-full ml-1 lg:flex lg:items-center">
          <Menubar.Menu>
            <Menubar.Trigger class="menu-trigger">General</Menubar.Trigger>
            <Menubar.Content
              class="menu-content  light:bg-base-950"
              align="start"
              sideOffset={1}
            >
              <Menubar.Item class="menu-item">
                <span class="label">Nada</span>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger class="menu-trigger">Vista</Menubar.Trigger>
            <Menubar.Content
              class="menu-content  light:bg-base-950"
              align="start"
              sideOffset={1}
            >
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
                <span class="label">Barra de menus</span>
              </Menubar.Item>
              <Menubar.Sub>
                <Menubar.SubTrigger class="menu-item">
                  <span class="label">Fuente</span>
                  <div class="icon-right p-0.5">
                    <IconChevronright />
                  </div>
                </Menubar.SubTrigger>
                <Menubar.SubContent
                  class="menu-content  light:bg-base-950"
                  align="start"
                  sideOffset={0}
                >
                  <Menubar.RadioGroup bind:value={selectedFont}>
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
              <Menubar.CheckboxItem
                class="menu-item"
                checked={themeIsDark}
                on:click={(e) => {
                  e.preventDefault();
                  prefs.toggleTheme();
                }}
              >
                <div class="icon-left p-0.5">
                  {#if !themeIsDark}
                    <IconSun />
                  {/if}
                  <Menubar.CheckboxIndicator>
                    <IconMoon />
                  </Menubar.CheckboxIndicator>
                </div>
                <span class="label">
                  {themeIsDark ? 'Tema oscuro' : 'Tema claro'}
                </span>
              </Menubar.CheckboxItem>
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
            <Menubar.Content
              class="menu-content  light:bg-base-950"
              align="start"
              sideOffset={1}
            >
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
      </div>

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
                class="absolute top-1.5 left-full translate-x-1.5 select-none text-xs leading-none rounded font-extralight px-1 py-0.5 bg-red-950 text-red-500 light:bg-red-200 light:text-red-600"
              >
                {pageStatusError}
              </span>
            {/if}
          </div>
        {/key}
      </div>

      <div class="min-w-0 grow w-1/5 h-full pr-8 flex items-center justify-end">
        <div class="hidden sm:block">
          <Popover.Root disableFocusTrap open={false}>
            <Popover.Trigger
              title="Tiempo en la pagina"
              class="px-3 text-sm font-light text-base-400 leading-6 hover:text-base-300"
            >
              {$userViewTime.human}
            </Popover.Trigger>
            <Popover.Content
              class="menu-content min-w-64 max-w-max light:bg-base-950"
              align="end"
              sideOffset={1}
            >
              <div class="flex flex-col px-2">
                <div class="py-px">Primer visita</div>
                <div class="pl-2">
                  - {$userViewTime.firstVisit.getUTCDate()}/{$userViewTime.firstVisit.getUTCMonth()}/{$userViewTime.firstVisit.getUTCFullYear()}
                </div>
              </div>
              <Separator.Root class="menu-separator" />
              <div class="flex flex-col px-2">
                <div class="py-px">Tiempo en la pagina</div>
                <div class="pl-2">
                  - <span>{$userViewTime.days}</span>d
                  <span>{$userViewTime.hours}</span>h
                  <span>{$userViewTime.mins}</span>m
                  <span>{$userViewTime.secs}</span>s
                </div>
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
    </div>
  {/if}

  <div class="absolute top-0 right-0 h-full">
    <button
      on:click={toggleSitebar}
      title={prefs.sitebar.open
        ? 'Ocultar barra de menus'
        : 'Ver barra de menus'}
      class="text-base-200 h-full p-1"
    >
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
    @apply bg-base-500/25;
  }
  :global(.menu-trigger[data-highlighted]) {
    @apply bg-base-500/25;
  }

  :global(.menu-content) {
    @apply z-50 w-full max-w-[min(24rem,90vw)] rounded border border-base-500/50 bg-base-900 px-1 py-1.5 shadow-sm text-base-100;
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
    @apply bg-base-500/25;
  }
  :global([data-theme='light'] .menu-item[data-highlighted]) {
    @apply bg-base-500/10;
  }

  :global(.menu-separator) {
    @apply my-1 -ml-1 -mr-1 block h-px bg-base-500/50;
  }
</style>
