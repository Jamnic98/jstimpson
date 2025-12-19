import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
  },
  setupFilesAfterEnv: ['./src/support/jest.setup.ts'],
  setupFiles: ['./src/support/environment.ts'],
  testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(customJestConfig)
