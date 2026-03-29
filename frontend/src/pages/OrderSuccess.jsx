import { useParams, Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="order-success-page">
      <div className="order-success-card">
        {/* ── Green Checkmark ── */}
        <div className="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="#388e3c" strokeWidth="3" fill="#f0faf0" />
            <path
              d="M24 42 L34 52 L56 30"
              stroke="#388e3c"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              className="success-check-path"
            />
          </svg>
        </div>

        {/* ── Success Message ── */}
        <h1 className="success-title">Order Placed Successfully!</h1>
        <p className="success-subtitle">Thank you for your order</p>

        {/* ── Order ID ── */}
        <div className="success-order-id-box">
          <span className="success-order-label">Order ID</span>
          <span className="success-order-id">#{orderId}</span>
        </div>

        {/* ── Info Text ── */}
        <p className="success-info">
          Your order has been placed and will be delivered within <strong>3–5 business days</strong>.
          You will receive an email confirmation shortly.
        </p>

        {/* ── Action Buttons ── */}
        <div className="success-actions">
          <Link to="/" className="success-btn success-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
