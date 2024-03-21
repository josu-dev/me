<script lang="ts">
  import IconBriefcase from '$comps/icons/IconBriefcase.svelte';
  import Seo from '$comps/site/Seo.svelte';
  import rawProjects from './projects.json';
  import { Tabs } from 'bits-ui';

  let projects = $state(rawProjects.sort((a, b) => a.order - b.order));

  let selectedId = $state(projects[0]?.id ?? '');
</script>

<Seo
  title="Public projects - Josudev"
  description="Public projects of Josu on Github. All the repositories are open source and free to use."
/>

{#snippet ProjectTags(tags:string[])}
  <div class="mt-[1em] flex flex-wrap gap-2 gap-x-3">
    {#each tags as tag}
      <span
        class="text-sm ring-1 ring-primary-950 text-base-300 light:ring-primary-600 bg-base-950 py-0.5 px-1.5 rounded-md font-medium break-all"
      >
        {tag}
      </span>
    {/each}
  </div>
{/snippet}

{#snippet ProjectContent(project: typeof projects[number])}
  <div class="px-2">
    {#each project.description as paragraph}
      <p class="mt-[1em] text-base-300 text-balance">{paragraph}</p>
    {/each}
    <ul class="list-disc mt-6 ml-6 space-y-2">
      {#if project.homepage}
        <li class="text-base-300">
          Visita la <a
            href={project.homepage}
            target="_blank"
            rel="noopener noreferrer"
            class="underline-effect"
          >pagina web</a
          > para probarlo.
        </li>
      {/if}
      {#if project.repository}
        <li class="text-base-300">
          Visita el <a
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
            class="underline-effect"
          >repositorio en Github</a
          > para mas informacion.
        </li>
      {/if}
    </ul>
  </div>
{/snippet}

<main class="flex flex-col px-2 xs:px-4 h-full lg:h-screen-sub lg:overflow-hidden">
  <div class=" flex flex-col max-w-screen-md mx-auto lg:mx-0 lg:h-full lg:max-w-full">
    <header class="text-base-50">
      <h1 class="text-2xl font-bold mt-4">Proyectos destacados</h1>
    </header>

    <div class="flex flex-col lg:hidden">
      <p class="mt-[1em] text-base text-base-300">
        Estos son mis proyectos destacados bien por su implementacion, por lo que
        implico realizarlos o por la idea en si.
      </p>
      <ul class="mt-4 ml-2 space-y-2">
        {#each projects as project (project.id)}
          <li class="flex text-base-200 gap-4">
            <div class="size-6 my-auto">
              <IconBriefcase />
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
              {@render ProjectTags(project.tags)}
            </header>
            {@render ProjectContent(project)}
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
              class="relative group text-nowrap bg-base-900/75 py-1.5 px-3 border-b [&:not(:last-child)]:border-r border-base-500/25 data-[state=active]:bg-base-950/75 light:data-[state=active]:bg-base-950 data-[state=active]:border-b-transparent"
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
            class="bg-base-950/75 light:bg-base-950 border border-t-0 border-base-500/25 h-full flex flex-col overflow-y-auto {project.id !== selectedId ? 'hidden' : ''} lg:overflow-hidden"
          >
          <!-- another way to hidde [&[hidden='true']]:hidden - the current one works with ssr -->
            <div class="py-8 px-4 h-full overflow-hidden lg:grid lg:gap-8 lg:grid-cols-[min(50%,48rem)_1fr] lg:max-h-full">
              <div class="overflow-y-auto px-px">
                <h2
                  class="mb-2 text-4xl text-base-200 font-semibold leading-none tracking-[-0.01em]"
                >
                  {project.name}
                </h2>
                {@render ProjectTags(project.tags)}
                {@render ProjectContent(project)}
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
