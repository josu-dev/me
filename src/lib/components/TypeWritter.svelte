<script lang="ts">
  import { untrack } from 'svelte';

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

  function noop() {}

  let {
    text,
    start = false,
    interval = 100,
    initialDelay = 0,
    initialText = '',
    vanishCursorOnEnd = false,
    sound = true,
    onend = noop,
    onstart = noop,
  } = $props<Props>();

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
      const nextDelay = Math.floor(
        Math.random() * interval * 0.75 + interval * 0.75,
      );
      timeoutId = setTimeout(typeNextLetter, nextDelay);
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    onend();

    if (vanishCursorOnEnd) {
      setTimeout(() => {
        ended = true;
      }, 10 * 1000);
    } else {
      ended = true;
    }
  }

  $effect(() => {
    audio = new Audio('/audio/typewriter.m4a');

    return () => {
      audio.pause();
      clearTimeout(timeoutId);
    };
  });

  function startTyping() {
    if (sound) {
      audio.currentTime = 0;
      audio.loop = true;
      audio.volume = 0.33 * 0.33;
      audio.playbackRate = 1.5;
      audio.play().catch(() => {
        failedToPlay = true;
      });
    }

    onstart();

    typeNextLetter();
  }

  $effect(() => {
    if (!start) {
      return;
    }

    if (initialDelay <= 0) {
      untrack(startTyping);
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
