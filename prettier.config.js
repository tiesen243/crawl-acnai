/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | SortImportsConfig  } */
const config = {
  /* General Prettier Config */
  semi: false,
  tabWidth: 2,
  printWidth: 90,
  singleQuote: true,
  trailingComma: 'all',

  plugins: ['@ianvs/prettier-plugin-sort-imports'],

  importOrder: [
    '<TYPES>',
    '<THIRD_PARTY_MODULES>',
    '',
    '<TYPES>^(@/(.*)$)',
    '<TYPES>^[.|..]',
    '^@/',
    '^[../]',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrderTypeScriptVersion: '4.4.0',
}

export default config
