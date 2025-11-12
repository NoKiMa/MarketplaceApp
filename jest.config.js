module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],
  transformIgnorePatterns: [
    'node_modules/(?!(?:' +
      [
        '@react-native',
        'react-native',
        'expo',
        '@expo',
        'expo-modules-core',
        'react-navigation',
        '@react-navigation',
        'react-redux',
        'uuid', 
        '@reduxjs/toolkit', 
        'immer',            
      ].join('|') +
      ')/)',
  ],
 moduleNameMapper: {
    '^react-native-get-random-values$': '<rootDir>/__mocks__/react-native-get-random-values.js',
  },
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
