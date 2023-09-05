module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    quotes: ["off", "double"],
    indent: ["off"],
    "quote-props": ["off"],
    "max-len": ["off"],
    "object-curly-spacing": ["off"],
    camelcase: ["off"],
    "space-before-function-paren": ["off"],
  },
  ignorePatterns: ["lib/"],
};
