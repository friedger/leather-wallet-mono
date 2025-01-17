export const defaultVitestUnitTestingConfig = {
  test: {
    include: 'src/**/*.spec.{ts,tsx}',
    coverage: {
      reporter: ['text', 'json-summary', 'json', 'html'],
      reportsDirectory: './coverage',
    },
    globals: true,
    environment: 'node',
    deps: { interopDefault: true },
    silent: false,
  },
} as const;
