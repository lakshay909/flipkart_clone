import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CheckoutPage.css';

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  // Address form state
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    pincode: '',
    fullAddress: '',
  });

  // ── Fetch cart items ──
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/cart`);
        setCartItems(response.data);

        // Redirect if cart is empty
        if (response.data.length === 0) {
          navigate('/cart');
        }
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  // ── Price Calculations ──
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const discount = Math.round(totalPrice * 0.1);
  const deliveryCharge = totalPrice > 500 ? 0 : 40;
  const finalAmount = totalPrice - discount + deliveryCharge;

  // ── Form Validation ──
  const validate = () => {
    const newErrors = {};
    if (!address.name.trim()) newErrors.name = 'Name is required';
    if (!address.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(address.phone.trim()))
      newErrors.phone = 'Enter a valid 10-digit phone number';
    if (!address.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(address.pincode.trim()))
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    if (!address.fullAddress.trim())
      newErrors.fullAddress = 'Full address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Handle input change ──
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
    // Clear error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ── Place Order ──
  const handlePlaceOrder = async () => {
    if (!validate()) return;

    const shippingAddress = `${address.name}, ${address.fullAddress}, ${address.pincode}, Phone: ${address.phone}`;

    try {
      setIsPlacingOrder(true);
      const response = await axios.post(`${API_URL}/orders`, {
        total_amount: Math.round(finalAmount),
        shipping_address: shippingAddress,
      });

      const orderId = response.data.id || response.data.order_id || response.data.orderId;
      navigate(`/order-success/${orderId}`);
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-left">
            <div className="checkout-section-card">
              <h2 className="checkout-section-title">Delivery Address</h2>
              <div className="ck-skeleton shimmer-ck" style={{ height: 300 }}></div>
            </div>
          </div>
          <div className="checkout-right">
            <div className="ck-skeleton shimmer-ck" style={{ height: 400 }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        {/* ════════════════════════════════════════════
            LEFT COLUMN — Delivery Address
           ════════════════════════════════════════════ */}
        <div className="checkout-left">
          <div className="checkout-section-card">
            <div className="checkout-step-header">
              <span className="checkout-step-badge">1</span>
              <h2 className="checkout-section-title">DELIVERY ADDRESS</h2>
            </div>

            <div className="checkout-form">
              {/* Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                  placeholder="Enter your full name"
                  value={address.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? 'form-input-error' : ''}`}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={address.phone}
                  onChange={handleChange}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label className="form-label" htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className={`form-input ${errors.pincode ? 'form-input-error' : ''}`}
                  placeholder="6-digit pincode"
                  maxLength={6}
                  value={address.pincode}
                  onChange={handleChange}
                />
                {errors.pincode && <span className="form-error">{errors.pincode}</span>}
              </div>

              {/* Full Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="fullAddress">
                  Full Address (House No, Building, Street, Area) *
                </label>
                <textarea
                  id="fullAddress"
                  name="fullAddress"
                  className={`form-input form-textarea ${errors.fullAddress ? 'form-input-error' : ''}`}
                  placeholder="Enter your complete address"
                  rows={4}
                  value={address.fullAddress}
                  onChange={handleChange}
                />
                {errors.fullAddress && (
                  <span className="form-error">{errors.fullAddress}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            RIGHT COLUMN — Order Summary
           ════════════════════════════════════════════ */}
        <div className="checkout-right">
          {/* Order Items Review */}
          <div className="checkout-section-card">
            <div className="checkout-step-header">
              <span className="checkout-step-badge">2</span>
              <h2 className="checkout-section-title">ORDER SUMMARY</h2>
            </div>

            <div className="checkout-items-list">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="checkout-item">
                  <div className="checkout-item-image">
                    <img
                      src={
                        Array.isArray(item.image_urls) && item.image_urls.length > 0
                          ? item.image_urls[0]
                          : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'
                      }
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                      }}
                    />
                  </div>
                  <div className="checkout-item-info">
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <div className="checkout-item-price">
                    ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Price Details */}
          <div className="checkout-section-card">
            <h3 className="price-details-title-ck">PRICE DETAILS</h3>
            <div className="price-details-rows-ck">
              <div className="price-row-ck">
                <span>Price ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row-ck">
                <span>Discount</span>
                <span className="price-green-ck">− ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row-ck">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? <span className="price-green-ck">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
            </div>
            <div className="price-total-row-ck">
              <span>Total Amount</span>
              <span>₹{Math.round(finalAmount).toLocaleString('en-IN')}</span>
            </div>

            {/* Place Order Button */}
            <button
              className="checkout-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? (
                <>
                  <span className="btn-spinner"></span>
                  PLACING ORDER...
                </>
              ) : (
                'PLACE ORDER'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
