module.exports = {
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 8,
    "sourceType": "module"
  },
  "env": {
    "es6": true,
    "browser": true,
    "node": true
  },
  "rules": {
    "no-console": 0,
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  }
};