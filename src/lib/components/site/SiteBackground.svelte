<script lang="ts">
  type Light = {
    pos: { x: number; y: number };
    dir: { x: number; y: number };
    vel: number;
  };

  let lights = $state<Light[]>([
    {
      pos: {
        x: 58.8465464548315,
        y: 95.97464933605863,
      },
      dir: {
        x: 0.6415387008325659,
        y: 0.32847612216795063,
      },
      vel: 0.15344993997182288,
    },
    {
      pos: {
        x: 35.491393742519186,
        y: 4.242483447877629,
      },
      dir: {
        x: 0.5727302654123259,
        y: 0.22659689921578252,
      },
      vel: 0.17475239135893134,
    },
    {
      pos: {
        x: 79.82327749280746,
        y: 5.483892859266046,
      },
      dir: {
        x: 0.37543491613256563,
        y: 0.12026053429731975,
      },
      vel: 0.1739188252799277,
    },
    {
      pos: {
        x: 79.25509760864097,
        y: 34.41477499936135,
      },
      dir: {
        x: -0.8617425468093041,
        y: 0.44089920240123837,
      },
      vel: 0.1642721050730871,
    },
    {
      pos: {
        x: 86.98083484291142,
        y: 97.95559271112742,
      },
      dir: {
        x: -0.8249172498845705,
        y: -0.24174370010897306,
      },
      vel: 0.16614864907178378,
    },
  ]);

  let lightsStyles = $derived(
    lights.reduce(
      (acc, l, i) => acc + `--light-${i}-at: at ${l.pos.x}% ${l.pos.y}%;`,
      '',
    ),
  );

  let updateId: number;

  async function update() {
    updateId = requestAnimationFrame(() => {
      for (const light of lights) {
        light.pos.x += light.dir.x * light.vel;
        light.pos.y += light.dir.y * light.vel;
        if (light.pos.x < 0 || light.pos.x > 100) {
          light.dir.x *= -1;
        }
        if (light.pos.y < 0 || light.pos.y > 100) {
          light.dir.y *= -1;
        }
      }
      update();
    });
  }

  $effect(() => {
    update();
    return () => cancelAnimationFrame(updateId);
  });
</script>

<div class="absolute inset-0 -z-10" style={lightsStyles}></div>

<style>
  div {
    background-color: var(--site-bg-color);
    background-image: radial-gradient(
        circle var(--light-0-at),
        var(--site-bg-image-color) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle var(--light-1-at),
        var(--site-bg-image-color) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle var(--light-2-at),
        var(--site-bg-image-color) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle var(--light-3-at),
        var(--site-bg-image-color) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle var(--light-4-at),
        var(--site-bg-image-color) 0%,
        transparent 50%
      );
  }
</style>
