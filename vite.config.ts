import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: ['public']
		  },
		proxy: {
		  '/api': {
			target: 'http://localhost:3000', // URL de votre serveur backend
			changeOrigin: true,
			secure: false,
		  },
		},
	  },
});
