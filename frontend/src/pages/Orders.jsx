import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Orders.css';

// Initial Dummy Data (Will be replaced by API later)
const initialOrders = [
  { id: 'OD123456789', name: 'suntushti Stainless Steel Wall Mounted Hanger', meta: 'Color: Steel', price: 202, supercoins: 0, status: 'delivered', statusLabel: 'Delivered', statusDate: 'Mar 01', year: 2026, shared: null, emoji: '🪝', timeline: [{ title: 'Order Placed', date: 'Feb 26, 2026', done: true }, { title: 'Delivered', date: 'Mar 01, 2026', done: true }], address: '123, Phase 5, Morinda, Punjab', canRate: true, canReturn: true },
  { id: 'OD987654321', name: 'Goelite Wooden Wall Hanging Temple', meta: 'Color: Multicolor', price: 249, supercoins: 0, status: 'delivered', statusLabel: 'Delivered', statusDate: 'Jul 26, 2025', year: 2025, shared: 'Hardik Yadav shared this order', emoji: '🛕', timeline: [{ title: 'Order Placed', date: 'Jul 22, 2025', done: true }, { title: 'Delivered', date: 'Jul 26, 2025', done: true }], address: '123, Phase 5, Morinda, Punjab', canRate: true, canReturn: false },
  { id: 'OD334455667', name: 'boAt Airdopes 141 Bluetooth Earbuds', meta: 'Color: Active Black', price: 999, supercoins: 10, status: 'on-the-way', statusLabel: 'On the way', statusDate: 'Expected Mar 31, 2026', year: 2026, shared: null, emoji: '🎧', timeline: [{ title: 'Order Placed', date: 'Mar 27, 2026', done: true }, { title: 'Out for Delivery', date: 'Expected Mar 31', done: false }], address: '123, Phase 5, Morinda', canRate: false, canReturn: false, canCancel: true },
  { id: 'OD778899001', name: 'Crompton Avancer Prime 1200mm Fan', meta: 'Color: Antique Beige', price: 3299, supercoins: 0, status: 'cancelled', statusLabel: 'Cancelled', statusDate: 'Jan 15, 2025', year: 2025, shared: null, emoji: '💨', timeline: [{ title: 'Order Placed', date: 'Jan 12, 2025', done: true }, { title: 'Cancelled', date: 'Jan 15, 2025', done: true }], address: '123, Phase 5, Morinda', canRate: false, canReturn: false },
  { id: 'OD443322110', name: 'Redmi 13C 5G (Startrail Black)', meta: '128GB Storage', price: 11999, supercoins: 120, status: 'returned', statusLabel: 'Returned', statusDate: 'Dec 02, 2024', year: 2024, shared: null, emoji: '📱', timeline: [{ title: 'Order Placed', date: 'Nov 20, 2024', done: true }, { title: 'Returned', date: 'Dec 02, 2024', done: true }], address: '123, Phase 5, Morinda', canRate: false, canReturn: false },
];

const statusColors = { 'delivered': 'green', 'on-the-way': 'orange', 'cancelled': 'red', 'returned': 'gray' };

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [timeFilters, setTimeFilters] = useState([]);
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ratingOrder, setRatingOrder] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [ratings, setRatings] = useState({}); // Stores ratings locally

  // Filter Logic
  const handleFilterChange = (e, type) => {
    const { value, checked } = e.target;
    const setFilter = type === 'status' ? setStatusFilters : setTimeFilters;
    setFilter(prev => checked ? [...prev, value] : prev.filter(f => f !== value));
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Search match
      const matchesSearch = o.name.toLowerCase().includes(searchQuery.toLowerCase()) || o.id.toLowerCase().includes(searchQuery.toLowerCase());
      // Status match
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(o.status);
      // Time match (Simplified logic)
      let matchesTime = timeFilters.length === 0;
      if (timeFilters.length > 0) {
        if (timeFilters.includes('last30') && o.year === 2026) matchesTime = true;
        if (timeFilters.includes('2025') && o.year === 2025) matchesTime = true;
        if (timeFilters.includes('2024') && o.year === 2024) matchesTime = true;
        if (timeFilters.includes('older') && o.year < 2024) matchesTime = true;
      }
      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [orders, searchQuery, statusFilters, timeFilters]);

  const cancelOrder = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'cancelled', statusLabel: 'Cancelled', canCancel: false } : o));
    setSelectedOrder(null);
    alert('Order Cancelled');
  };

  const submitRating = () => {
    if (ratingValue === 0) return alert('Please select stars');
    setRatings({ ...ratings, [ratingOrder.id]: ratingValue });
    setRatingOrder(null);
    alert('Rating submitted!');
  };

  return (
    <div className="orders-page">
      <div className="orders-breadcrumb">
        <Link to="/">Home</Link> <span>›</span> <Link to="/">My Account</Link> <span>›</span> My Orders
      </div>

      <div className="orders-layout">
        {/* Sidebar */}
        <aside className="orders-sidebar">
          <div className="filter-group">
            <h3>Order Status</h3>
            {['on-the-way', 'delivered', 'cancelled', 'returned'].map(status => (
              <label key={status} className="filter-option">
                <input type="checkbox" value={status} onChange={(e) => handleFilterChange(e, 'status')} />
                {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </label>
            ))}
          </div>
          <div className="filter-group">
            <h3>Order Time</h3>
            {['last30', '2025', '2024', 'older'].map(time => (
              <label key={time} className="filter-option">
                <input type="checkbox" value={time} onChange={(e) => handleFilterChange(e, 'time')} />
                {time === 'last30' ? 'Last 30 days' : time === 'older' ? 'Older' : time}
              </label>
            ))}
          </div>
        </aside>

        {/* Main Panel */}
        <main className="orders-panel">
          <div className="orders-search">
            <input type="text" placeholder="Search your orders here" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg> Search</button>
          </div>

          <div className="orders-list">
            {filteredOrders.length === 0 ? (
              <div className="no-results">📦 No orders found</div>
            ) : (
              filteredOrders.map(o => (
                <div key={o.id} className="order-card" onClick={() => setSelectedOrder(o)}>
                  {o.shared && <div className="shared-badge">{o.shared}</div>}
                  <div className="order-body">
                    <div className="order-img-placeholder">{o.emoji}</div>
                    <div className="order-info">
                      <div className="order-name">{o.name}</div>
                      {o.meta && <div className="order-meta">{o.meta}</div>}
                    </div>
                    <div className="order-price">
                      ₹{o.price.toLocaleString('en-IN')}
                      {o.supercoins > 0 && <div className="supercoins">🪙 {o.supercoins} SuperCoins</div>}
                    </div>
                    <div className="order-status">
                      <div className="status-label">
                        <span className={`status-dot ${statusColors[o.status]}`}></span>
                        {o.statusLabel} on {o.statusDate}
                      </div>
                      <div className="status-sub">Your item has been {o.status === 'on-the-way' ? 'dispatched' : o.status}</div>
                      {o.canRate && (
                        <button className="rate-btn" onClick={(e) => { e.stopPropagation(); setRatingOrder(o); setRatingValue(ratings[o.id] || 0); }}>
                          <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          {ratings[o.id] ? `✓ Rated ${'★'.repeat(ratings[o.id])}` : 'Rate & Review'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fk-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="fk-modal" onClick={e => e.stopPropagation()}>
            <div className="fk-modal-header">
              <h3>Order #{selectedOrder.id}</h3>
              <button className="fk-modal-close" onClick={() => setSelectedOrder(null)}>×</button>
            </div>
            <div className="fk-modal-body">
              <div className="detail-section">
                <h4>Product</h4>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ fontSize: '40px' }}>{selectedOrder.emoji}</div>
                  <div>
                    <div style={{ fontWeight: '500' }}>{selectedOrder.name}</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '4px' }}>₹{selectedOrder.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <h4>Tracking</h4>
                <div className="timeline">
                  {selectedOrder.timeline.map((step, i) => (
                    <div key={i} className={`timeline-step ${step.done ? 'done' : ''}`}>
                      <div className={`step-dot ${step.done ? 'done' : ''}`}></div>
                      <div className="step-info">
                        <div className="step-title">{step.title}</div>
                        <div className="step-date">{step.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="fk-modal-actions">
                {selectedOrder.canCancel && <button className="btn-danger" onClick={() => cancelOrder(selectedOrder.id)}>Cancel Order</button>}
                {selectedOrder.canReturn && <button className="btn-outline">Return</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {ratingOrder && (
        <div className="fk-modal-overlay" onClick={() => setRatingOrder(null)}>
          <div className="fk-modal" onClick={e => e.stopPropagation()}>
            <div className="fk-modal-header">
              <h3>Rate & Review</h3>
              <button className="fk-modal-close" onClick={() => setRatingOrder(null)}>×</button>
            </div>
            <div className="fk-modal-body">
              <p>{ratingOrder.name}</p>
              <div className="stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className={`star ${star <= ratingValue ? 'active' : ''}`} onClick={() => setRatingValue(star)}>★</span>
                ))}
              </div>
              <textarea className="review-textarea" placeholder="Share your experience..."></textarea>
              <div className="fk-modal-actions">
                <button className="btn-primary" onClick={submitRating}>Submit</button>
                <button className="btn-outline" onClick={() => setRatingOrder(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
