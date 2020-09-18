module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@mocks/(.*)$': '<rootDir>/test/mocks/$1',
  },
}
