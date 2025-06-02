<script lang="ts">
  import { debug } from '$comps/HyperDebug.svelte';
  import IconCheck from '$comps/icons/IconCheck.svelte';
  import IconCircledot from '$comps/icons/IconCircledot.svelte';
  import IconFile from '$comps/icons/IconFile.svelte';
  import IconGitfork from '$comps/icons/IconGitfork.svelte';
  import IconMinus from '$comps/icons/IconMinus.svelte';
  import IconPlus from '$comps/icons/IconPlus.svelte';
  import IconStar from '$comps/icons/IconStar.svelte';
  import Seo from '$comps/site/SEO.svelte';
  import { debounced_input } from '$lib/utils/attachments.js';
  import { Searcher } from '$lib/utils/searcher.js';
  import { effect_once, mutable } from '$lib/utils/state.svelte.js';
  import { Collapsible, Combobox, Label } from 'bits-ui';
  import ReposSidebar from './ReposSidebar.svelte';
  import './code_as_rawfile.css';
  import type { Repo } from './shared.js';

  let { data } = $props();
  console.log(data);
  const repos_cache = $derived.by(() => {
    const repos = data.repos.toSorted((a, b) => a.name.localeCompare(b.name));
    const id_to_repo: Record<string, undefined | Repo> = { '': undefined };
    for (let i = 0; i < data.repos.length; i++) {
      const repo = data.repos[i];
      id_to_repo[repo.id] = repo;
    }
    return {
      all: repos,
      id_to_repo: id_to_repo,
    };
  });

  let selected_repo_readme_html = $state('');
  let selected_repo_error = $state('');
  let selected_repo_id = mutable('', {
    onset: (v) => {
      selected_repo_error = '';
      selected_repo_readme_html = '';
    },
  });
  const selected_repo = $derived(repos_cache.id_to_repo[selected_repo_id.read()]);

  let repo_details_open = $state(true);
  let showRepositoryPage = $derived.by(() => {
    if (!selected_repo || !selected_repo.homepage) {
      return false;
    }
    for (let hosts of ['github.com', 'pypi.org', 'npmjs.com']) {
      if (selected_repo.homepage.includes(hosts)) {
        return false;
      }
    }
    return true;
  });

  $effect(() => {
    debug.setData({ selectedId: selected_repo_id.read(), selectedRepo: selected_repo });
  });

  $effect(() => {
    if (!selected_repo || showRepositoryPage) {
      return;
    }

    const repository_name = selected_repo.name;
    fetch(`/api/repositories/${repository_name}/readme/highlight`)
      .then((res) => {
        if (res.status !== 200) {
          selected_repo_error = `No se pudo obtener el README del repositorio ${repository_name}`;
          return;
        }
        return res.json();
      })
      .then((value) => {
        if (!value) {
          return;
        }
        selected_repo_readme_html = value.html;
      })
      .catch((ex) => {
        console.error(ex);
        selected_repo_error = `Error inesperado al cargar el README del repositorio ${repository_name}`;
      });
  });

  const searcher = new Searcher<Repo>({
    mapper: (x) => x.name + x.description + x.language,
  });
  effect_once(() => {
    searcher.add(repos_cache.all);
  });
  const repos_query = mutable('');
  let repos_displayed = $derived(repos_cache.all);
  $effect(() => {
    repos_displayed = searcher.search(repos_query.read());
  });
</script>

<Seo
  title="Repositories"
  description="Public repositories of Josu on Github. Have a look at what he has been cooking lately."
/>

{#snippet RepoPreview(repo: Repo)}
  {#if selected_repo_error}
    <div class="grid place-items-center h-full">
      <p class="text-red-500 text-balance">{selected_repo_error}</p>
    </div>
  {/if}
  {#if showRepositoryPage}
    <iframe title={repo.name} src={repo.homepage ?? repo.url} frameborder="0" class="w-full h-full"></iframe>
  {:else}
    <code title="{repo.name} README.md" class="rawfile text-sm">{@html selected_repo_readme_html}</code>
  {/if}
{/snippet}

{#snippet RepoPreviewUnselected()}
  <div class="mt-4 lg:grid lg:place-items-center h-full">
    <p class="text-base-300 text-xl text-center text-balance">Ningun repositorio seleccionado</p>
  </div>
{/snippet}

{#snippet RepoDetails(repo: Repo)}
  <Collapsible.Root
    bind:open={repo_details_open}
    class="rounded-md p-4 border border-base-500/25 bg-base-950/75 shadow light:bg-base-950"
  >
    <div class="flex items-center gap-4 text-base-200">
      <h3 class="text-xl font-semibold">{repo.name}</h3>
      <Collapsible.Trigger
        title={repo_details_open ? 'Ocultar informacion del repositorio' : 'Mostrar informacion del repositorio'}
      >
        {#if repo_details_open}
          <div>
            <IconMinus />
            <span class="sr-only"> Ocultar informacion del repositorio </span>
          </div>
        {:else}
          <div>
            <IconPlus />
            <span class="sr-only"> Mostrar informacion del repositorio </span>
          </div>
        {/if}
      </Collapsible.Trigger>
      {#if repo.language}
        <span
          class="ml-auto badge-lg text-lg font-semibold bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-200"
          >{repo.language}</span
        >
      {/if}
    </div>
    <Collapsible.Content class="pt-2 space-y-4">
      {#if repo.topics.length}
        <div class="flex flex-wrap gap-1">
          {#each repo.topics as tag (tag)}
            <span class="badge bg-base-950 ring-1 ring-primary-950 light:ring-primary-600 text-base-300">{tag}</span>
          {/each}
        </div>
      {/if}
      <div class="space-y-2 text-base">
        <p class="text-base-300">{repo.description}</p>
        <div class="flex flex-col gap-2">
          <h4 class="sr-only">Estadisticas</h4>
          <div class="flex gap-4">
            <div title="Forks" class="flex items-center gap-1 text-neutral-400">
              <IconGitfork />
              <span class="whitespace-pre text-base-300">{repo.forks}</span>
            </div>
            <div title="Stars" class="flex items-center gap-1 text-yellow-500">
              <IconStar />
              <span class="whitespace-pre text-base-300">{repo.stars}</span>
            </div>
            <div title="Issues" class="flex items-center gap-1 text-violet-500">
              <IconCircledot />
              <span class="whitespace-pre text-base-300">{repo.issues}</span>
            </div>
            <div title="Tamaño en kilobytes" class="flex items-center gap-1 text-neutral-400">
              <IconFile />
              <span class="whitespace-pre text-base-300">{repo.size} kb</span>
            </div>
          </div>
          <div class="flex flex-wrap gap-x-6 text-sm text-base-300">
            <div class="">
              Creado {new Date(repo.createdAt).toLocaleDateString()}
            </div>
            <div class="">
              Actualizado {new Date(repo.updatedAt ?? '').toLocaleDateString()}
            </div>
          </div>
        </div>
        <nav>
          <h4 class="sr-only">Links</h4>
          <ul class="flex gap-4">
            <li>
              <a href={repo.url} target="_blank" rel="noopener noreferrer" class="text-primary-500 a">GitHub</a>
            </li>
            {#if repo.homepage}
              <li>
                <a href={repo.homepage} target="_blank" rel="noopener noreferrer" class="text-primary-500 a">Pagina</a>
              </li>
            {/if}
            {#if repo.license}
              <li>
                <a href={repo.license.url} target="_blank" rel="noopener noreferrer" class="text-primary-500 a"
                  >Licencia</a
                >
              </li>
            {/if}
          </ul>
        </nav>
      </div>
    </Collapsible.Content>
  </Collapsible.Root>
{/snippet}

<main id="main" class="flex flex-col px-2 xs:px-4 h-full lg:h-screen-sub lg:overflow-hidden">
  <div class="flex flex-col w-full max-w-screen-md mx-auto lg:mx-0 lg:h-full lg:max-w-full">
    <header class="text-base-50">
      <h1 class="text-2xl font-bold mt-4">Repositorios</h1>
    </header>

    <section class="flex flex-col gap-4 max-w-full overflow-hidden lg:hidden">
      <Combobox.Root type="single" bind:value={selected_repo_id.read, selected_repo_id.set}>
        <div class=" mt-4 flex flex-wrap items-center gap-y-2 gap-x-4">
          <Label.Root for="repository-input" class="w-max text-lg font-semibold text-base-100">Buscar</Label.Root>
          <Combobox.Input
            id="repository-input"
            oninput={(ev) => repos_query.set(ev.currentTarget.value)}
            class="min-w-max w-full max-w-sm px-2 pt-1.5 pb-1 rounded border border-base-500/25 bg-base-950/75 text-base text-base-200 focus:outline-none focus:ring-0 focus:border-base-50"
          />
        </div>

        <Combobox.Portal>
          <Combobox.Content
            class="bg-base-950 border border-base-500/50 rounded shadow-sm fill-base-500 w-full"
            sideOffset={1}
          >
            {#each repos_displayed as repo (repo.id)}
              <Combobox.Item
                class="flex items-center justify-between py-1.5 px-2 text-base-100 text-sm cursor-pointer hover:bg-base-500/25 data-[selected]:bg-base-500/25"
                value={repo.id}
                label={repo.name}
              >
                {#snippet children({ selected })}
                  {repo.name}
                  {#if selected}
                    <div class="ml-auto size-4">
                      <IconCheck />
                    </div>
                  {/if}
                {/snippet}
              </Combobox.Item>
            {:else}
              <span class="block px-5 py-2 text-sm text-muted-foreground"> No results found </span>
            {/each}
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox.Root>

      {#if selected_repo === undefined}
        {@render RepoPreviewUnselected()}
      {:else}
        {@render RepoDetails(selected_repo)}

        <div
          class="min-h-[75vh] flex-1 rounded-md overflow-y-auto overflow-x-hidden border border-base-500/25 bg-[#1E1E1E] light:bg-[#FFFFFF]"
        >
          {@render RepoPreview(selected_repo)}
        </div>
      {/if}
    </section>

    <div class="hidden flex-1 overflow-hidden pt-4 lg:grid lg:grid-cols-[1fr_24rem] lg:gap-6 2xl:grid-cols-[1fr_28rem]">
      <section class="flex flex-col h-full overflow-hidden">
        {#if selected_repo === undefined}
          {@render RepoPreviewUnselected()}
        {:else}
          <div
            class="flex-1 rounded-md overflow-y-auto overflow-x-hidden border border-base-500/25 bg-[#1E1E1E] light:bg-[#FFFFFF]"
          >
            {@render RepoPreview(selected_repo)}
          </div>
          <div class="h-max pt-4 flex-none">
            {@render RepoDetails(selected_repo)}
          </div>
        {/if}
      </section>

      <aside
        class="flex flex-col max-h-full overflow-x-clip overflow-y-scroll rounded-md border border-base-500/25 bg-base-950 light:bg-base-950"
      >
        <div class="bg-base-950 text-base-200 sticky top-0 z-10 px-4 pt-4 pb-2">
          <label class="flex flex-col gap-2">
            <span class="text-base-200">Buscar</span>
            <input
              type="text"
              name="repos_filter"
              {@attach debounced_input({ oninput: repos_query.set, delay: 150 })}
              class="bg-base-950/75 light:bg-base-900 w-full py-1 px-2 rounded-sm text-base border border-base-500/25 focus:outline-none focus:ring-0 focus:border-base-50"
            />
          </label>
        </div>
        <div class="pt-2 pb-4 px-4">
          <ReposSidebar repos={repos_displayed} bind:selected={selected_repo_id.read, selected_repo_id.set} />
        </div>
      </aside>
    </div>
  </div>
</main>
