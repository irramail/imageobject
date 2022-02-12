import adapter from '@sveltejs/adapter-auto';
import { windi } from "svelte-windicss-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		windi({
			devTools: { enabled: true }
		})
	],
	kit: {
		adapter: adapter()
	}
};

export default config;
