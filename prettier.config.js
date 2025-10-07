module.exports = {
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'avoid',
  overrides: [
    {
      files: ['*.md', '*.mdx'],
      options: {
        // prevent automatic line breaks in markdown files
        printWidth: 999,
        proseWrap: 'never',
      },
    },
  ],
};
