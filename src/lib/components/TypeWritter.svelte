<script lang="ts">
  import { untrack } from 'svelte';

  const VOLUME = 0.33 * 0.33;

  type Props = {
    text: string;
    interval?: number;
    initialDelay?: number;
    sound?: boolean;
    start?: boolean;
    vanishCursorOnEnd?: boolean;
    onend?: () => void;
    onstart?: () => void;
    [k: string]: any;
  };

  let {
    text,
    start = false,
    interval = 100,
    initialDelay = 0,
    initialText = '',
    vanishCursorOnEnd = false,
    vanishDuration = 10 * 1000,
    sound = true,
    onend,
    onstart,
  }: Props = $props();

  let audio: HTMLAudioElement;
  let failedToPlay = false;
  let ended = $state(false);
  let typedIdx = 0;
  let typedText = $state(initialText);

  let timeoutId: ReturnType<typeof setTimeout>;

  function typeNextLetter() {
    typedText += text[typedIdx];
    typedIdx += 1;
    if (failedToPlay && sound) {
      failedToPlay = false;
      audio.play().catch(() => {
        failedToPlay = true;
      });
    }

    if (typedIdx < text.length) {
      const nextDelay = Math.floor(Math.random() * interval * 0.75 + interval * 0.75);
      timeoutId = setTimeout(typeNextLetter, nextDelay);
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    if (vanishCursorOnEnd) {
      setTimeout(() => {
        ended = true;
        onend?.();
      }, vanishDuration);
      return;
    }

    ended = true;
    onend?.();
  }

  function startTyping() {
    audio.play().catch(() => {
      failedToPlay = true;
    });
    onstart?.();
    untrack(typeNextLetter);
  }

  $effect(() => {
    audio = new Audio('/blob/typewriter.m4a');
    audio.loop = true;
    audio.playbackRate = 1.5;

    return () => {
      audio.pause();
      clearTimeout(timeoutId);
    };
  });

  // Should be called after audio initialization
  $effect(() => {
    if (!audio) {
      return;
    }

    if (sound) {
      audio.volume = VOLUME;
    } else {
      audio.volume = 0;
    }
  });

  $effect(() => {
    if (!start) {
      return;
    }

    if (initialDelay <= 0) {
      startTyping();
      return;
    }

    timeoutId = setTimeout(startTyping, initialDelay);
  });
</script>

{typedText}<span
  class="cursor"
  class:vanish={ended && vanishCursorOnEnd}
  class:hidden={!start || (ended && !vanishCursorOnEnd)}>|</span
>

<style>
  @keyframes blink {
    0% {
      opacity: 1;
    }
    45% {
      opacity: 1;
    }
    55% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes vanish {
    0% {
      opacity: 1;
    }
    75% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .cursor {
    animation: blink 1s infinite;
  }

  .cursor.vanish {
    animation: vanish 1s forwards;
  }
</style>
