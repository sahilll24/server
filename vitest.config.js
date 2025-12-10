import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: ['default', 'junit'],        // 🔥 Jenkins
    outputFile: './backend-tests.xml',      // 🔥 Jenkins
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html' , 'lcov'],
      exclude: [
        'node_modules/',
        '__tests__/',
        '**/*.test.js',
        '**/*.config.js',
      ],
    },
  },
});
