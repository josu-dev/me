<script lang="ts">
  import IconChevrondown from '$comps/icons/IconChevrondown.svelte';
  import { Accordion } from 'bits-ui';
  import { slide } from 'svelte/transition';

  type Props = {
    repos: {
      id: string;
      title: string;
      description: string;
    }[];
    selected: string;
  };

  let { repos: items, selected } = $props<Props>();
</script>

<Accordion.Root
  bind:value={selected}
  class="w-full rounded-md p-4 border border-zinc-500/25 bg-zinc-950/75 shadow"
>
  {#each items as item (item.id)}
    <Accordion.Item
      value={item.id}
      class="group border-b border-zinc-500/25 last:border-none px-1.5 opacity-75 data-[state=open]:opacity-100"
    >
      <Accordion.Header>
        <Accordion.Trigger
          class="flex w-full flex-1 items-center justify-between py-2 text-base text-zinc-200 font-medium transition-all [&[data-state=open]>span>div]:rotate-180 "
        >
          {item.title}
          <span
            class="inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all hover:bg-dark-10"
          >
            <div class="size-[18px] transition-all duration-200">
              <IconChevrondown />
            </div>
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        transition={slide}
        transitionConfig={{ duration: 200 }}
        class="pb-4 text-sm tracking-[-0.01em] text-zinc-300"
      >
        {item.description || 'Sin descripcion'}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
