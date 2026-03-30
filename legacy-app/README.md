# Legacy App - MCP Tool Testing

This is a legacy React + JavaScript application created for testing MCP tools.

## Project Structure

```
legacy-app/
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── App.js
│   ├── components/
│   │   ├── Button.js        ← Accessibility issues
│   │   ├── Card.js          ← Accessibility issues
│   │   ├── Form.js          ← Error handling issues
│   │   ├── Navigation.js    ← Accessibility issues
│   │   └── Dashboard.js     ← Large component, code quality issues
│   ├── utils/
│   │   └── helpers.js       ← Code quality issues
│   └── styles/
│       └── app.css
└── README.md
```

## Intentional Issues for Testing

### Accessibility Issues (Button.js, Card.js, Navigation.js)
- Missing `alt` attributes on images
- Using `<div>` instead of `<button>` for clickable elements
- No `aria-label` attributes
- No keyboard navigation support
- Missing semantic HTML

### Error Handling Issues (Form.js, Dashboard.js)
- No try-catch blocks for async operations
- No validation on form inputs
- No error states displayed to users
- No loading states

### Code Quality Issues (helpers.js, Dashboard.js)
- Using `var` instead of `let/const`
- Duplicated code patterns
- Complex functions with multiple responsibilities
- No JSDoc comments
- No TypeScript types
- Magic numbers
- Callback hell patterns

### Performance Issues
- Inline styles
- No lazy loading
- Large monolithic components
- No memoization

## MCP Tools to Test

### 1. accessibility-checker
Test finding accessibility violations in Button.js, Card.js, Navigation.js

### 2. typescript-enforcer
Test finding issues in helpers.js (would flag patterns if it were TypeScript)

### 3. performance-audit
Test finding inline styles, large components

### 4. component-reviewer
Test reviewing Dashboard.js for code quality

### 5. analyze-ui-design
Test analyzing UI patterns and accessibility

### 6. code-modernizer
Test suggesting modern JavaScript patterns

### 7. quality-pipeline
Test overall code quality analysis

## How to Test

1. Use the MCP tools with path: `legacy-app/src/`
2. Or target specific files: `legacy-app/src/components/Dashboard.js`
3. Review the issues found and compare with the intentional issues listed above