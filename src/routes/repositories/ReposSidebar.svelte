<script lang="ts">
  import IconChevrondown from '$comps/icons/IconChevrondown.svelte';
  import { Accordion } from 'bits-ui';
  import type { Repo } from './shared.js';

  type Props = {
    repos: Repo[];
    selected: string;
  };

  let { repos: items, selected = $bindable() }: Props = $props();
</script>

<Accordion.Root type="single" bind:value={selected} class="">
  {#each items as item (item.id)}
    <Accordion.Item
      value={item.id}
      class="group border-b border-base-500/25 last:border-none opacity-75 data-[state=open]:opacity-100"
    >
      <Accordion.Header>
        <Accordion.Trigger
          class="group flex w-full flex-1 items-center justify-between py-2 text-base text-base-200 font-medium transition-all [&[data-state=open]>span>div]:rotate-180 "
        >
          {item.name}
          <span
            class="inline-flex size-8 items-center justify-center bg-transparent rounded-md transition-all group-hover:bg-base-500/25"
          >
            <div class="size-[18px] transition-all duration-200">
              <IconChevrondown />
            </div>
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content class="pb-4 text-sm tracking-[-0.01em] text-base-300 {item.description ? '' : 'italic'}">
        {item.description || 'Sin descripcion'}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
