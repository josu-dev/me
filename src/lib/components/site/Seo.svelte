<script lang="ts">
  import { page } from '$app/stores';
  import { DEFAULT_OPEN_GRAPH } from '$lib/constants.js';
  import type { Snippet } from 'svelte';

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
     * 
     * @default 'current'
     */
    canonical?: 'current' | string & {};
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
     * 
     * @default 'current'
     */
    url?: 'current' | string & {};
    /**
     * The image related to the page
     */
    image?: { url: string; alt: string; width: string; height: string };
    /**
     * The theme color of the page
     */
    themeColor?: string;
    /**
     * Additional meta tags or links to be added to the head
     */
    children?: Snippet;
  };

  let {
    title,
    description,
    canonical = 'current',
    locale = DEFAULT_OPEN_GRAPH.LOCALE,
    siteName = DEFAULT_OPEN_GRAPH.SITE_NAME,
    titleOG,
    type = 'website',
    url = 'current',
    image = {
      url: DEFAULT_OPEN_GRAPH.IMAGE_URL,
      alt: DEFAULT_OPEN_GRAPH.IMAGE_ALT,
      width: DEFAULT_OPEN_GRAPH.IMAGE_WIDTH,
      height: DEFAULT_OPEN_GRAPH.IMAGE_HEIGHT,
    },
    themeColor= DEFAULT_OPEN_GRAPH.THEME_COLOR,
    children
  } :Props= $props();

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
  <meta name="theme-color" content={themeColor}>
  {#if children}
    {@render children()}
  {/if}
</svelte:head>
