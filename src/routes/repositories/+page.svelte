<script lang="ts">
  import { enhance } from '$app/forms';
  import { debug } from '$comps/HyperDebug.svelte';
  import IconCheck from '$comps/icons/IconCheck.svelte';
  import IconCircledot from '$comps/icons/IconCircledot.svelte';
  import IconFile from '$comps/icons/IconFile.svelte';
  import IconGitfork from '$comps/icons/IconGitfork.svelte';
  import IconMinus from '$comps/icons/IconMinus.svelte';
  import IconPlus from '$comps/icons/IconPlus.svelte';
  import IconStar from '$comps/icons/IconStar.svelte';
  import Seo from '$comps/site/SEO.svelte';
  import { Collapsible, Combobox } from 'bits-ui';
  import { slide } from 'svelte/transition';
  import type { SubmitFunction } from './$types.js';
  import ReposSidebar from './ReposSidebar.svelte';
  import './code_as_rawfile.css';

  let { data } = $props();
  let repoItems = $derived.by(() => {
    const repos = [];
    for (const repo of data.repos ?? []) {
      repos.push({
        id: repo.id,
        title: repo.name,
        description: repo.description,
        updatedAt: new Date(repo.updatedAt ?? repo.createdAt ?? 0).getTime(),
      });
    }
    repos.sort((a, b) => b.updatedAt - a.updatedAt);
    return repos;
  });

  let selectedId = $state('');
  let selectedRepo = $derived((data.repos ?? []).find((repo) => repo.id === selectedId));
  let repoInfoOpen = $state(true);
  let showRepositoryPage = $derived.by(() => {
    if (!selectedRepo || !selectedRepo.homepage) {
      return false;
    }
    for (let hosts of ['github.com', 'pypi.org', 'npmjs.com']) {
      if (selectedRepo.homepage.includes(hosts)) {
        return false;
      }
    }
    return true;
  });

  let repoReadmeHtml = $state('');
  let selectedRepoError = $state('');
  let highlightReadmeForm: HTMLFormElement | undefined;

  const enhanceHighlightReadme: SubmitFunction = (form) => {
    return ({ result }) => {
      if (result.type !== 'success') {
        console.error(result);
        selectedRepoError = `No se pudo obtener el README del repositorio ${selectedRepo?.name}`;
        return;
      }

      repoReadmeHtml = result.data?.html ?? '';
    };
  };

  $effect(() => {
    debug.setData({ selectedId: selectedId, selectedRepo: selectedRepo });
  });

  $effect(() => {
    if (!showRepositoryPage) {
      return;
    }

    // selectedRepo is guarded by showRepositoryPage
    fetch(selectedRepo!.homepage!)
      .then((response) => {
        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
      })
      .catch((e) => {
        console['error']('error catched', e);
      });
  });

  $effect(() => {
    if (!selectedRepo || showRepositoryPage) {
      return;
    }
    if (!highlightReadmeForm) {
      return;
    }

    highlightReadmeForm.requestSubmit();
  });
</script>

<Seo
  title="Public projects"
  description="Public projects of Josu on Github. All the repositories are open source and free to use."
/>

<main class="flex flex-col px-2 xs:px-4 h-full lg:h-screen-sub lg:overflow-hidden">
  <div class="flex flex-col w-full max-w-screen-md mx-auto lg:mx-0 lg:h-full lg:max-w-full">
    <header class="text-base-50">
      <h1 class="text-2xl font-bold mt-4">Proyectos publicos</h1>
    </header>

    <section class="flex flex-col gap-4 max-w-full overflow-hidden lg:hidden">
      <Combobox.Root
        onSelectedChange={(item) => {
          // @ts-expect-error
          selectedId = item?.value ?? '';
        }}
      >
        <div class=" mt-4 flex flex-wrap items-center gap-y-2 gap-x-4">
          <Combobox.Label class="w-max text-lg font-semibold text-base-100">Repositorio</Combobox.Label>
          <Combobox.Input
            class="min-w-max w-full max-w-sm px-2 pt-1.5 pb-1 rounded border border-base-500/25 bg-base-950/75 text-base text-base-200 focus:outline-none focus:ring-0 focus:border-base-50"
          />
        </div>

        <Combobox.Content
          class="bg-base-950 border border-base-500/50 rounded shadow-sm fill-base-500"
          inTransition={slide}
          sideOffset={1}
        >
          {#each repoItems as repo (repo.id)}
            <Combobox.Item
              class="flex items-center justify-between py-1.5 px-2 text-base-100 text-sm cursor-pointer hover:bg-base-500/25 data-[selected]:bg-base-500/25"
              value={repo.id}
              label={repo.title}
            >
              {repo.title}
              <Combobox.ItemIndicator class="ml-auto size-4">
                <IconCheck />
              </Combobox.ItemIndicator>
            </Combobox.Item>
          {:else}
            <span class="block px-5 py-2 text-sm text-muted-foreground"> No results found </span>
          {/each}
        </Combobox.Content>
        <Combobox.HiddenInput name="favoriteFruit" />
      </Combobox.Root>

      {#if !selectedRepo}
        <div class="mt-4">
          <p class="text-base-300 text-balance text-base">
            Ningun repositorio seleccionado
            <span class="animate-bounce inline-block">😉</span>
          </p>
        </div>
      {:else}
        <div class="rounded-md p-4 border border-base-500/25 bg-base-950/75 shadow light:bg-base-950">
          <div class="flex items-center gap-4 text-base-200">
            <h3 class="text-lg font-semibold">{selectedRepo.name}</h3>
            {#if selectedRepo.language}
              <span
                class="ml-auto badge-lg text-base font-semibold bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-200"
                >{selectedRepo.language}</span
              >
            {/if}
          </div>
          <div class="pt-2 space-y-4">
            {#if selectedRepo.topics.length}
              <div class="flex flex-wrap gap-1">
                {#each selectedRepo.topics as tag (tag)}
                  <span class="badge bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-300"
                    >{tag}</span
                  >
                {/each}
              </div>
            {/if}
            <div class="space-y-2 text-base">
              <p class="text-base-300">{selectedRepo.description}</p>
              <div class="flex flex-col gap-2">
                <h4 class="sr-only">Estadisticas</h4>
                <div class="flex gap-4">
                  <div title="Forks" class="flex items-center gap-1 text-neutral-400">
                    <IconGitfork />
                    <span class="whitespace-pre text-base-300">{selectedRepo.forks}</span>
                  </div>
                  <div title="Stars" class="flex items-center gap-1 text-yellow-500">
                    <IconStar />
                    <span class="whitespace-pre text-base-300">{selectedRepo.stars}</span>
                  </div>
                  <div title="Issues" class="flex items-center gap-1 text-violet-500">
                    <IconCircledot />
                    <span class="whitespace-pre text-base-300">{selectedRepo.issues}</span>
                  </div>
                  <div title="Tamaño en kilobytes" class="flex items-center gap-1 text-neutral-400">
                    <IconFile />
                    <span class="whitespace-pre text-base-300">{selectedRepo.size} kb</span>
                  </div>
                </div>
                <div class="flex flex-wrap gap-x-8">
                  <div class="text-base-300">
                    Creado: {new Date(selectedRepo.createdAt ?? '').toLocaleString()}
                  </div>
                  <div class="text-base-300">
                    Actualizado: {new Date(selectedRepo.updatedAt ?? '').toLocaleString()}
                  </div>
                </div>
              </div>
              <nav>
                <h4 class="sr-only">Links</h4>
                <ul class="flex gap-4">
                  <li>
                    <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer" class="text-primary-500 a"
                      >Github</a
                    >
                  </li>
                  {#if selectedRepo.homepage}<li>
                      <a
                        href={selectedRepo.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-500 a">Pagina</a
                      >
                    </li>{/if}
                  {#if selectedRepo.license}<li>
                      <a
                        href={selectedRepo.license.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-500 a">Licencia</a
                      >
                    </li>{/if}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div class="min-h-[75vh] flex-1 rounded-md overflow-y-auto overflow-x-hidden border border-base-500/25">
          {#if selectedRepoError}
            <div class="grid place-items-center h-full">
              <p class="text-red-500 text-balance">{selectedRepoError}</p>
            </div>
          {/if}
          {#if showRepositoryPage}
            <iframe
              title={selectedRepo.name}
              src={selectedRepo.homepage ?? selectedRepo.url}
              frameborder="0"
              class="w-full h-full"
            />
          {:else}
            <code title="{selectedRepo.name} README.md" class="rawfile text-sm">{@html repoReadmeHtml}</code>
          {/if}
        </div>
      {/if}
    </section>

    <div
      class="hidden flex-1 overflow-hidden mt-4 lg:grid lg:grid-cols-[1fr,24rem] lg:gap-8 lg:mt-6 2xl:grid-cols-[1fr,28rem]"
    >
      <section class="flex flex-col h-full overflow-hidden">
        {#if !selectedRepo}
          <div class="grid place-items-center h-full">
            <p class="text-base-300 text-xl text-center text-balance">
              Prueba seleccionando un repositorio
              <span class="animate-bounce inline-block">😉</span>
            </p>
          </div>
        {:else}
          <div class="flex-1 rounded-md overflow-y-auto overflow-x-hidden border border-base-500/25">
            {#if selectedRepoError}
              <div class="grid place-items-center h-full">
                <p class="text-red-500 text-balance">{selectedRepoError}</p>
              </div>
            {/if}
            {#if showRepositoryPage}
              <iframe
                title={selectedRepo.name}
                src={selectedRepo.homepage ?? selectedRepo.url}
                frameborder="0"
                class="w-full h-full"
              />
            {:else}
              <code title="{selectedRepo.name} README.md" class="rawfile">{@html repoReadmeHtml}</code>
            {/if}
          </div>
          <div class="h-max mt-4">
            <Collapsible.Root
              bind:open={repoInfoOpen}
              class="rounded-md p-4 border border-base-500/25 bg-base-950/75 shadow light:bg-base-950"
            >
              <div class="flex items-center gap-4 text-base-200">
                <h3 class="text-xl font-semibold">{selectedRepo.name}</h3>
                <Collapsible.Trigger
                  title={repoInfoOpen ? 'Ocultar informacion del repositorio' : 'Mostrar informacion del repositorio'}
                >
                  {#if repoInfoOpen}
                    <div><IconMinus /></div>
                  {:else}
                    <div><IconPlus /></div>
                  {/if}
                  <span class="sr-only">
                    {#if repoInfoOpen}
                      Ocultar informacion del repositorio
                    {:else}
                      Mostrar informacion del repositorio
                    {/if}
                  </span>
                </Collapsible.Trigger>
                {#if selectedRepo.language}
                  <span
                    class="ml-auto badge-lg text-lg font-semibold bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-200"
                    >{selectedRepo.language}</span
                  >
                {/if}
              </div>
              <Collapsible.Content class="pt-2 space-y-4" transition={slide}>
                {#if selectedRepo.topics.length}
                  <div class="flex flex-wrap gap-1">
                    {#each selectedRepo.topics as tag (tag)}
                      <span class="badge bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-300"
                        >{tag}</span
                      >
                    {/each}
                  </div>
                {/if}
                <div class="space-y-2 text-base">
                  <p class="text-base-300">{selectedRepo.description}</p>
                  <div class="flex flex-col gap-2">
                    <h4 class="sr-only">Estadisticas</h4>
                    <div class="flex gap-4">
                      <div title="Forks" class="flex items-center gap-1 text-neutral-400">
                        <IconGitfork />
                        <span class="whitespace-pre text-base-300">{selectedRepo.forks}</span>
                      </div>
                      <div title="Stars" class="flex items-center gap-1 text-yellow-500">
                        <IconStar />
                        <span class="whitespace-pre text-base-300">{selectedRepo.stars}</span>
                      </div>
                      <div title="Issues" class="flex items-center gap-1 text-violet-500">
                        <IconCircledot />
                        <span class="whitespace-pre text-base-300">{selectedRepo.issues}</span>
                      </div>
                      <div title="Tamaño en kilobytes" class="flex items-center gap-1 text-neutral-400">
                        <IconFile />
                        <span class="whitespace-pre text-base-300">{selectedRepo.size} kb</span>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-x-8">
                      <div class="text-base-300">
                        Creado: {new Date(selectedRepo.createdAt ?? '').toLocaleString()}
                      </div>
                      <div class="text-base-300">
                        Actualizado: {new Date(selectedRepo.updatedAt ?? '').toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <nav>
                    <h4 class="sr-only">Links</h4>
                    <ul class="flex gap-4">
                      <li>
                        <a href={selectedRepo.url} target="_blank" rel="noopener noreferrer" class="text-primary-500 a"
                          >Github</a
                        >
                      </li>
                      {#if selectedRepo.homepage}<li>
                          <a
                            href={selectedRepo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary-500 a">Pagina</a
                          >
                        </li>{/if}
                      {#if selectedRepo.license}<li>
                          <a
                            href={selectedRepo.license.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="text-primary-500 a">Licencia</a
                          >
                        </li>{/if}
                    </ul>
                  </nav>
                </div>
              </Collapsible.Content>
            </Collapsible.Root>
          </div>
        {/if}
      </section>

      <aside class="h-full overflow-y-auto">
        <ReposSidebar repos={repoItems} bind:selected={selectedId} />
      </aside>
    </div>
  </div>

  <form
    action="?/readme_highlighted"
    method="post"
    use:enhance={enhanceHighlightReadme}
    bind:this={highlightReadmeForm}
    hidden
  >
    <input type="hidden" name="repo" value={selectedRepo?.name ?? ''} />
  </form>
</main>
