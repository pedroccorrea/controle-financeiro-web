import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'vuex': '/node_modules/vuex',
    },
  },
  server: {
    host: '0.0.0.0'
  },
});