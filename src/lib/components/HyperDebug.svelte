<script lang="ts" context="module">
  let data = $state();
  let enabled = $state(false);

  export const debug = {
    get data() {
      return data;
    },
    set data(value) {
      data = value;
    },
    get enabled() {
      return enabled;
    },
    set enabled(value: boolean) {
      enabled = value;
    },
  };
</script>

<script lang="ts">
  import { clickoutside } from '$lib/actions.js';
  import { helpers } from 'svelte-hypercommands/CommandPalette.svelte';
  import SuperDebug from 'sveltekit-superforms';

  let {
    label,
    stringTruncate,
    functions = true,
  } = $props<{
    /**
     * Whether to show functions in the debug output
     */
    functions?: boolean;
    /**
     * The label to show in the debug output
     */
    label?: string;
    /**
     * The maximum length of strings to show in the debug output
     */
    stringTruncate?: number;
  }>();

  $effect(() => {
    return helpers.registerCommand({
      name: 'Open Debug',
      shortcut: '$mod+D',
      onAction: () => {
        debug.enabled = !debug.enabled;
      },
    });
  });
</script>

{#if debug.enabled}
  <div
    use:clickoutside={{ handler: () => (debug.enabled = false) }}
    class="fixed inset-0 my-auto mx-auto h-max max-h-[90vh] max-w-[95vw] sm:max-w-[min(90vw,1024px)] overflow-y-auto"
  >
    <SuperDebug
      data={debug.data}
      {label}
      {stringTruncate}
      {functions}
      theme="vscode"
    />
  </div>
{/if}

<style lang="postcss">
  div :global(:is(pre, span)) {
    font-family: 'JetBrains Mono', Inconsolata, Monaco, Consolas,
      'Lucida Console', 'Courier New', Courier, monospace;
  }
</style>
