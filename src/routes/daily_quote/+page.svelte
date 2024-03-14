<script lang="ts">
  import TypeWritter from '$comps/TypeWritter.svelte';
  import Seo from '$comps/layout/Seo.svelte';
  import { copytoclipboard } from '$lib/actions.js';
  import { toast } from '$lib/utils/index.js';

  let { data } = $props();

  const quoteMessage = `“${data.quote.quote.es}”`;
  const quoteAuthor = `── ${data.quote.author}.`;
  const quoteCopy = `${quoteMessage}\n    ${quoteAuthor}`;

  let showAuthor = $state(false);
</script>

<Seo
  title="Daily quote - Josu dev"
  description="A daily quote because why not?. It comes from Josu or something that he heard and liked."
/>

<main class="flex flex-col md:px-4 h-full">
  <div
    class="h-full w-full grid grid-rows-6 max-w-[min(90vw,32rem)] m-auto md:max-w-[min(75vw,56rem)]"
  >
    <div class="row-start-2 row-span-4 grid">
      <div class="flex flex-col">
        <h1 class="text-6xl font-bold text-zinc-50 text-center leading-tight">
          Cita del dia
        </h1>
        <div
          class="flex flex-col mt-8 p-1 rounded-2xl transition-all duration-500 uniform-shadow hover:shadow-sky-500/[0.01] hover:bg-sky-500/[0.01] md:p-4 md:mt-16 xl:mt-24"
          role="button"
          use:copytoclipboard={{
            text: quoteCopy,
            onsuccess: () => {
              toast.success('Cita copiada al portapapeles');
            },
            onerror: () => {
              toast.error('No se pudo copiar la cita');
            },
          }}
        >
          <p class="text-4xl font-bold text-zinc-100 self-start">
            <TypeWritter
              text={quoteMessage}
              start
              initialDelay={1000}
              onend={() => (showAuthor = true)}
            />
          </p>
          <p
            class="text-lg text-zinc-300 italic self-end {showAuthor
              ? 'mt-[1em]'
              : ''}"
          >
            <TypeWritter
              text={quoteAuthor}
              start={showAuthor}
              initialDelay={250}
              vanishCursorOnEnd
            />
          </p>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  .uniform-shadow:hover {
    --tw-shadow: 0 0 12.5px 12.5px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),
      var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
</style>
