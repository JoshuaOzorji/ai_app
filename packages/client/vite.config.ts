import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],

	cacheDir: "../../node_modules/.vite/client",
	server: {
		proxy: {
			"/api": "http://localhost:3000",
		},
	},
});
