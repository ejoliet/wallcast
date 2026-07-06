```markdown
# wallcast Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill introduces the core development patterns and workflows used in the `wallcast` JavaScript codebase. It covers coding conventions, commit practices, and repeatable workflows for implementing features and making fixes. The repository is JavaScript-based, with no detected framework, and emphasizes clear, maintainable code and collaborative review cycles.

## Coding Conventions

### File Naming
- Use **camelCase** for filenames.
  - Example: `genKeys.js`, `joinPage.html`

### Import Style
- Use **relative imports** for JavaScript modules.
  ```js
  import { generateKey } from './cryptoUtils.js';
  ```

### Export Style
- Use **named exports**.
  ```js
  // In gen.js
  export function generateKey() { ... }
  ```

### Commit Messages
- Follow **Conventional Commits** style.
  - Prefixes: `feat`, `fix`
  - Example:  
    ```
    feat: add QR code support to join.html
    fix: correct typo in wall.html error message
    ```

## Workflows

### Feature Implementation and Review Cycle
**Trigger:** When developing a new feature or major change, then addressing code review and security findings.  
**Command:** `/feature-cycle`

1. Implement the feature across relevant files (e.g., `README.md`, `join.html`, `keys/gen.js`, `spike.html`, `wall.html`).
2. Commit the initial implementation with a descriptive message:
    ```
    feat: implement user authentication in join.html
    ```
3. Review the code internally or using automated tools (e.g., CodeQL).
4. Address review findings:
    - Fix bugs
    - Improve security
    - Clarify comments
    - Update documentation
5. Commit fixes and improvements:
    ```
    fix: address security findings in gen.js
    ```
6. Repeat review and fixes as needed.

### Multi-file Minor Fix Pass
**Trigger:** When addressing small issues or polishing after initial implementation or review.  
**Command:** `/minor-fix-pass`

1. Identify minor issues or improvements across multiple files (e.g., error messages, comments, warnings).
2. Apply targeted fixes and clarifications in the relevant files (e.g., `join.html`, `keys/gen.js`, `wall.html`).
3. Commit all minor changes together:
    ```
    fix: clarify error messages and update comments
    ```

## Testing Patterns

- **Test File Naming:**  
  - Use `*.test.*` pattern for test files (e.g., `gen.test.js`).
- **Testing Framework:**  
  - Not explicitly detected; follow standard JavaScript testing practices.
- **Example Test File:**
  ```js
  // gen.test.js
  import { generateKey } from './gen.js';

  test('generateKey returns a valid key', () => {
    const key = generateKey();
    expect(key).toBeDefined();
    // Add more assertions as needed
  });
  ```

## Commands

| Command           | Purpose                                                      |
|-------------------|--------------------------------------------------------------|
| /feature-cycle    | Start a feature implementation and review workflow           |
| /minor-fix-pass   | Apply and commit minor fixes across multiple files           |
```
