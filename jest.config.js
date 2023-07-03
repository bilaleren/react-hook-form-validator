/** @type {import('@jest/types').Config} */
const config = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts', 'tsx', 'json'],
  rootDir: './src',
  testRegex: '.*\\.test\\.ts(x)?$',
  transform: {
    '^.+\\.ts(x)?$': [
      'ts-jest',
      {
        isolatedModules: true
      }
    ]
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [require.resolve('./setupTests.js')]
}

module.exports = config
