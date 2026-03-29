import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useWishlist from '../hooks/useWishlist';
import './ProductDetail.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [wishlisted, toggleWishlist] = useWishlist(id);

  const rating = useMemo(() =>
    product?.id ? (Math.random() * 1.5 + 3.5).toFixed(1) : "0.0",
  [product?.id]);

  const ratingCount = useMemo(() =>
    product?.id ? Math.floor(Math.random() * 5000) + 100 : 0,
  [product?.id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/products/${id}`);
        setProduct(response.data);
        setError(null);

        const allRes = await axios.get(`${API_URL}/products`);
        const similar = allRes.data
          .filter((p) => p.category === response.data.category && p.id !== response.data.id)
          .slice(0, 10);
        setSimilarProducts(similar);
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await axios.post(`${API_URL}/cart`, { product_id: product.id, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await axios.post(`${API_URL}/cart`, { product_id: product.id, quantity: 1 });
      navigate('/cart');
    } catch (err) {
      alert('Something went wrong. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="pd-page">
        <div className="pd-skeleton-container">
          <div className="pd-skeleton-left">
            <div className="pd-sk-img-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="pd-sk-img-cell shimmer-pd" />
              ))}
            </div>
          </div>
          <div className="pd-skeleton-right">
            <div className="pd-sk-line pd-sk-w60 shimmer-pd" />
            <div className="pd-sk-line pd-sk-w90 pd-sk-h20 shimmer-pd" />
            <div className="pd-sk-line pd-sk-w40 pd-sk-h28 shimmer-pd" />
            <div className="pd-sk-block shimmer-pd" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-error">
        <h2>😔 {error || 'Product not found'}</h2>
        <Link to="/" className="pd-error-btn">Back to Home</Link>
      </div>
    );
  }

  const images = Array.isArray(product.image_urls) ? product.image_urls : [product.image_url];
  const price = Number(product.price);
  const discountPct = Number(product.discount_percentage) || 0;
  const originalPrice = discountPct > 0 ? Math.round(price / (1 - discountPct / 100)) : price;
  const bankOfferPrice = Math.round(price * 0.95);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="pd-page">
      <div className="pd-main-grid">
        <div className="pd-left-col">
          <button
            className={`pd-float-btn ${wishlisted ? 'pd-float-wishlisted' : ''}`}
            onClick={toggleWishlist}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <div className="pd-img-flex-wrapper">
            <div className="pd-img-thumbnails">
              {images.map((url, idx) => (
                <div className="pd-img-thumbnail-cell" key={idx}>
                  <img src={url} alt={`${product.title} ${idx + 1}`} className="pd-img-thumbnail" />
                </div>
              ))}
              {images.length < 4 && Array.from({ length: 4 - images.length }).map((_, i) => (
                <div className="pd-img-thumbnail-cell pd-img-placeholder" key={`ph-${i}`}>
                  <span>No Image</span>
                </div>
              ))}
            </div>

            <div className="pd-main-img-cell">
              <img
                src={images[0] || ''}
                alt={product.title}
                className="pd-main-photo"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
                }}
              />
            </div>
          </div>
        </div>

        <div className="pd-right-col">
          <h1 className="pd-title">
            {product.title}
            <Link to="/" className="pd-more-link">...more</Link>
          </h1>

          <div className="pd-rating-row">
            <span className="pd-rating-badge">{rating} ★</span>
            <span className="pd-rating-count">{ratingCount.toLocaleString()} Ratings & 40 Reviews</span>
          </div>

          <div className="pd-special-price-badge">Special price</div>
          <div className="pd-price-block">
            <span className="pd-final-price">₹{price.toLocaleString('en-IN')}</span>
            {discountPct > 0 && (
              <>
                <span className="pd-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="pd-discount-pct">{discountPct}% off</span>
              </>
            )}
          </div>

          <div className="pd-offers-section">
            <h3 className="pd-section-subheading">Available offers</h3>
            <div className="pd-offers-list">
              <div className="pd-offer-item">
                <span className="pd-offer-icon">🏷️</span>
                <span><strong className="pd-offer-discount">₹68 off</strong> for Flipkart Axis Bank Credit Card Holders. <span className="pd-apply-link">Apply</span></span>
              </div>
              <div className="pd-offer-item">
                <span className="pd-offer-icon">🏷️</span>
                <span><strong className="pd-offer-discount">₹1,190 cashback</strong> on the first product order over ₹2,499. <span className="pd-apply-link">Apply</span></span>
              </div>
              <div className="pd-offer-item">
                <span className="pd-offer-icon">🏷️</span>
                <span><strong className="pd-offer-discount">₹2,000 instant discount</strong> on Flipkart SBM Bank Credit Card. <span className="pd-apply-link">Apply</span></span>
              </div>
              <div className="pd-offer-item">
                <span className="pd-offer-icon">🏷️</span>
                <span><strong className="pd-offer-discount">No Cost EMI</strong> on Bajaj Finserv EMI Card. <span className="pd-apply-link">Apply</span></span>
              </div>
            </div>
          </div>

          <div className="pd-delivery-section">
            <div className="pd-delivery-row">
              <span className="pd-del-icon">📍</span>
              <span className="pd-del-text">Deliver to — <strong className="pd-del-location">Amritsar 143001</strong></span>
            </div>
            <div className="pd-delivery-row pd-delivery-subtext">
              <span className="pd-del-icon">🚚</span>
              <span className="pd-del-text">Delivery by <strong>{deliveryStr}</strong><span className="pd-free-tag"> | Free</span></span>
            </div>
            <div className="pd-delivery-features">
              <div className="pd-feature-pill">🔄 7 Days Replacement</div>
              <div className="pd-feature-pill">💵 Cash on Delivery</div>
              <div className="pd-feature-pill pd-feature-assured">
                <img
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                  alt="Flipkart Assured"
                  className="pd-assured-img"
                  onError={(e) => { e.target.style.display = 'none'; }}
                /> Flipkart Assured
              </div>
            </div>
          </div>

          <div className="pd-accordion">
            <button className="pd-accordion-header" onClick={() => setShowDetails(!showDetails)}>
              <div>
                <strong>All details</strong>
                <p className="pd-accordion-sub">Features, description and more</p>
              </div>
              <span className={`pd-chevron ${showDetails ? 'pd-chevron-up' : ''}`}>›</span>
            </button>
            {showDetails && (
              <div className="pd-accordion-body">
                <p className="pd-desc-text">{product.description || 'Premium Quality Product.'}</p>
                <table className="pd-specs-table">
                  <tbody>
                    <tr><td>Category</td><td>{product.category || 'Electronics'}</td></tr>
                    <tr><td>Stock</td><td>{product.stock_quantity > 0 ? `${product.stock_quantity} units` : 'Out of Stock'}</td></tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="pd-accordion">
            <button className="pd-accordion-header" onClick={() => setShowQA(!showQA)}>
              <div>
                <strong>Questions and Answers</strong>
                <p className="pd-accordion-sub">No questions and answers available</p>
              </div>
              <span className={`pd-chevron ${showQA ? 'pd-chevron-up' : ''}`}>›</span>
            </button>
            {showQA && (
              <div className="pd-accordion-body">
                <p className="pd-qa-empty">No questions have been asked about this product yet.</p>
              </div>
            )}
          </div>

          <div className="pd-action-btns">
            <button
              className="pd-btn-cart"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? 'Adding...' : 'Add to cart'}
            </button>
            <button className="pd-btn-buy" onClick={handleBuyNow}>
              Buy now at ₹{price.toLocaleString('en-IN')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;