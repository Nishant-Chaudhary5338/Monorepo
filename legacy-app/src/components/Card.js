import React from 'react';

// Card component with various issues
function Card(props) {
  const { title, content } = props;
  
  // ISSUE: No semantic HTML (using div instead of article/section)
  // ISSUE: Missing aria-label for interactive cards
  // ISSUE: No keyboard navigation support
  // ISSUE: Inline styles
  return (
    <div 
      className="card"
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        margin: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      {/* ISSUE: Image without alt text */}
      <img src="https://via.placeholder.com/150" />
      
      <h3>{title || 'Card Title'}</h3>
      <p>{content || 'This is some card content with text.'}</p>
      
      {/* ISSUE: Link without accessible name */}
      <a href="#">Read more</a>
    </div>
  );
}

// Card with click handler - no accessibility
export function ClickableCard({ onClick, children }) {
  // ISSUE: No role="button"
  // ISSUE: No tabIndex
  // ISSUE: No keyboard event handler
  return (
    <div onClick={onClick} className="clickable-card">
      {children}
    </div>
  );
}

// Card with image gallery - accessibility issues
export function ImageCard({ images }) {
  // ISSUE: Multiple images without alt text
  // ISSUE: No aria-label for the gallery
  // ISSUE: No keyboard navigation
  return (
    <div className="image-card">
      {images && images.map((img, index) => (
        <img key={index} src={img.src} />
      ))}
    </div>
  );
}

// Expandable card - no ARIA states
export function ExpandableCard({ expanded, onToggle, children }) {
  // ISSUE: No aria-expanded attribute
  // ISSUE: No aria-controls
  // ISSUE: No keyboard support
  return (
    <div className="expandable-card">
      <div onClick={onToggle}>Toggle</div>
      {expanded && <div className="content">{children}</div>}
    </div>
  );
}

export default Card;