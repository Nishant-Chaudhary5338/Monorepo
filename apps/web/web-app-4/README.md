# Web App 4 - MCP Tool Testing

This is a simple e-commerce React + JavaScript application created for testing MCP tools.

## Project Structure

```
apps/web/web-app-4/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.js
└── README.md
```

## Intentional Issues for Testing

### Accessibility Issues
- Missing `alt` attributes on images (logo, product images)
- Using `<div>` instead of semantic HTML (`<header>`, `<main>`, `<footer>`)
- No `aria-label` on interactive elements (buttons, cart icon)
- Form inputs without associated `<label>` elements
- No keyboard navigation support

### Error Handling Issues
- No try-catch blocks for fetch calls (checkout)
- No validation on login form
- No error states displayed to users
- No loading states during async operations

### Code Quality Issues
- No prop validation
- Inline state management (no Redux/Context for complex state)
- No separation of concerns (all in one component)
- No TypeScript types

### Performance Issues
- No lazy loading for images
- Re-rendering entire list on cart updates
- No memoization of expensive calculations

## MCP Tools to Test

### 1. accessibility-checker
Test finding accessibility violations in App.js

### 2. performance-audit
Test finding inline styles, missing optimizations

### 3. component-reviewer
Test reviewing App.js for code quality

### 4. analyze-ui-design
Test analyzing UI patterns

### 5. quality-pipeline
Test overall code quality analysis

## How to Test

1. Use the MCP tools with path: `apps/web/web-app-4/src/`
2. Or target specific file: `apps/web/web-app-4/src/App.js`
3. Review the issues found and compare with the intentional issues listed above

## Test Scenarios

### Scenario 1: E-Commerce Flow
- Login form without validation
- Product listing with missing alt text
- Cart functionality without error handling
- Checkout without confirmation

### Scenario 2: Accessibility Audit
- Run accessibility-checker on the entire src folder
- Should find multiple WCAG violations

### Scenario 3: Code Quality Review
- Run component-reviewer on App.js
- Should suggest splitting into smaller components