import React from 'react';

// Large Dashboard component - should be split into smaller components
// This is intentionally a large, monolithic component to test code quality tools
function Dashboard() {
  const [data, setData] = React.useState({
    users: [],
    orders: [],
    products: [],
    stats: {},
    notifications: [],
    recentActivity: []
  });

  const [filters, setFilters] = React.useState({
    dateRange: '7d',
    status: 'all',
    category: 'all'
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Fetch dashboard data - no error handling
  const fetchDashboardData = async () => {
    setLoading(true);
    // ISSUE: No try-catch
    // ISSUE: No error handling
    const usersRes = await fetch('/api/users');
    const users = await usersRes.json();
    
    const ordersRes = await fetch('/api/orders');
    const orders = await ordersRes.json();
    
    const productsRes = await fetch('/api/products');
    const products = await productsRes.json();
    
    const statsRes = await fetch('/api/stats');
    const stats = await statsRes.json();
    
    const notificationsRes = await fetch('/api/notifications');
    const notifications = await notificationsRes.json();
    
    const activityRes = await fetch('/api/activity');
    const activity = await activityRes.json();
    
    setData({
      users: users.data,
      orders: orders.data,
      products: products.data,
      stats: stats.data,
      notifications: notifications.data,
      recentActivity: activity.data
    });
    setLoading(false);
  };

  React.useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate statistics - duplicated logic
  const calculateStats = () => {
    // ISSUE: Duplicated calculation logic
    let totalRevenue = 0;
    let totalOrders = 0;
    let averageOrder = 0;
    
    for (let i = 0; i < data.orders.length; i++) {
      totalRevenue += data.orders[i].amount;
      totalOrders++;
    }
    
    if (totalOrders > 0) {
      averageOrder = totalRevenue / totalOrders;
    }
    
    return { totalRevenue, totalOrders, averageOrder };
  };

  // Filter data - complex logic in component
  const getFilteredData = () => {
    // ISSUE: Complex filtering logic should be extracted
    let filteredOrders = [...data.orders];
    
    if (filters.status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === filters.status);
    }
    
    if (filters.category !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.category === filters.category);
    }
    
    const now = new Date();
    const filterDate = new Date();
    
    switch (filters.dateRange) {
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        filterDate.setDate(now.getDate() - 7);
    }
    
    filteredOrders = filteredOrders.filter(order => 
      new Date(order.date) >= filterDate
    );
    
    return filteredOrders;
  };

  // Handle user actions - no error handling
  const handleDeleteUser = (userId) => {
    // ISSUE: No confirmation dialog
    // ISSUE: No error handling
    // ISSUE: No loading state
    fetch(`/api/users/${userId}`, { method: 'DELETE' });
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));
  };

  const handleUpdateOrderStatus = (orderId, status) => {
    // ISSUE: No error handling
    // ISSUE: No optimistic update
    fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  };

  const handleExportData = () => {
    // ISSUE: No loading state
    // ISSUE: No error handling
    // ISSUE: Large data export without chunking
    const csv = data.orders.map(order => 
      `${order.id},${order.customer},${order.amount},${order.status}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
  };

  // Render helpers - inline, not extracted
  const renderStatCard = (title, value, change) => (
    <div className="stat-card" style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      margin: '10px'
    }}>
      {/* ISSUE: No aria-label */}
      <h3>{title}</h3>
      <p className="value">{value}</p>
      <p className="change">{change}</p>
    </div>
  );

  const renderUserRow = (user) => (
    <tr key={user.id}>
      {/* ISSUE: No scope for table headers */}
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        {/* ISSUE: No aria-label for action buttons */}
        <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
        <button>Edit</button>
      </td>
    </tr>
  );

  const renderOrderCard = (order) => (
    <div className="order-card" style={{
      border: '1px solid #ddd',
      padding: '15px',
      margin: '10px',
      borderRadius: '8px'
    }}>
      {/* ISSUE: No semantic HTML */}
      <p>Order #{order.id}</p>
      <p>Customer: {order.customer}</p>
      <p>Amount: ${order.amount}</p>
      <p>Status: {order.status}</p>
      <select 
        value={order.status}
        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
    </div>
  );

  const renderNotificationItem = (notification) => (
    <div className="notification-item" style={{
      padding: '10px',
      borderBottom: '1px solid #eee'
    }}>
      {/* ISSUE: No role="alert" for notifications */}
      {/* ISSUE: No aria-live region */}
      <p>{notification.message}</p>
      <small>{notification.time}</small>
    </div>
  );

  const renderActivityFeed = () => (
    <div className="activity-feed">
      {/* ISSUE: No aria-label */}
      <h3>Recent Activity</h3>
      {data.recentActivity.map((activity, index) => (
        <div key={index} className="activity-item">
          <p>{activity.description}</p>
          <small>{activity.timestamp}</small>
        </div>
      ))}
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        {/* ISSUE: No aria-busy */}
        {/* ISSUE: No loading announcement */}
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error">
        {/* ISSUE: No role="alert" */}
        <p>Error: {error}</p>
        <button onClick={fetchDashboardData}>Retry</button>
      </div>
    );
  }

  const stats = calculateStats();
  const filteredOrders = getFilteredData();

  return (
    <div className="dashboard">
      {/* ISSUE: No main landmark */}
      {/* ISSUE: No skip navigation */}
      
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        {/* ISSUE: No aria-label for export button */}
        <button onClick={handleExportData}>Export Data</button>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        {/* ISSUE: No aria-label for section */}
        <h2>Statistics</h2>
        <div className="stats-grid">
          {renderStatCard('Total Revenue', `$${stats.totalRevenue}`, '+12%')}
          {renderStatCard('Total Orders', stats.totalOrders, '+8%')}
          {renderStatCard('Average Order', `$${stats.averageOrder.toFixed(2)}`, '+5%')}
          {renderStatCard('Active Users', data.users.length, '+15%')}
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <h2>Filters</h2>
        {/* ISSUE: No label for select */}
        <select 
          value={filters.dateRange}
          onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
        
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </section>

      {/* Users Table */}
      <section className="users-section">
        <h2>Users</h2>
        {/* ISSUE: No caption for table */}
        {/* ISSUE: No aria-label */}
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(renderUserRow)}
          </tbody>
        </table>
      </section>

      {/* Orders Grid */}
      <section className="orders-section">
        <h2>Orders ({filteredOrders.length})</h2>
        <div className="orders-grid">
          {filteredOrders.map(renderOrderCard)}
        </div>
      </section>

      {/* Notifications */}
      <section className="notifications-section">
        <h2>Notifications</h2>
        <div className="notifications-list">
          {data.notifications.map(renderNotificationItem)}
        </div>
      </section>

      {/* Activity Feed */}
      {renderActivityFeed()}

      {/* Products Section */}
      <section className="products-section">
        <h2>Products</h2>
        <div className="products-grid">
          {data.products.map(product => (
            <div key={product.id} className="product-card">
              {/* ISSUE: Image without alt */}
              <img src={product.image} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;