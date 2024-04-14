<script lang="ts">
  import { page } from '$app/stores';
  import Seo from '$comps/site/SEO.svelte';
  import { GITHUB_REPOSITORY } from '$lib/constants.js';

  $: is404 = $page.status === 404;
  $: is500s = $page.status === 500;

  $: title = `${$page.status} - Error`;
  $: description =
    (is404 && `La pagina '${$page.url.pathname}' no se encuentra disponible`) ||
    (is500s && `El servidor no proceso correctamente la solicitud de la pagina '${$page.url.pathname}'`) ||
    `Ocurrio un error desconocido con la solicitud de la pagina '${$page.url.pathname}'`;

  $: subtitle =
    $page.error?.message ??
    ((is404 && 'Pagina no encontrada') || (is500s && 'Error en el servidor') || 'Creo que hiciste algo mal');

  $: safePathname = $page.url.pathname.length >= 64 ? $page.url.pathname.slice(0, 61) + '...' : $page.url.pathname;
</script>

<Seo {title} {description} />

<main class="flex flex-col md:px-4 h-full">
  <div class="h-full w-full grid grid-rows-6 max-w-[min(90vw,28rem)] my-auto mx-auto lg:max-w-screen-md">
    <div class="row-start-2 row-span-4 grid lg:row-start-2 lg:row-span-3 lg:items-center">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl lg:text-6xl font-bold text-white light:text-black text-center leading-tight">
          hum... <span class="animate-bounce inline-block">🫠</span>
        </h1>
        <p class="mt-4 text-lg lg:text-2xl font-semibold text-base-100 text-center text-pretty">
          {subtitle}
        </p>
        <p class="mt-4 text-base-300 text-base lg:text-lg text-balance text-center text-ellipsis">
          {#if is404}
            La pagina
            <span
              class="ring-1 ring-primary-950 light:ring-primary-600 bg-base-950 py-0.5 px-1.5 rounded-md font-medium break-all"
              >{safePathname}</span
            > no se encuentra disponible. Asegurate de que la URL este bien, se ser asi puede que la hayamos movido o eliminado
            🥲.
          {:else}
            Algo salio mal, pero no te preocupes, puedes volver al inicio.
          {/if}
        </p>
        {#if is500s}
          <p class="mt-[1em] text-base-300 text-sm text-balance text-center text-ellipsis">
            Si piensas que no deberia estar pasando esto puedes comunicarlo en el repositorio de
            <a
              href={GITHUB_REPOSITORY}
              target="_blank"
              rel="noopener noreferrer"
              class="font-semibold underline underline-offset-2 transition-all hover:underline-offset-4 hover:decoration-2 hover:text-white light:hover:text-black"
            >
              Github
            </a>
          </p>
        {/if}
      </div>
    </div>

    <div class="row-start-6 justify-self-center">
      <a href="/" class="a text-base-300 text-lg font-semibold hover:text-base-100">Volver al inicio</a>
    </div>
  </div>
</main>
