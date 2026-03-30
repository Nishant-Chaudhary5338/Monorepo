import React from 'react';
import Button from './components/Button';
import Card from './components/Card';
import Form from './components/Form';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';

// Legacy app with intentional issues for testing MCP tools
function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="app">
      <Navigation />
      <main>
        <h1>Legacy Application</h1>
        <p>Welcome to the legacy app for testing MCP tools</p>
        
        <section>
          <h2>Buttons</h2>
          <Button onClick={handleClick} />
          <Button onClick={handleClick} />
          <Button onClick={handleClick} />
        </section>

        <section>
          <h2>Cards</h2>
          <div className="card-container">
            <Card />
            <Card />
            <Card />
          </div>
        </section>

        <section>
          <h2>Form</h2>
          <Form />
        </section>

        <section>
          <h2>Dashboard</h2>
          <Dashboard />
        </section>
      </main>
    </div>
  );
}

export default App;