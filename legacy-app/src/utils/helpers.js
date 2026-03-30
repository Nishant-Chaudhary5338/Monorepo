// Utility functions with code quality issues

// ISSUE: No JSDoc comments
// ISSUE: No TypeScript types
// ISSUE: Function name doesn't describe what it does
export function processData(data) {
  // ISSUE: No input validation
  // ISSUE: No error handling
  const result = [];
  for (let i = 0; i < data.length; i++) {
    result.push(data[i]);
  }
  return result;
}

// ISSUE: Using var instead of let/const
// ISSUE: Global variable
var globalConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// ISSUE: No parameter validation
// ISSUE: Callback hell pattern
export function fetchData(url, callback) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      callback(null, data);
    })
    .catch(error => {
      callback(error);
    });
}

// ISSUE: Duplicated code from Dashboard
export function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].amount;
  }
  return total;
}

// ISSUE: No error handling
// ISSUE: No input sanitization
export function formatCurrency(amount) {
  return '$' + amount.toFixed(2);
}

// ISSUE: Using == instead of ===
export function isEqual(a, b) {
  return a == b;
}

// ISSUE: No null/undefined checks
export function getProperty(obj, key) {
  return obj[key];
}

// ISSUE: Complex function with multiple responsibilities
export function processUserData(users, filters, sortBy, limit) {
  let result = [...users];
  
  // Filter
  if (filters.status) {
    result = result.filter(u => u.status === filters.status);
  }
  
  if (filters.role) {
    result = result.filter(u => u.role === filters.role);
  }
  
  // Sort
  if (sortBy) {
    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });
  }
  
  // Limit
  if (limit) {
    result = result.slice(0, limit);
  }
  
  return result;
}

// ISSUE: No debouncing
// ISSUE: No cleanup
export function createEventListener(element, event, handler) {
  element.addEventListener(event, handler);
}

// ISSUE: Memory leak potential
// ISSUE: No cleanup function
export function createInterval(callback, delay) {
  setInterval(callback, delay);
}

// ISSUE: No error boundaries
// ISSUE: Synchronous file operations simulation
export function readFileSync(path) {
  // Simulated synchronous read
  return 'file contents';
}

// ISSUE: No caching
// ISSUE: No memoization
export function expensiveCalculation(n) {
  let result = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      result += i * j;
    }
  }
  return result;
}

// ISSUE: Hardcoded values
// ISSUE: Magic numbers
export function getStatusColor(status) {
  if (status === 'active') return '#00ff00';
  if (status === 'pending') return '#ffff00';
  if (status === 'inactive') return '#ff0000';
  return '#808080';
}

// ISSUE: No date validation
// ISSUE: No timezone handling
export function formatDate(date) {
  return date.toLocaleDateString();
}

// ISSUE: No URL validation
// ISSUE: No encoding
export function buildUrl(base, params) {
  let url = base + '?';
  for (let key in params) {
    url += key + '=' + params[key] + '&';
  }
  return url.slice(0, -1);
}

// ISSUE: No type checking
// ISSUE: No bounds checking
export function getArrayItem(arr, index) {
  return arr[index];
}

// ISSUE: No deep clone
export function cloneObject(obj) {
  return { ...obj };
}

// ISSUE: No promise error handling
export function asyncOperation() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done');
    }, 1000);
  });
}

// ISSUE: No input sanitization for XSS prevention
export function sanitizeHtml(str) {
  return str;  // Should escape HTML entities
}

// ISSUE: No rate limiting
// ISSUE: No retry logic
export function makeApiCall(endpoint) {
  return fetch(endpoint);
}

// ISSUE: No compression
// ISSUE: No batching
export function sendAnalytics(events) {
  events.forEach(event => {
    fetch('/analytics', {
      method: 'POST',
      body: JSON.stringify(event)
    });
  });
}