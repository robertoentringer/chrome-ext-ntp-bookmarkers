module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "prettier/prettier": ["error", { semi: false, printWidth: 100 }],
    "comma-dangle": ["error", "never"]
  },
  globals: {
    chrome: "readonly"
  }
}
