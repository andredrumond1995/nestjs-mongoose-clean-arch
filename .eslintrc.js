module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier'
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': ['error'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-definitions': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      {
        accessibility: 'explicit',
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'no-return-await': 'error',
    'max-len': [
      'error',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    indent: [
      'off',
      2,
      {
        FunctionDeclaration: { parameters: 'first' },
        FunctionExpression: { parameters: 'first' },
        CallExpression: { arguments: 'first' },
        ArrayExpression: 'first',
        ObjectExpression: 'first',
        ImportDeclaration: 'first',
        ignoredNodes: ['ExpressionStatement > CallExpression > Decorator'],
      },
    ],
    'no-console': 'error',
    'no-param-reassign': 'error',
    'no-redeclare': 'error',
    'no-return-await': 'error',
    'no-duplicate-imports': 'error',
    'default-case': 'error',
    'prefer-template': 'error',
    'prettier/prettier': [
      'error',
      {
        semi: true,
        singleQuote: true,
        trailingComma: 'all',
        printWidth: 120,
        tabWidth: 2,
        useTabs: false,
        endOfLine: 'auto',
      },
    ],
  },
};
