import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPage.css';

const API_URL = import.meta.env.VITE_API_URL;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null); // Track which item is being updated
  const navigate = useNavigate();

  // ── Fetch cart items on mount ──
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/cart`);
      setCartItems(response.data);
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  // ── Update quantity (+ / -) ──
  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(cartItemId);
      await axios.put(`${API_URL}/cart/${cartItemId}`, { quantity: newQuantity });
      setCartItems((prev) =>
        prev.map((item) =>
          item.cart_item_id === cartItemId
            ? { ...item, quantity: newQuantity, item_total: item.price * newQuantity }
            : item
        )
      );
    } catch (err) {
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Remove item from cart ──
  const handleRemoveItem = async (cartItemId) => {
    try {
      setUpdatingId(cartItemId);
      await axios.delete(`${API_URL}/cart/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId));
    } catch (err) {
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Price Calculations ──
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  // Simulate discount (10% off)
  const discount = Math.round(totalPrice * 0.1);
  const deliveryCharge = totalPrice > 500 ? 0 : 40;
  const finalAmount = totalPrice - discount + deliveryCharge;

  // ── Loading Skeleton ──
  if (isLoading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-left">
            <div className="cart-header-bar">
              <h2>My Cart</h2>
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="cart-item-skeleton">
                <div className="cart-sk-image shimmer-cart"></div>
                <div className="cart-sk-details">
                  <div className="cart-sk-line cart-sk-title shimmer-cart"></div>
                  <div className="cart-sk-line cart-sk-price shimmer-cart"></div>
                  <div className="cart-sk-line cart-sk-qty shimmer-cart"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-right">
            <div className="price-skeleton shimmer-cart"></div>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty Cart ──
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div className="cart-empty-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#e0e0e0" strokeWidth="1">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 1.99 1.61h9.72a2 2 0 0 0 1.99-1.61L23 6H6" />
            </svg>
          </div>
          <h2 className="cart-empty-title">Your cart is empty!</h2>
          <p className="cart-empty-text">Add items to it now.</p>
          <Link to="/" className="cart-empty-btn">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* ════════════════════════════════════════════
            LEFT COLUMN — Cart Items
           ════════════════════════════════════════════ */}
        <div className="cart-left">
          {/* Header */}
          <div className="cart-header-bar">
            <h2>My Cart ({totalItems})</h2>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div key={item.cart_item_id} className="cart-item">
              {/* Image */}
              <div className="cart-item-image">
                <Link to={`/product/${item.product_id}`}>
                  <img
                    src={
                      Array.isArray(item.image_urls) && item.image_urls.length > 0
                        ? item.image_urls[0]
                        : item.image_url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                    }
                    alt={item.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'; }}
                  />
                </Link>
              </div>

              {/* Details */}
              <div className="cart-item-details">
                <Link to={`/product/${item.product_id}`} className="cart-item-name">
                  {item.name}
                </Link>

                {/* Price */}
                <div className="cart-item-price-row">
                  <span className="cart-item-original">
                    ₹{Math.round(parseFloat(item.price) * 1.2).toLocaleString('en-IN')}
                  </span>
                  <span className="cart-item-final">
                    ₹{Number(item.price).toLocaleString('en-IN')}
                  </span>
                  <span className="cart-item-discount">20% off</span>
                </div>

                {/* Delivery */}
                <p className="cart-item-delivery">
                  Delivery by 3–5 days | <span className="free-delivery">Free</span>
                </p>

                {/* Quantity Controller + Remove */}
                <div className="cart-item-actions">
                  <div className="quantity-controller">
                    <button
                      className="qty-btn qty-minus"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || updatingId === item.cart_item_id}
                    >
                      −
                    </button>
                    <span className="qty-value">
                      {updatingId === item.cart_item_id ? '...' : item.quantity}
                    </span>
                    <button
                      className="qty-btn qty-plus"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.quantity + 1)}
                      disabled={updatingId === item.cart_item_id}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemoveItem(item.cart_item_id)}
                    disabled={updatingId === item.cart_item_id}
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Place Order Button (bottom of items — mobile) */}
          <div className="cart-order-bar-mobile">
            <button className="cart-place-order-btn" onClick={() => navigate('/checkout')}>
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT COLUMN — Price Summary
           ════════════════════════════════════════════ */}
        <div className="cart-right">
          <div className="price-details-card">
            <h3 className="price-details-title">PRICE DETAILS</h3>

            <div className="price-details-rows">
              <div className="price-row">
                <span>Price ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span className="price-green">− ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="price-green">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>
            </div>

            <div className="price-total-row">
              <span>Total Amount</span>
              <span>₹{Math.round(finalAmount).toLocaleString('en-IN')}</span>
            </div>

            <p className="price-savings">
              You will save ₹{discount.toLocaleString('en-IN')} on this order
            </p>

            <button className="cart-place-order-btn" onClick={() => navigate('/checkout')}>
              PLACE ORDER
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
