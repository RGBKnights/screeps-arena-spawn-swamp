const modules = ['lodash-es'].join('|');

module.exports = {
  preset: 'ts-jest',
  transform: {
    [`(${modules}).+\\.js$`]: 'babel-jest',
  },
  transformIgnorePatterns: [`/node_modules/(?!${modules})`],
  moduleNameMapper: {
    '^@App/(.*)$': '<rootDir>/src/$1',
  },
};
