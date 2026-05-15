import { defineConfig } from 'astro/config';

// GitHub Pages: ssissun.github.io/nikke-storyline
// site/base는 production build에만 의미가 있으며 dev 서버에서는 base 경로가 적용됩니다.
export default defineConfig({
  site: 'https://ssissun.github.io',
  base: '/nikke-storyline',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
