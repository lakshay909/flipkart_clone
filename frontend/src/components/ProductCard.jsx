import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const {
    id,
    title: name,
    price,
    image_urls,
    image_url,
    category,
  } = product;

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, toggleWishlist] = useWishlist(id);

  // ── Yeh raha magic function jo page redirect hone se rokega ──
  const handleWishlistClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    toggleWishlist(); // Uske baad tera custom hook call hoga
  };

  // Handle image_urls as array OR image_url as string (backwards compatible)
  const productImage =
    (Array.isArray(image_urls) && image_urls.length > 0)
      ? image_urls[0]
      : image_url || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';

  // Calculate a fake original price (15-30% higher) for the strikethrough effect
  const discountPercent = useMemo(() => Math.floor(Math.random() * 16) + 15, [product.id]);
  const originalPrice = useMemo(() => Math.round(price / (1 - discountPercent / 100)), [price, discountPercent]);

  // Generate a fake rating between 3.5 and 5.0
  const rating = useMemo(() => (Math.random() * 1.5 + 3.5).toFixed(1), [product.id]);
  const ratingCount = useMemo(() => Math.floor(Math.random() * 5000) + 100, [product.id]);

  return (
    <Link to={`/product/${id}`} className="product-card">
      {/* ── Product Image with Skeleton Loader ── */}
      <div className="product-card-image-wrapper">
        
        {/* Wishlist Heart */}
        <button
          className={`pc-wishlist-btn ${wishlisted ? 'pc-wishlisted' : ''}`}
          onClick={handleWishlistClick} // <-- Yahan function replace kar diya hai
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Skeleton shimmer — visible while image is loading */}
        {!imgLoaded && !imgError && (
          <div className="product-card-skeleton">
            <div className="skeleton-shimmer" />
          </div>
        )}

        {/* Actual image — hidden until loaded, then fades in */}
        <img
          src={productImage}
          alt={name}
          className={`product-card-image ${imgLoaded ? 'img-loaded' : 'img-loading'}`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
            setImgError(true);
            setImgLoaded(true);
          }}
        />
      </div>

      {/* ── Product Info ── */}
      <div className="product-card-info">
        {/* Title */}
        <h3 className="product-card-title">{name}</h3>

        {/* Rating Badge */}
        <div className="product-card-rating">
          <span className="rating-badge">
            {rating} ★
          </span>
          <span className="rating-count">({ratingCount.toLocaleString()})</span>
        </div>

        {/* Price Section */}
        <div className="product-card-price">
          <span className="current-price">₹{Number(price).toLocaleString('en-IN')}</span>
          <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
          <span className="discount-percent">{discountPercent}% off</span>
        </div>

        {/* Category Tag */}
        {category && (
          <span className="product-card-category">{category}</span>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;