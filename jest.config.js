module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@mocks/(.*)$': '<rootDir>/tests/mocks/$1',
  },
}
