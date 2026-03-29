import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errors, setErrors] = useState({});

  // ── STEP STATE: 1 = Address, 2 = Order Review ──
  const [currentStep, setCurrentStep] = useState(1);

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

  // ── Continue to Order Summary (Step 2) ──
  const handleContinue = () => {
    if (!validate()) return;
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Go back to Address (Step 1) ──
  const handleBack = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Place Order (Final) ──
  const handlePlaceOrder = async () => {
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
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // ── Get image source helper ──
  const getImageSrc = (item) => {
    if (Array.isArray(item.image_urls) && item.image_urls.length > 0) return item.image_urls[0];
    return 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
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

  // ══════════════════════════════════════════════════════════════════════════════
  //  STEP INDICATOR BAR
  // ══════════════════════════════════════════════════════════════════════════════
  const StepIndicator = () => (
    <div className="ck-step-indicator">
      <div className={`ck-step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <span className="ck-step-num">{currentStep > 1 ? '✓' : '1'}</span>
        <span className="ck-step-label">DELIVERY ADDRESS</span>
      </div>
      <div className="ck-step-line"></div>
      <div className={`ck-step-item ${currentStep >= 2 ? 'active' : ''}`}>
        <span className="ck-step-num">2</span>
        <span className="ck-step-label">ORDER SUMMARY</span>
      </div>
      <div className="ck-step-line"></div>
      <div className="ck-step-item">
        <span className="ck-step-num">3</span>
        <span className="ck-step-label">PAYMENT</span>
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  //  PRICE DETAILS CARD (Shared between steps)
  // ══════════════════════════════════════════════════════════════════════════════
  const PriceDetailsCard = ({ buttonLabel, onButtonClick, isDisabled, isSpinning }) => (
    <div className="checkout-section-card ck-price-card">
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
      <div className="ck-savings-bar">
        You will save ₹{discount.toLocaleString('en-IN')} on this order
      </div>
      <button
        className="checkout-place-order-btn"
        onClick={onButtonClick}
        disabled={isDisabled}
      >
        {isSpinning ? (
          <>
            <span className="btn-spinner"></span>
            PLACING ORDER...
          </>
        ) : (
          buttonLabel
        )}
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="checkout-page">

      {/* Step Indicator */}
      <StepIndicator />

      <div className="checkout-container">

        {/* ════════════════════════════════════════════
            STEP 1: DELIVERY ADDRESS
           ════════════════════════════════════════════ */}
        {currentStep === 1 && (
          <>
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

            {/* Right Column — Price Details + Continue */}
            <div className="checkout-right">
              <PriceDetailsCard
                buttonLabel="CONTINUE"
                onButtonClick={handleContinue}
                isDisabled={false}
                isSpinning={false}
              />
            </div>
          </>
        )}

        {/* ════════════════════════════════════════════
            STEP 2: ORDER SUMMARY REVIEW
           ════════════════════════════════════════════ */}
        {currentStep === 2 && (
          <>
            <div className="checkout-left">

              {/* ── Delivery Address Confirmation ── */}
              <div className="checkout-section-card">
                <div className="checkout-step-header ck-step-done-header">
                  <span className="checkout-step-badge ck-badge-done">✓</span>
                  <h2 className="checkout-section-title">DELIVERY ADDRESS</h2>
                  <button className="ck-change-btn" onClick={handleBack}>CHANGE</button>
                </div>
                <div className="ck-address-confirm">
                  <div className="ck-address-name">
                    {address.name}
                    <span className="ck-address-tag">HOME</span>
                    <span className="ck-address-pincode">{address.pincode}</span>
                  </div>
                  <p className="ck-address-full">{address.fullAddress}</p>
                  <p className="ck-address-phone">{address.phone}</p>
                </div>
              </div>

              {/* ── Order Items Review ── */}
              <div className="checkout-section-card">
                <div className="checkout-step-header">
                  <span className="checkout-step-badge">2</span>
                  <h2 className="checkout-section-title">ORDER SUMMARY</h2>
                </div>

                <div className="ck-order-items">
                  {cartItems.map((item) => (
                    <div key={item.cart_item_id} className="ck-review-item">
                      {/* Image */}
                      <div className="ck-review-img">
                        <img
                          src={getImageSrc(item)}
                          alt={item.name}
                          onError={handleImageError}
                        />
                      </div>

                      {/* Details */}
                      <div className="ck-review-details">
                        <p className="ck-review-name">{item.name}</p>
                        <p className="ck-review-seller">Seller: Flipkart Assured</p>

                        {/* Price row */}
                        <div className="ck-review-price-row">
                          <span className="ck-review-original">
                            ₹{Math.round(parseFloat(item.price) * 1.2).toLocaleString('en-IN')}
                          </span>
                          <span className="ck-review-final">
                            ₹{Number(item.price).toLocaleString('en-IN')}
                          </span>
                          <span className="ck-review-off">20% off</span>
                        </div>

                        <div className="ck-review-qty-delivery">
                          <span className="ck-review-qty">Qty: {item.quantity}</span>
                          <span className="ck-review-delivery-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Delivery by 3–5 days
                          </span>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="ck-review-total">
                        ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order confirmation bar at bottom of items */}
                <div className="ck-confirm-bar">
                  <p className="ck-confirm-text">
                    Order confirmation email will be sent to your registered email address.
                  </p>
                  <button
                    className="ck-confirm-btn-inline"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <span className="btn-spinner"></span>
                        PLACING ORDER...
                      </>
                    ) : (
                      'CONFIRM ORDER'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column — Price Details + Confirm Order */}
            <div className="checkout-right">
              <PriceDetailsCard
                buttonLabel="CONFIRM ORDER"
                onButtonClick={handlePlaceOrder}
                isDisabled={isPlacingOrder}
                isSpinning={isPlacingOrder}
              />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default CheckoutPage;
