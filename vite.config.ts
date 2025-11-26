import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  root: ".", // ensures Vite knows where frontend root is
  build: {
    rollupOptions: {
      input: "index.html",
    }
  }
});
