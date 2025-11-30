// .eslintrc.js - Augmented with human-friendly rule docs
module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  ignores: [
    "node_modules",
    "backend/dist",
    "backend/build",
    "frontend/dist",
    "frontend/build",
    "coverage",
    "*.config.js",
    "backend/.env",
    "frontend/.env",
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  rules: {
    "max-lines-per-function": [
      "error",
      {
        max: 30,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    "max-lines": [
      "error",
      {
        max: 200,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    "max-depth": ["error", 3],
    "max-params": ["error", 4],
    complexity: ["error", 10],
    "no-magic-numbers": [
      "error",
      {
        ignore: [-1, 0, 1, 2],
        ignoreArrayIndexes: true,
        enforceConst: true,
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "SwitchStatement[cases.length>5]",
        message:
          "Long switch statement - Use polymorphism instead to follow Open/Closed Principle",
      },
      {
        selector: "IfStatement > IfStatement > IfStatement",
        message:
          "Deeply nested if statements - Use guard clauses or extract conditions",
      },
      {
        selector:
          "IfStatement:has(Alternate[type='IfStatement']):has(Alternate[type='IfStatement']):has(Alternate[type='IfStatement'])",
        message:
          "Long if-else-if chain (4+ levels) - Consider using polymorphism, lookup tables, or extract to separate validation/decision functions",
      },
      {
        selector: "ForStatement",
        message:
          "Avoid for loops - Use functional array methods like .map(), .filter(), .reduce()",
      },
      {
        selector: "ForInStatement",
        message:
          "Avoid for...in loops - Use Object.keys/values/entries with .forEach()",
      },
      {
        selector: "WhileStatement, DoWhileStatement",
        message:
          "Avoid while loops - Use functional array methods or recursion",
      },
    ],
    "no-duplicate-imports": "error",
    "no-unused-vars": [
      "error",
      {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "no-console": ["error", { allow: ["warn", "error"] }],
    "no-debugger": "error",
    "no-alert": "error",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-new-func": "error",
    "max-classes-per-file": ["error", 1],
    "max-nested-callbacks": ["error", 2],
    "prefer-const": "error",
    "no-useless-constructor": "error",
    "no-throw-literal": "error",
    "prefer-promise-reject-errors": "error",
    "consistent-return": "error",
    "default-param-last": "error",
    "dot-notation": "error",
    eqeqeq: ["error", "always"],
    "prefer-arrow-callback": "error",
    "arrow-body-style": ["error", "as-needed"],
    "prefer-template": "error",
    "prefer-spread": "error",
    "prefer-rest-params": "error",
    "no-else-return": "error",
    "no-empty-function": ["error", { allow: ["arrowFunctions"] }],
    "no-underscore-dangle": "warn",
    "no-duplicate-case": "error",
    "no-var": "error", // Enforce let/const
    "prefer-destructuring": [
      "error",
      {
        array: true,
        object: true,
      },
    ],
    "no-multiple-empty-lines": ["error", { max: 2 }],
    "prefer-object-spread": "error",
    "no-return-assign": "error",
    "no-useless-concat": "error",
    "no-useless-return": "error",
  },
  overrides: [
    {
      files: ["**/*.test.*", "**/*.spec.*", "**/test/**"],
      rules: {
        "max-lines-per-function": "off",
        "max-lines": "off",
        "max-params": ["warn", 6],
        "max-depth": ["warn", 4],
        "no-console": "off",
        "no-magic-numbers": "off",
        "max-classes-per-file": "off",
        "no-restricted-syntax": "off",
      },
    },
    {
      files: ["*.config.*", ".*rc.*", "**/config/**"],
      rules: {
        "no-console": "off",
        "no-magic-numbers": "off",
        "max-classes-per-file": "off",
        "no-restricted-syntax": "off",
      },
    },
  ],
  settings: {
    ruleDocs: {
      "max-lines-per-function": {
        why: "Long functions are hard to read, understand, and test. They often do multiple things (violates SRP).",
        howToFix:
          "Break the function into smaller functions, extract helper functions, or move responsibilities to separate modules.",
        example:
          "If a function does parsing + validation + DB calls, extract parsing/validation into separate functions.",
      },
      "max-lines": {
        why: "Large files (God classes) accumulate responsibilities and are hard to maintain (violates SRP/OCP).",
        howToFix:
          "Split the file into smaller modules by responsibility. Group related helpers into a module.",
        example:
          "Move unrelated methods into their own module/class; create smaller service classes.",
      },
      "max-depth": {
        why: "Deep nesting makes control flow hard to follow and increases cognitive load.",
        howToFix:
          "Use guard clauses, early returns, or extract conditions to named functions.",
        example:
          "Replace nested ifs with early returns and small helper functions.",
      },
      "max-params": {
        why: "Long parameter lists indicate functions have too many responsibilities or poor data modeling.",
        howToFix:
          "Group parameters into an options object or a small data structure, or split the function.",
        example:
          "Use a single `options` object: function createUser({name, email, role}) { ... }",
      },
      complexity: {
        why: "High cyclomatic complexity increases chance of bugs and makes code harder to test.",
        howToFix:
          "Refactor complex functions into smaller branches, use polymorphism or strategy pattern.",
        example:
          "Replace a big if/else chain with a map of handlers or separate functions.",
      },
      "no-magic-numbers": {
        why: "Magic numbers hide intent and make code hard to change or read.",
        howToFix:
          "Replace magic numbers with named constants and enforce `const`.",
        example: "const MAX_RETRIES = 3; instead of using 3 directly.",
      },
      "no-restricted-syntax": {
        why: "Certain syntax patterns (deep switch, deep nested if, raw loops) often signal worse design.",
        howToFix:
          "Prefer polymorphism, functional array helpers, guard clauses, or small helpers.",
        example: "Use array.map instead of a for loop for transformation.",
      },
      "no-duplicate-imports": {
        why: "Duplicate imports are redundant and may be error-prone.",
        howToFix:
          "Combine imports from the same module: import {a,b} from 'x';",
      },
      "no-unused-vars": {
        why: "Unused variables indicate leftover code, dead code, or forgotten errors.",
        howToFix:
          "Remove unused vars or prefix intentionally unused args with `_` to document intent.",
      },
      "no-console": {
        why: "Console logs in production can leak data and clutter output.",
        howToFix:
          "Use proper logging libraries or allow only console.warn/error; remove debug logs.",
      },
      "no-debugger": {
        why: "Debugger statements will halt execution in production environments.",
        howToFix: "Remove debugger statements before commit.",
      },
      "no-alert": {
        why: "alert/confirm/prompt are blocking and not suitable for modern UI/UX.",
        howToFix: "Use modal components or non-blocking UI.",
      },
      "no-eval": {
        why: "eval introduces security and performance risks.",
        howToFix: "Avoid eval; use structured parsing or safe interpreters.",
      },
      "no-implied-eval": {
        why: "Passing strings to setTimeout/setInterval implies eval and is unsafe.",
        howToFix: "Pass functions instead of strings.",
      },
      "no-new-func": {
        why: "Function constructor behaves like eval and is unsafe.",
        howToFix: "Define functions directly or use closures.",
      },
      "max-classes-per-file": {
        why: "Multiple classes in one file could indicate low cohesion and harder reuse.",
        howToFix:
          "Keep one class per file unless small tightly-coupled shapes exist.",
      },
      "max-nested-callbacks": {
        why: "Deep callbacks hide control flow and make code maintenance/error handling harder.",
        howToFix: "Use async/await or extract callbacks into named functions.",
      },
      "prefer-const": {
        why: "Prefer const for variables that never change — clarifies intent and prevents reassignment bugs.",
        howToFix: "Change let -> const where variable is not reassigned.",
      },
      "no-useless-constructor": {
        why: "Empty constructors clutter classes and reduce clarity.",
        howToFix:
          "Remove unused constructors or move initialization logic elsewhere.",
      },
      "no-throw-literal": {
        why: "Throwing literals (strings/objects) breaks stack traces and consistent error handling.",
        howToFix:
          "Throw instances of Error (or subclasses): throw new Error('message')",
      },
      "prefer-promise-reject-errors": {
        why: "Rejecting non-Error values makes stack traces and error handling inconsistent.",
        howToFix:
          "Reject with Error instances: return Promise.reject(new Error('...'))",
      },
      "consistent-return": {
        why: "Inconsistent return values from a function are confusing and bug-prone.",
        howToFix:
          "Ensure each code path returns a value of the same type or always returns/never returns.",
      },
      "default-param-last": {
        why: "Default parameters should be last to avoid ambiguity in calls with missing args.",
        howToFix: "Reorder parameters or use options objects.",
      },
      "dot-notation": {
        why: "dot notation is clearer and avoids ambiguous string property access.",
        howToFix: "Use obj.prop instead of obj['prop'] where possible.",
      },
      eqeqeq: {
        why: "Loose equality (`==`) can cause unexpected coercion bugs.",
        howToFix: "Use `===` and `!==` to avoid coercion.",
      },
      "prefer-arrow-callback": {
        why: "Arrow functions avoid confusion with `this` and are more concise.",
        howToFix:
          "Use arrow functions for callbacks where `this` behavior is not needed.",
      },
      "no-else-return": {
        why: "Returning inside an if and using else is redundant and increases nesting.",
        howToFix: "Use early returns and remove the else branch.",
      },
      "no-empty-function": {
        why: "Empty functions often indicate unfinished code or suppressed errors.",
        howToFix:
          "Remove or implement the function; if intentionally empty, add a comment explaining why.",
      },
      "no-underscore-dangle": {
        why: "Leading underscores are a naming convention for private fields but are not enforced.",
        howToFix:
          "Prefer real private fields (if supported) or explicit module scoping; treat underscore names carefully.",
      },
      "no-duplicate-case": {
        why: "Duplicate case labels are logical errors and unreachable code.",
        howToFix: "Remove duplicates and correct control logic.",
      },
    },
  },
};
