import React from 'react';

// Button component with accessibility issues
function Button(props) {
  const { onClick } = props;
  
  // ISSUE: No aria-label or accessible name
  // ISSUE: Using div instead of button element
  // ISSUE: Inline styles (performance issue)
  // ISSUE: No keyboard accessibility
  return (
    <div 
      onClick={onClick}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        display: 'inline-block',
        margin: '5px'
      }}
    >
      Click Me
    </div>
  );
}

// Another button variant with more issues
export function IconButton({ icon }) {
  // ISSUE: No alt text for icon
  // ISSUE: No aria-label
  // ISSUE: Image without alt attribute
  return (
    <div className="icon-button">
      <img src={icon} />  {/* Missing alt attribute */}
    </div>
  );
}

// Button with loading state - no accessibility
export function LoadingButton({ loading, children }) {
  // ISSUE: No aria-busy attribute
  // ISSUE: No loading announcement for screen readers
  return (
    <div className={loading ? 'loading' : ''}>
      {loading ? 'Loading...' : children}
    </div>
  );
}

export default Button;