import React from 'react';

// Navigation component with accessibility issues
function Navigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="navigation">
      {/* ISSUE: No aria-label for navigation */}
      <div className="nav-container">
        {/* ISSUE: Logo image without alt text */}
        <img src="https://via.placeholder.com/100x40" className="logo" />
        
        {/* ISSUE: Hamburger button without aria-label */}
        {/* ISSUE: No aria-expanded state */}
        <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* ISSUE: Menu without proper role */}
        {/* ISSUE: No keyboard navigation */}
        <ul className={isOpen ? 'open' : ''}>
          {/* ISSUE: Links without proper focus management */}
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
}

// Dropdown menu - no accessibility
export function DropdownMenu({ items }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="dropdown">
      {/* ISSUE: No aria-haspopup */}
      {/* ISSUE: No aria-expanded */}
      <button onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      
      {/* ISSUE: No role="menu" */}
      {/* ISSUE: No arrow key navigation */}
      {/* ISSUE: No focus trap */}
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li key={index}>
              {/* ISSUE: No role="menuitem" */}
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Sidebar navigation - no accessibility
export function Sidebar({ items }) {
  const [activeItem, setActiveItem] = React.useState(0);

  return (
    <aside className="sidebar">
      {/* ISSUE: No aria-label */}
      {/* ISSUE: No aria-current for active item */}
      <ul>
        {items.map((item, index) => (
          <li 
            key={index}
            className={activeItem === index ? 'active' : ''}
            onClick={() => setActiveItem(index)}
          >
            {/* ISSUE: No keyboard support */}
            {/* ISSUE: No focus indicator */}
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Breadcrumb - no accessibility
export function Breadcrumb({ items }) {
  return (
    <div className="breadcrumb">
      {/* ISSUE: No nav element */}
      {/* ISSUE: No aria-label="breadcrumb" */}
      {/* ISSUE: No aria-current for last item */}
      {items.map((item, index) => (
        <span key={index}>
          <a href={item.href}>{item.label}</a>
          {index < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </div>
  );
}

// Tab navigation - no accessibility
export function TabNavigation({ tabs }) {
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="tabs">
      {/* ISSUE: No role="tablist" */}
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={activeTab === index ? 'active' : ''}
            onClick={() => setActiveTab(index)}
          >
            {/* ISSUE: No role="tab" */}
            {/* ISSUE: No aria-selected */}
            {/* ISSUE: No aria-controls */}
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* ISSUE: No role="tabpanel" */}
      {/* ISSUE: No aria-labelledby */}
      <div className="tab-content">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}

export default Navigation;