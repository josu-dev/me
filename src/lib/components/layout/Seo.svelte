<script lang="ts">
  import { page } from '$app/stores';
  import { DEFAULT_OPEN_GRAPH } from '$lib/constants.js';

  type Props = {
    /**
     * The title of the page
     */
    title: string;
    /**
     * The description of the page
     */
    description: string;
    /**
     * The canonical URL of the page
     */
    canonical?: 'current' | string;
    /**
     * The locale of the page
     */
    locale?: `${string}_${string}`;
    /**
     * The name of the site
     */
    siteName?: string;
    /**
     * The title of the page for Open Graph
     */
    titleOG?: string;
    /**
     * The type of the page
     */
    type?: 'article' | 'website';
    /**
     * The URL of the page
     */
    url?: 'current' | string;
    /**
     * The image related to the page
     */
    image?: { url: string; alt: string; width: string; height: string };
  };

  let {
    title,
    description,
    canonical,
    locale,
    siteName,
    titleOG,
    type,
    url,
    image = {
      url: DEFAULT_OPEN_GRAPH.IMAGE_URL,
      alt: DEFAULT_OPEN_GRAPH.IMAGE_ALT,
      width: DEFAULT_OPEN_GRAPH.IMAGE_WIDTH,
      height: DEFAULT_OPEN_GRAPH.IMAGE_HEIGHT,
    },
  } = $props<Props>();

  let currentUrl = $derived(
    $page.url.origin + ($page.url.pathname === '/' ? '' : $page.url.pathname),
  );
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link
    rel="canonical"
    href={canonical === 'current' ? currentUrl : canonical}
  />
  <meta property="og:locale" content={locale} />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={titleOG ?? title} />
  <meta property="og:type" content={type} />
  <meta property="og:url" content={url === 'current' ? currentUrl : url} />
  <meta property="og:description" content={description} />
  {#if image.url}
    <meta property="og:image" content={image.url} />
    <meta property="og:image:alt" content={image.alt} />
    <meta property="og:image:width" content={image.width} />
    <meta property="og:image:height" content={image.height} />
  {/if}
  <slot />
</svelte:head>
