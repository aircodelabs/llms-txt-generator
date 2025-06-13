/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: 'tsconfig.test.json'
    }]
  },
  // 添加对 ESM 模块的支持
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.\\.?\\/.+)\\.js$': '$1',
  },
  transformIgnorePatterns: [
    // 忽略 node_modules 中的 ESM 模块，让 Jest 能够处理它们
    'node_modules/(?!(mime)/)',
  ],
};