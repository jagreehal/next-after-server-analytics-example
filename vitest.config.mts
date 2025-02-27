import viteTsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { defineConfig, ViteUserConfig } from 'vitest/config';

export default defineConfig({
  plugins: [viteTsconfigPaths(), react()] as ViteUserConfig['plugins'],
  test: {
    globals: true,
    reporters: ['verbose'],
    environment: 'node',
  },
});
