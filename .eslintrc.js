module.exports = {
  env: {
    commonjs: true,
    browser: true,
    es6: true
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  plugins: ["prettier", "html"],
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
