<script lang="ts" context="module">
  let data = $state();
  let visible = $state(false);

  export const debug = {
    get data() {
      return data;
    },
    setData(value: unknown) {
      data = value;
    },
    get visible() {
      return visible;
    },
    setVisible(value: boolean) {
      visible = value;
    },
    toggle() {
      visible = !visible;
    },
  };
</script>

<script lang="ts">
  import { clickoutside, escapekey } from '$lib/actions.js';
  import { helpers } from '$comps/site/SitePalette.svelte';
  import SuperDebug from 'sveltekit-superforms';

  let {
    label,
    truncate,
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
    truncate?: number;
  }>();

  function closeDialog() {
    debug.setVisible(false);
  }

  $effect(() => {
    return helpers.registerCommand({
      id: 'global:toggle-debug',
      name: 'Datos de depuracion',
      category: 'Dev',
      description: 'Alternar la visibilidad de los datos de depuracion',
      shortcut: ['$mod+D'],
      onAction: () => {
        debug.toggle();
      },
    });
  });
</script>

{#if debug.visible}
  <div
    use:clickoutside={{ handler: closeDialog }}
    use:escapekey={{ handler: closeDialog }}
    class="fixed inset-0 z-10 my-auto mx-auto h-max max-h-[90vh] max-w-[95vw] sm:max-w-[min(90vw,1024px)] overflow-y-auto"
  >
    <SuperDebug
      data={debug.data}
      {label}
      stringTruncate={truncate}
      {functions}
      theme="vscode"
    />
  </div>
{/if}

<style>
  div :global(pre),
  div :global(span) {
    font-family: 'JetBrains Mono', Inconsolata, Monaco, Consolas,
      'Lucida Console', 'Courier New', Courier, monospace;
  }
</style>
