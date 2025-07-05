const json = require("@eslint/json");

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  {
    files: ["**/*.json"],
    plugins: {
      json,
    },
    languageOptions: {
      parser: json.parser,
    },
  },
];
