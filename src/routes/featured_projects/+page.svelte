<script lang="ts">
  import { debug } from '$comps/HyperDebug.svelte';
  import rawProjects from './projects.json';
  import { enhance } from '$app/forms';
  import { Collapsible } from 'bits-ui';
  import IconMinus from '$comps/icons/IconMinus.svelte';
  import IconPresentation from '$comps/icons/IconPresentation.svelte';
  import IconPlus from '$comps/icons/IconPlus.svelte';
  import IconStar from '$comps/icons/IconStar.svelte';
  import IconGitfork from '$comps/icons/IconGitfork.svelte';
  import IconFile from '$comps/icons/IconFile.svelte';
  import IconCircledot from '$comps/icons/IconCircledot.svelte';
  import Seo from '$comps/site/Seo.svelte';
  import { Tabs } from 'bits-ui';

  let projects = $state(rawProjects);

  let selectedId = $state('');
</script>

<Seo
  title="Public projects - Josu dev"
  description="Public projects of Josu on Github. All the repositories are open source and free to use."
/>

{#snippet ProjectTags(tags:string[])}
  <div class="mt-[1em] flex flex-wrap gap-2">
    {#each tags as tag}
      <span
        class="text-sm ring-1 ring-primary-950 text-base-300 light:ring-primary-600 bg-base-950 py-0.5 px-1.5 rounded-md font-medium break-all"
      >
        {tag}
      </span>
    {/each}
  </div>
{/snippet}

<main class="flex flex-col px-2 xs:px-4 h-full lg:h-screen-sub md:overflow-hidden">
  <div class="max-w-screen-md mx-auto lg:mx-0 lg:h-full lg:max-w-full flex flex-col">
    <header class="text-base-50">
      <h1 class="text-2xl font-bold mt-4">Proyectos destacados</h1>
    </header>

    <div class="flex flex-col lg:hidden">
      <p class="mt-[1em] text-base text-base-300">
        Estos son los proyectos destacados bien por su implementacion, por lo que
        implico realizarlos o por la idea en si.
      </p>
      <ul class="mt-6 ml-4 space-y-2">
        {#each projects as project (project.id)}
          <li class="flex text-base-200 gap-4">
            <div class="size-6 [&>svg]:fill-primary-800 light:[&>svg]:fill-primary-600">
              <IconPresentation />
            </div>
            <a
              href="#{project.id}"
              class="text-lg font-semibold underline-effect"
            >
              {project.name}
            </a>
          </li>
        {/each}
      </ul>
      <div class="mt-16 space-y-16">
        {#each projects as project (project.id)}
          <article>
            <header>
              <h2
                class="text-4xl font-semibold text-pretty text-base-200 pt-8"
                id={project.id}
              >
                {project.name}
              </h2>
              <div class="mt-[1em] flex flex-wrap gap-2">
                {#each project.tags as tag}
                  <span
                    class="text-sm ring-1 ring-primary-950 text-base-300 light:ring-primary-600 bg-base-950 py-0.5 px-1.5 rounded-md font-medium break-all"
                  >
                    {tag}
                  </span>
                {/each}
              </div>
            </header>
            <div class="pl-2">
              {#each project.description as paragraph}
                <p class="mt-[1em] text-base-300 text-balance">{paragraph}</p>
              {/each}
            </div>
            <figure class="flex flex-col mt-8">
              <img
                src={project.preview.gif}
                alt="Preview del proyecto {project.name}"
                class="w-full object-contain"
              />
              <figcaption class="text-base-400 pl-1 mt-2">
                {project.preview.caption}
              </figcaption>
            </figure>
          </article>
        {/each}
      </div>
    </div>

    <div class="hidden lg:flex h-full overflow-hidden pt-4 md:pt-6">
      <Tabs.Root
        bind:value={selectedId}
        class="h-full grid grid-rows-[3rem,1fr] w-full overflow-hidden"
      >
        <Tabs.List
          class="flex text-base font-semibold border border-b-0 border-base-500/25 text-base-200 max-w-full overflow-x-auto sb-base-900/50 [&:not(:hover)]:sb-thumb-transparent"
        >
          {#each projects as project (project.id)}
            <Tabs.Trigger
              value={project.id}
              class="relative group text-nowrap bg-base-900/75 py-1.5 px-3 border-b [&:not(:last-child)]:border-r border-base-500/25 data-[state=active]:bg-base-950/75 data-[state=active]:border-b-transparent"
            >
              <span class="md:hidden">{project.nameShort}</span>
              <span class="hidden md:inline-block">{project.name}</span>
              <div
                class="absolute top-0 right-0 left-0 h-0.5 group-data-[state=active]:bg-primary-800 light:group-data-[state=active]:bg-primary-600"
              />
            </Tabs.Trigger>
          {/each}
          <div class="flex-1 w-full bg-base-900/75 border-b border-base-500/25"></div>
        </Tabs.List>
        {#each projects as project}
          <Tabs.Content
            value={project.id}
            class="bg-base-950/75 border border-t-0 border-base-500/25 h-full flex flex-col overflow-y-auto [&[hidden='true']]:hidden lg:overflow-hidden"
          >
            <div class="py-8 px-4 h-full overflow-hidden lg:grid lg:gap-8 lg:grid-cols-[min(50%,40rem)_1fr] lg:max-h-full">
              <div class="overflow-y-auto px-px">
                <h2
                  class="mb-2 text-4xl text-base-200 font-semibold leading-none tracking-[-0.01em]"
                >
                  {project.name}
                </h2>
                {@render ProjectTags(project.tags)}
                <div class="">
                  {#each project.description as paragraph}
                    <p class="mt-[1em] text-base-300">{paragraph}</p>
                  {/each}
                </div>
              </div>

              <figure class="overflow-hidden h-full lg:grid lg:grid-rows-[auto,1fr] lg:max-h-full">
                <img
                  src={project.preview.gif}
                  alt="Preview del proyecto {project.name}"
                  class="max-h-[65vh] w-full object-cover"
                />
                <figcaption class="flex-none text-base-400 pl-2 mt-4">
                  {project.preview.caption}
                </figcaption>
              </figure>
            </div>
          </Tabs.Content>
        {/each}
      </Tabs.Root>
    </div>
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
