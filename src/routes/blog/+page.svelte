<script lang="ts">
  import Seo from '$comps/site/SEO.svelte';
</script>

<Seo
  title="Blog"
  description="Personal blog of Josu, a place to share thoughts, ideas and experiences about Software Development, Web Technologies and Developer Experience."
/>

<main class="flex flex-col md:px-4 h-full">
  <div class="h-full w-full grid grid-rows-6 max-w-md my-auto mx-auto lg:max-w-screen-md">
    <div class="row-start-2 row-span-4 grid lg:items-center">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-4xl lg:text-6xl font-bold text-base-50 text-center leading-tight">
          Proximamente... <span class="animate-bounce inline-block">🏗️</span>
        </h1>
        <p class="mt-[1em] text-base-300 text-lg lg:text-2xl text-balance text-center text-ellipsis">
          Cuando la seccion del <span
            class="ring-1 ring-primary-950 light:ring-primary-600 bg-base-950 py-0.5 px-1.5 rounded-md font-medium"
            >blog</span
          > este lista sera el lugar para compartir experiencias, opiniones, tutoriales y otras cosas sobre codigo, desarrollo
          y la vida.
        </p>
      </div>
    </div>
  </div>
</main>
