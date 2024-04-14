<script lang="ts">
  import Seo from '$comps/site/SEO.svelte';
</script>

<Seo
  description="Personal website of Josu, a developer interested on general Software Development, Web Technologies and Developer Experience."
/>

<main class="flex flex-col md:px-4 h-full">
  <div class="h-full w-full grid grid-rows-6 max-w-[min(90vw,28rem)] my-auto mx-auto lg:max-w-screen-md">
    <div class="row-start-2 row-span-4 grid lg:items-center">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl lg:text-6xl font-bold text-base-50 text-center leading-tight">Listo?</h1>
        <p class="mt-[1em] text-base-300 text-lg lg:text-2xl text-balance text-center">
          Presiona 'Ctrl + P' o <span class="text-nowrap">'4 taps'</span> en movil para empezar
          <span class="animate-bounce inline-block">😎</span>
        </p>
      </div>
    </div>
  </div>
</main>
