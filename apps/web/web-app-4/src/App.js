import React from 'react';

// Simple e-commerce app with issues for testing
function App() {
  const [products, setProducts] = React.useState([
    { id: 1, name: 'Laptop', price: 999, image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Phone', price: 699, image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Tablet', price: 499, image: 'https://via.placeholder.com/200' },
  ]);

  const [cart, setCart] = React.useState([]);
  const [user, setUser] = React.useState(null);

  // ISSUE: No error handling
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // ISSUE: No error handling
  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // ISSUE: No error handling, no validation
  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUser({ name: formData.get('username') });
  };

  // ISSUE: No error handling
  const handleCheckout = () => {
    fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ items: cart })
    });
  };

  return (
    <div className="app">
      {/* ISSUE: No header landmark */}
      <div className="header">
        {/* ISSUE: Image without alt */}
        <img src="https://via.placeholder.com/100x40" />
        <h1>Web App 4 - E-Commerce</h1>
        
        {/* ISSUE: No aria-label */}
        <div className="cart-icon">
          <span>Cart ({cart.length})</span>
        </div>
      </div>

      {/* ISSUE: No main landmark */}
      <div className="content">
        {/* Login Form */}
        {!user && (
          <form onSubmit={handleLogin}>
            {/* ISSUE: No label */}
            <input type="text" name="username" placeholder="Username" />
            <input type="password" name="password" placeholder="Password" />
            <button>Login</button>
          </form>
        )}

        {/* Products */}
        <section>
          <h2>Products</h2>
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                {/* ISSUE: No alt text */}
                <img src={product.image} />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                {/* ISSUE: No aria-label */}
                <button onClick={() => addToCart(product)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </section>

        {/* Cart */}
        {cart.length > 0 && (
          <section>
            <h2>Shopping Cart</h2>
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                  {/* ISSUE: No aria-label */}
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <p>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</p>
              <button onClick={handleCheckout}>Checkout</button>
            </div>
          </section>
        )}

        {/* User Profile */}
        {user && (
          <section>
            <h2>Welcome, {user.name}!</h2>
            <p>You are logged in.</p>
          </section>
        )}
      </div>

      {/* ISSUE: No footer landmark */}
      <div className="footer">
        <p>&copy; 2024 Web App 4</p>
      </div>
    </div>
  );
}

export default App;