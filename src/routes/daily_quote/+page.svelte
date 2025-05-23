<script lang="ts">
  import TypeWritter from '$comps/TypeWritter.svelte';
  import IconVolume2 from '$comps/icons/IconVolume2.svelte';
  import IconVolumex from '$comps/icons/IconVolumex.svelte';
  import Seo from '$comps/site/SEO.svelte';
  import { helpers } from '$comps/site/SitePalette.svelte';
  import { copytoclipboard } from '$lib/actions.js';
  import { toast } from '$lib/utils/index.js';
  import { getLocallySyncqued } from '$lib/utils/local_storage.js';
  import { blur } from 'svelte/transition';

  let { data } = $props();

  const quoteMessage = `“${data.quote.quote.es}”`;
  const quoteAuthor = `── ${data.quote.author}.`;
  const quoteCopy = `${quoteMessage}\n    ${quoteAuthor}`;

  const storedSound = getLocallySyncqued({
    key: 'typewriter_sound',
    fallback: true,
    autoRegister: false,
  });

  function toggleSoundEffect() {
    soundEnabled = !soundEnabled;
    storedSound.set(soundEnabled);
  }

  let showAuthor = $state(false);

  let soundEnabled = $state(storedSound.value);
  let soundEnabledLabel = $derived(soundEnabled ? 'Desactivar efecto de sonido' : 'Activar efecto de sonido');

  $effect(() => {
    const cleanup = helpers.registerCommand({
      name: 'Alternar efecto de escritura',
      description: 'Activa o desactiva el efecto de escritura de la animacion de la cita.',
      onAction: toggleSoundEffect,
    });

    return cleanup;
  });
</script>

<Seo
  title="Daily quote"
  description="A daily quote because why not?. It comes from Josu or something that he heard and liked."
/>

<main id="main" class="relative flex flex-col md:px-4 h-full">
  <div class="h-full w-full grid grid-rows-6 max-w-[min(90vw,32rem)] m-auto md:max-w-[min(75vw,56rem)]">
    <div class="row-start-2 row-span-4 grid">
      <div class="flex flex-col">
        <h1 class="text-4xl lg:text-6xl font-bold text-base-50 text-center leading-tight">Cita del dia</h1>
        <div
          class="flex flex-col mt-8 p-1 rounded-2xl transition-[box-shadow,background-color] duration-500 uniform-shadow hover:shadow-primary-500/[0.01] hover:bg-primary-500/[0.01] md:p-4 lg:mt-16 xl:mt-24"
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
          <p class="text-2xl lg:text-4xl font-bold text-base-100">
            <TypeWritter
              text={quoteMessage}
              start
              initialDelay={0}
              onend={() => (showAuthor = true)}
              sound={soundEnabled}
            />
          </p>
          <p class="text-base lg:text-xl text-base-300 italic self-end {showAuthor ? 'mt-[1em]' : ''}">
            <TypeWritter
              text={quoteAuthor}
              start={showAuthor}
              initialDelay={250}
              sound={soundEnabled}
              vanishCursorOnEnd
            />
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="absolute right-2 bottom-0 flex md:right-4">
    <button class="size-8 p-px text-base-200 rounded-md" title={soundEnabledLabel} onclick={toggleSoundEffect}>
      <span class="sr-only">{soundEnabledLabel}</span>
      {#if soundEnabled}
        <div in:blur={{ duration: 250 }}>
          <IconVolume2 />
        </div>
      {:else}
        <div in:blur={{ duration: 250 }}>
          <IconVolumex />
        </div>
      {/if}
    </button>
  </div>
</main>

<style>
  .uniform-shadow:hover {
    --tw-shadow: 0 0 12.5px 12.5px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  }
</style>
