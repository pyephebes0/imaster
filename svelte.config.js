import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		vite: {
			ssr: {
				noExternal: [
					"mongoose",
					"@mongodb-js/zstd"
				]
			}
		}
	}
};

export default config;
