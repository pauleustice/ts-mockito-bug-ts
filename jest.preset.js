const nxPreset = require('@nrwl/jest/preset').default;
const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('./tsconfig.base.json');

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  coverageReporters: [ 'json-summary', 'text-summary', 'html' ],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      isolatedModules: true,
    },
  },
  moduleDirectories: [ 'node_modules', '<rootDir>/src' ],
  moduleFileExtensions: ['ts', 'js', 'html', 'json', 'json5' ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    // Required since some transitive dependencies use lodash
    '^lodash-es$': 'lodash',
  },
  modulePaths: [ '<rootDir>', './' ],
  resolver: '@nrwl/jest/plugins/resolver',
  setupFilesAfterEnv: [ '<rootDir>/src/test-setup.ts', 'jest-canvas-mock' ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  testEnvironment: 'jsdom',
  testMatch: [ '<rootDir>/src/**/?(*.)+(spec).ts?(x)' ],
  testRunner: 'jest-jasmine2',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
    '^.+\\.json5$': 'json5-jest',
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
};
