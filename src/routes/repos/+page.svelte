<script lang="ts">
  import { debug } from '$comps/HyperDebug.svelte';
  import type { SubmitFunction } from './$types.js';
  import ReposSidebar from './ReposSidebar.svelte';
  import { enhance } from '$app/forms';
  import { Collapsible } from 'bits-ui';
  import IconMinus from '$comps/icons/IconMinus.svelte';
  import IconPlus from '$comps/icons/IconPlus.svelte';
  import IconStar from '$comps/icons/IconStar.svelte';
  import IconGitfork from '$comps/icons/IconGitfork.svelte';
  import IconFile from '$comps/icons/IconFile.svelte';
  import IconCircledot from '$comps/icons/IconCircledot.svelte';
  import Seo from '$comps/site/Seo.svelte';
  import { slide } from 'svelte/transition';

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
  let selectedRepo = $derived(
    (data.repos ?? []).find((repo) => repo.id === selectedId),
  );
  let repoInfoOpen = $state(true);
  let showRepositoryPage = $derived.by(() => {
    if (!selectedRepo) {
      return false;
    }
    if (!selectedRepo.homepage) {
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
    if (!selectedRepo || !selectedRepo.homepage) {
      return;
    }

    fetch(selectedRepo.homepage)
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
  title="Public projects - Josu dev"
  description="Public projects of Josu on Github. All the repositories are open source and free to use."
/>

<main class="flex flex-col md:px-4 h-full">
  <header class="text-base-50">
    <h1 class="text-2xl font-bold mt-4">Repositorios publicos</h1>
  </header>

  <div
    class="flex-1 overflow-hidden grid mt-4 md:grid-cols-[1fr,24rem] md:gap-8 md:mt-6 2xl:grid-cols-[1fr,28rem]"
  >
    <section class="flex flex-col h-full overflow-hidden">
      {#if !selectedRepo}
        <div class="grid place-items-center h-full">
          <p class="text-base-300 text-lg text-center text-balance">
            Prueba seleccionando un repositorio
            <span class="animate-bounce inline-block">😉</span>
          </p>
        </div>
      {:else}
        <div
          class="flex-1 rounded-md overflow-y-auto border border-base-500/25"
        >
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
            <code
              title="{selectedRepo.name} README.md"
              class="[&>pre]:min-h-full overflow-auto [&>pre]:p-4 [&_pre.shiki]:whitespace-pre-wrap break-words"
              >{@html repoReadmeHtml}</code
            >
          {/if}
        </div>
        <div class="h-max mt-4">
          <Collapsible.Root
            bind:open={repoInfoOpen}
            class="rounded-md p-4 border border-base-500/25 bg-base-950/75 shadow light:bg-base-950"
          >
            <div class="flex items-center gap-4 text-base-200">
              <h3 class="text-xl font-medium">{selectedRepo.name}</h3>
              <Collapsible.Trigger
                title={repoInfoOpen
                  ? 'Ocultar informacion del repositorio'
                  : 'Mostrar informacion del repositorio'}
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
                  class="ml-auto badge-lg text-2xl bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-200"
                  style="font-size:inherit;">{selectedRepo.language}</span
                >
              {/if}
            </div>
            <Collapsible.Content class="pt-2 space-y-4" transition={slide}>
              {#if selectedRepo.topics.length}
                <div class="flex flex-wrap gap-1">
                  {#each selectedRepo.topics as tag (tag)}
                    <span
                      class="badge bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-300"
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
                    <div
                      title="Forks"
                      class="flex items-center gap-1 text-neutral-400"
                    >
                      <IconGitfork />
                      <span class="whitespace-pre text-base-300"
                        >{selectedRepo.forks}</span
                      >
                    </div>
                    <div
                      title="Stars"
                      class="flex items-center gap-1 text-yellow-500"
                    >
                      <IconStar />
                      <span class="whitespace-pre text-base-300"
                        >{selectedRepo.stars}</span
                      >
                    </div>
                    <div
                      title="Issues"
                      class="flex items-center gap-1 text-violet-500"
                    >
                      <IconCircledot />
                      <span class="whitespace-pre text-base-300"
                        >{selectedRepo.issues}</span
                      >
                    </div>
                    <div
                      title="Tamaño en kilobytes"
                      class="flex items-center gap-1 text-neutral-400"
                    >
                      <IconFile />
                      <span class="whitespace-pre text-base-300"
                        >{selectedRepo.size} kb</span
                      >
                    </div>
                  </div>
                  <div class="flex flex-wrap gap-x-8">
                    <div class="text-base-300">
                      Creado: {new Date(
                        selectedRepo.createdAt ?? '',
                      ).toLocaleString()}
                    </div>
                    <div class="text-base-300">
                      Actualizado: {new Date(
                        selectedRepo.updatedAt ?? '',
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <nav>
                  <h4 class="sr-only">Links</h4>
                  <ul class="flex gap-4">
                    <li>
                      <a
                        href={selectedRepo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-primary-500 a">Github</a
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
      <form
        action="?/readme_highlighted"
        method="post"
        use:enhance={enhanceHighlightReadme}
        bind:this={highlightReadmeForm}
        class="hidden"
      >
        <input type="hidden" name="repo" value={selectedRepo?.name ?? ''} />
      </form>
    </section>

    <aside class="h-full overflow-y-auto">
      <ReposSidebar repos={repoItems} bind:selected={selectedId} />
    </aside>
  </div>
</main>

<style>
  /* For the variable prefix @see {$lib/server/shiki.ts@highlightMarkdown} */
  :global([data-theme='dark'] .shiki),
  :global([data-theme='dark'] .shiki span) {
    background-color: var(--dark-bg);
    color: var(--dark);
    font-style: var(--dark-font-style);
    font-weight: var(--dark-font-weight);
    text-decoration: var(--dark-text-decoration);
  }

  :global([data-theme='light'] .shiki),
  :global([data-theme='light'] .shiki span) {
    background-color: var(--light-bg);
    color: var(--light);
    font-style: var(--light-font-style);
    font-weight: var(--light-font-weight);
    text-decoration: var(--light-text-decoration);
  }
</style>
