import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // Permite conexiones desde cualquier dispositivo en la red local
    port: 5173,  // Puedes cambiar el puerto si es necesario
  },
  assetsInclude: ['**/*.lottie'], // Maneja archivos .lottie
});
