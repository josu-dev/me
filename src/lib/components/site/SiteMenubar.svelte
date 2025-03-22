<script lang="ts">
  import { page } from '$app/stores';
  import IconArrowlefttoline from '$comps/icons/IconArrowlefttoline.svelte';
  import IconArrowrighttoline from '$comps/icons/IconArrowrighttoline.svelte';
  import IconCheck from '$comps/icons/IconCheck.svelte';
  import IconChevronright from '$comps/icons/IconChevronright.svelte';
  import IconMenu from '$comps/icons/IconMenu.svelte';
  import IconMoon from '$comps/icons/IconMoon.svelte';
  import IconSun from '$comps/icons/IconSun.svelte';
  import Logo from '$comps/site/Logo.svelte';
  import { helpers } from '$comps/site/SitePalette.svelte';
  import { GITHUB_REPOSITORY } from '$lib/constants.js';
  import { getUserPreferences } from '$lib/global/preferences.svelte.js';
  import { userViewTime } from '$lib/stores/user_view_time.js';
  import { Combobox, Dialog, Label, Menubar, Popover, Separator } from 'bits-ui';
  import { untrack } from 'svelte';
  import { fly, slide } from 'svelte/transition';

  const ANIMATION_DURATION = 250;

  const prefs = getUserPreferences();

  let animateOpenButton = $state(prefs.sitebar.open);
  let animateCloseButton = $state(!prefs.sitebar.open);

  $effect(() => {
    if ((prefs.sitebar.open && animateOpenButton) || (!prefs.sitebar.open && animateCloseButton)) {
      return;
    }

    if (prefs.sitebar.open) {
      animateCloseButton = false;
    } else {
      animateOpenButton = false;
    }

    let timeout = setTimeout(() => {
      if (prefs.sitebar.open) {
        animateOpenButton = true;
      } else {
        animateCloseButton = true;
      }
    }, ANIMATION_DURATION);

    return () => clearTimeout(timeout);
  });

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
  let pageStatusError = $derived($page.status >= 400 ? $page.status : undefined);

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

  let mobileOpen = $state(false);

  function closeMobileMenu() {
    mobileOpen = false;
  }
</script>

<div class="relative h-full text-base-200">
  {#if prefs.sitebar.open}
    <div
      in:fly={{ x: 1920, duration: 250 }}
      out:fly={{ x: 1920, duration: 250 }}
      class="h-full flex flex-row border-b border-base-500/25 bg-base-950 px-[3px] shadow-sm w-full"
    >
      <div class="grow w-1/5 h-full flex items-center justify-start">
        <div class="h-full p-1">
          <Logo class="size-6 border border-base-500/50 light:border-transparent" />
        </div>

        <Dialog.Root bind:open={mobileOpen}>
          <Dialog.Trigger title="Ver menus" class="h-full p-1 lg:hidden">
            <span class="sr-only">Ver menus</span>
            <IconMenu />
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay
              class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px]"
            />

            <!-- transition={slide}
            transitionConfig={{ duration: 250, axis: 'x' }} -->
            <Dialog.Content
              class="fixed top-0 left-0 z-50 flex flex-col py-6 pl-4 h-full w-full max-w-md bg-base-950 border-r border-base-500/25"
            >
              <Dialog.Close title="Ocultar menus" class="absolute right-2 top-2 text-base-100 size-8 p-1">
                <IconArrowlefttoline />
                <span class="sr-only">Ocultar menus</span>
              </Dialog.Close>

              <div class="h-10 flex flex-col text-nowrap">
                <h2 class="sr-only">Menus disponibles</h2>
                <div class="flex items-end h-full">
                  <Logo class="h-full border border-base-500/50 light:border-transparent" />
                  <span class="ml-4 text-2xl font-bold text-base-50">Menus</span>
                </div>
              </div>

              <div
                class="flex flex-col gap-4 h-[calc(100%-5rem)] mr-4 xs:mr-6 px-2 py-4 overflow-y-auto overflow-x-hidden text-nowrap"
              >
                <div>
                  <h3 class="text-lg font-semibold text-base-100">Vista</h3>
                  <div class="text-base-100">
                    <div class="menu-item-mobile">
                      {#if prefs.sitebar.open}
                        <div class="p-0.5">
                          <IconCheck />
                        </div>
                      {/if}
                      <button
                        onclick={() => {
                          closeMobileMenu();
                          prefs.setSitebarOpen(false);
                        }}
                        class="center text-left"
                      >
                        Barra de menus
                      </button>
                    </div>
                    <div class="menu-item-mobile">
                      <div class="col-start-2 flex w-max">
                        <Combobox.Root type="single" bind:value={selectedFont} required>
                          <Label.Root id="fonts-label" class="pl-2 pt-1 pb-0.5 text-base !leading-none">
                            Fuentes
                          </Label.Root>
                          <Combobox.Input
                            aria-labelledby="fonts-label"
                            spellcheck="false"
                            class="bg-base-950 ml-4 px-2 pt-0.5 pb-0 align-text-bottom text-sm inline-block rounded !leading-none [&_*]:leading-none border-0 text-base-200 ring-1 ring-base-200 focus:ring-base-100 focus:bg-primary-800/50 light:focus:bg-primary-200"
                          />
                          <Combobox.Content
                            side="bottom"
                            class="bg-base-950 border border-base-500/50 rounded shadow-sm fill-base-500"
                          >
                            {#each prefs.font.available as family (family)}
                              <Combobox.Item
                                value={family.value}
                                class="flex items-center justify-between py-1.5 px-2 text-base-100 text-sm cursor-pointer hover:bg-base-500/25"
                              >
                                {family.name}
                                {#if selectedFont === family.value}
                                  <div class="size-4">
                                    <IconCheck />
                                  </div>
                                {/if}
                              </Combobox.Item>
                            {/each}
                          </Combobox.Content>
                        </Combobox.Root>
                      </div>
                    </div>
                    <div class="menu-item-mobile">
                      <div class="p-0.5">
                        <div class="light:hidden">
                          <IconMoon />
                        </div>
                        <div class="dark:hidden">
                          <IconSun />
                        </div>
                      </div>
                      <button
                        class="center text-left"
                        onclick={(e) => {
                          e.preventDefault();
                          prefs.toggleTheme();
                        }}
                      >
                        {themeIsDark ? 'Tema oscuro' : 'Tema claro'}
                      </button>
                    </div>
                    <div class="menu-separator-mobile"></div>
                    <div class="menu-item-mobile">
                      <button
                        class="center text-left"
                        onclick={() => {
                          closeMobileMenu();
                          helpers.toggleOpen();
                        }}
                      >
                        Paleta de comandos
                      </button>
                    </div>
                    <div class="menu-item-mobile">
                      {#if prefs.fullscreen}
                        <div class="p-0.5">
                          <IconCheck />
                        </div>
                      {/if}
                      <button class="center text-left" onclick={toggleFullscreen}> Pantalla completa </button>
                    </div>
                    <div class="menu-item-mobile">
                      <button class="center text-left" onclick={reloadWindow}> Recargar pagina </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 class="text-lg font-semibold text-base-100">Paginas</h3>
                  <nav class="text-base-100">
                    <ul class="flex flex-col">
                      {#each localPages as page (page.url)}
                        {@const current = currentUrlPathname === page.url}
                        <li class="menu-item-mobile">
                          {#if current}
                            <div class="icon-left p-0.5">
                              <IconChevronright />
                            </div>
                          {/if}
                          <a
                            class="center aria-[current=page]:underline underline-offset-2"
                            href={page.url}
                            aria-current={current ? 'page' : undefined}
                            onclick={closeMobileMenu}
                          >
                            {page.name}
                          </a>
                        </li>
                      {/each}
                      <div class="menu-separator-mobile"></div>
                      {#each externalPages as page (page.url)}
                        <li class="menu-item-mobile">
                          <a class="center" href={page.url} target="_blank" rel="noopener noreferrer">
                            {page.name}
                          </a>
                        </li>
                      {/each}
                    </ul>
                  </nav>
                </div>
              </div>

              <div class="h-10 flex flex-col text-nowrap mr-4 xs:mr-6">
                <div class="flex items-center justify-between h-full text-base-400">
                  <span class="text-sm">© 2024 Josudev</span>

                  <Popover.Root>
                    <Popover.Trigger title="Tiempo en la pagina" class="px-1 text-sm hover:text-base-200">
                      {$userViewTime.human}
                    </Popover.Trigger>

                    <Popover.Content
                      class="menu-content min-w-64 max-w-max light:bg-base-950"
                      align="end"
                      sideOffset={4}
                      trapFocus={false}
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
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Menubar.Root class="hidden h-full ml-1 lg:flex lg:items-center">
          <Menubar.Menu>
            <Menubar.Trigger class="menu-trigger">Vista</Menubar.Trigger>
            <Menubar.Content class="menu-content  light:bg-base-950" align="start" sideOffset={1}>
              <Menubar.Item
                class="menu-item"
                onclick={() => {
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
                <Menubar.SubContent class="menu-content  light:bg-base-950" align="start" sideOffset={0}>
                  <Menubar.RadioGroup bind:value={selectedFont}>
                    {#each prefs.font.available as family (family)}
                      <Menubar.RadioItem value={family.value} class="menu-item">
                        {#snippet children({ checked })}
                          <div class="icon-left p-0.5">
                            {#if checked}
                              <IconCheck />
                            {/if}
                          </div>
                          <span class="label">{family.name}</span>
                        {/snippet}
                      </Menubar.RadioItem>
                    {/each}
                  </Menubar.RadioGroup>
                </Menubar.SubContent>
              </Menubar.Sub>
              <Menubar.CheckboxItem
                class="menu-item"
                checked={themeIsDark}
                onclick={(e) => {
                  e.preventDefault();
                  prefs.toggleTheme();
                }}
              >
                {#snippet children({ checked })}
                  <div class="icon-left p-0.5">
                    {#if checked}
                      <IconMoon />
                    {:else}
                      <IconSun />
                    {/if}
                  </div>
                  <span class="label">
                    {themeIsDark ? 'Tema oscuro' : 'Tema claro'}
                  </span>
                {/snippet}
              </Menubar.CheckboxItem>
              <Menubar.Separator class="menu-separator" />
              <Menubar.Item
                class="menu-item"
                onclick={() => {
                  helpers.toggleOpen();
                }}
              >
                <span class="label">Paleta de comandos</span>
              </Menubar.Item>
              <Menubar.Item class="menu-item" onclick={toggleFullscreen}>
                {#if prefs.fullscreen}
                  <div class="icon-left p-0.5">
                    <IconCheck />
                  </div>
                {/if}
                <span class="label">Pantalla completa</span>
              </Menubar.Item>
              <Menubar.Item class="menu-item" onclick={reloadWindow}>
                <span class="label">Recargar pagina</span>
              </Menubar.Item>
            </Menubar.Content>
          </Menubar.Menu>

          <Menubar.Menu>
            <Menubar.Trigger class="menu-trigger">Paginas</Menubar.Trigger>
            <Menubar.Content class="menu-content  light:bg-base-950" align="start" sideOffset={1}>
              {#each localPages as page (page.url)}
                {@const current = currentUrlPathname === page.url}
                <Menubar.Item>
                  {#snippet child({ props })}
                    <a
                      {...props}
                      href={page.url}
                      aria-current={current ? 'page' : undefined}
                      class="menu-item aria-[current=page]:underline underline-offset-2"
                    >
                      {#if current}
                        <div class="icon-left p-0.5">
                          <IconChevronright />
                        </div>
                      {/if}
                      <span class="label">{page.name}</span>
                    </a>
                  {/snippet}
                </Menubar.Item>
              {/each}
              <Menubar.Separator class="menu-separator" />
              {#each externalPages as page (page.url)}
                <Menubar.Item>
                  {#snippet child({ props })}
                    <a {...props} href={page.url} target="_blank" rel="noopener noreferrer" class="menu-item">
                      <span class="label">{page.name}</span>
                    </a>
                  {/snippet}
                </Menubar.Item>
              {/each}
            </Menubar.Content>
          </Menubar.Menu>
        </Menubar.Root>
      </div>

      <div class="max-w-fit min-w-0 w-3/5 h-full flex items-center justify-center mx-2">
        {#key currentUrlPathname}
          <div in:slide={{ axis: 'x', duration: 250 }} class="relative h-full flex items-center max-w-full">
            <span class="text-sm font-light overflow-hidden whitespace-pre">{currentUrlPathname}</span>
            {#if pageStatusError}
              <span
                class="absolute top-1.5 left-full translate-x-1.5 select-none text-xs leading-none rounded font-light px-1 py-0.5 bg-red-950 text-red-500 light:bg-red-200 light:text-red-600"
              >
                {pageStatusError}
              </span>
            {/if}
          </div>
        {/key}
      </div>

      <div class="min-w-0 grow w-1/5 h-full pr-8 flex items-center justify-end">
        <div class="hidden lg:block">
          <Popover.Root>
            <Popover.Trigger
              title="Tiempo en la pagina"
              class="px-1 lg:px-3 text-sm font-light text-base-300 leading-6 hover:text-base-200"
            >
              {$userViewTime.human}
            </Popover.Trigger>

            <Popover.Content
              trapFocus={false}
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
      onclick={toggleSitebar}
      title={prefs.sitebar.open ? 'Ocultar barra de menus' : 'Ver barra de menus'}
      class="text-base-200 h-full p-1"
    >
      {#if animateOpenButton}
        <div
          in:fly={{ x: -32, duration: ANIMATION_DURATION }}
          out:fly={{ x: 32, duration: ANIMATION_DURATION }}
          class="h-full"
        >
          <span class="sr-only">Ocultar barra de menus</span>
          <IconArrowrighttoline />
        </div>
      {:else if animateCloseButton}
        <div
          in:fly={{ x: 32, duration: ANIMATION_DURATION }}
          out:fly={{ x: -32, duration: ANIMATION_DURATION }}
          class="h-full"
        >
          <span class="sr-only">Ver barra de menus</span>
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
    @apply my-1 -mx-1 block h-px bg-base-500/50;
  }

  :global(.menu-item-mobile) {
    @apply grid grid-cols-[1.5rem,1fr,1.5rem] gap-0.5 items-center h-7 rounded p-0.5 select-none text-base leading-none font-light hover:bg-base-500/25;
  }
  :global(.menu-item-mobile > .center) {
    @apply col-start-2 px-2 pt-1 pb-0.5 outline-none w-max;
  }
  :global(.menu-item-mobile:has(.center:focus)) {
    @apply bg-primary-800/50;
  }
  :global([data-theme='light'] .menu-item-mobile:has(.center:focus)) {
    @apply bg-primary-200;
  }
  :global(.menu-separator-mobile) {
    @apply my-1 block h-px bg-base-500/50;
  }
</style>
