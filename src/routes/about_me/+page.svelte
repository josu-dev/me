<script lang="ts">
  import IconFileplus from '$comps/icons/IconFileplus.svelte';
  import IconGithub from '$comps/icons/IconGithub.svelte';
  import IconLinkedin from '$comps/icons/IconLinkedin.svelte';
  import Seo from '$comps/site/SEO.svelte';
  import { GITHUB_USERNAME, LINKEDIN_USERNAME } from '$lib/constants.js';

  const contacts = [
    {
      name: 'GitHub',
      text: `github.com/${GITHUB_USERNAME}`,
      icon: IconGithub,
      href: `https://github.com/${GITHUB_USERNAME}`,
    },
    {
      name: 'LinkedIn',
      text: `www.linkedin.com/in/${LINKEDIN_USERNAME}/`,
      href: `https://www.linkedin.com/in/${LINKEDIN_USERNAME}/`,
      icon: IconLinkedin,
    },
  ];

  const cv = {
    name: 'Josue_Suarez_CV.pdf',
    href: '/blob/Josue_Suarez_CV.pdf',
  };
</script>

<Seo
  title="About me"
  description="Want to know more about me? Here you can find my contact information and my resume."
/>

<main id="main" class="flex flex-col md:px-4 h-full">
  <div class="h-full w-max grid grid-rows-6 max-w-[90vw] m-auto">
    <div class="row-start-2 row-span-4 flex flex-col">
      <h1 class="text-4xl lg:text-6xl font-bold text-base-50 text-center leading-tight">Sobre mi</h1>
      <p class="text-base lg:text-xl mt-[1em] text-base-300 text-center text-balance">
        Tenes alguna idea o propuesta en mente?
      </p>

      <div class="flex flex-col p-1">
        <div>
          <h2 class="text-lg lg:text-2xl font-semibold text-base-100 text-pretty mt-[1.5em]">Contactame y hablemos</h2>
          <ul class="ml-4">
            {#each contacts as contact}
              <li>
                <div class="mt-[1em] flex text-base lg:text-xl text-base-200 break-all">
                  <span class="size-7 mr-4">
                    <svelte:component this={contact.icon} />
                  </span>
                  <span class="sr-only">{contact.name}</span>
                  <a href={contact.href} target="_blank" rel="noopener noreferrer" class="underline-effect">
                    {contact.text}
                  </a>
                </div>
              </li>
            {/each}
          </ul>
        </div>

        <div>
          <h2 class="text-lg lg:text-2xl font-semibold text-base-100 text-pretty mt-[2em]">O mira mi CV</h2>
          <div class="ml-4 flex text-base-200 mt-[1em] text-base lg:text-xl break-all">
            <span class="size-7 mr-4">
              <IconFileplus />
            </span>
            <span class="sr-only">{cv.name}</span>
            <a
              href={cv.href}
              target="_blank"
              rel="noopener noreferrer"
              title="CV de Josu"
              class="underline-effect"
              aria-hidden="true"
            >
              {cv.href}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
