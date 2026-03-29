import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useWishlist from '../hooks/useWishlist';
import './WishlistCard.css';

const WishlistCard = ({ product, onRemoveSuccess }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [wishlisted, toggleWishlist] = useWishlist(product.id);

  const images = Array.isArray(product.image_urls) ? product.image_urls : [product.image_url];
  const imageUrl = images[0] || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
  
  const price = Number(product.price);
  const discountPct = Number(product.discount_percentage) || 0;
  const originalPrice = discountPct > 0 ? Math.round(price / (1 - discountPct / 100)) : price;

  const handleRemove = async () => {
    await toggleWishlist();
    setShowDeleteConfirm(false);
    if (onRemoveSuccess) {
      onRemoveSuccess(product.id);
    }
  };

  return (
    <div className="wishlist-card">
      <div className="wc-image-container">
        <Link to={`/product/${product.id}`}>
          <img 
            src={imageUrl} 
            alt={product.title} 
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'; }}
          />
        </Link>
      </div>

      <div className="wc-details">
        <Link to={`/product/${product.id}`} className="wc-title">
          {product.title}
        </Link>
        <div className="wc-assured">
          <img 
            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
            alt="Flipkart Assured" 
          />
        </div>
        <div className="wc-price-row">
          <span className="wc-final-price">₹{price.toLocaleString('en-IN')}</span>
          {discountPct > 0 && (
            <span className="wc-original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
          )}
          {discountPct > 0 && (
            <span className="wc-discount-pct">{discountPct}% off</span>
          )}
        </div>
      </div>

      <div className="wc-actions">
        <svg 
          className="wc-delete-icon" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/>
        </svg>

        {showDeleteConfirm && (
          <div className="wc-delete-popover">
            <div className="wc-popover-triangle"></div>
            <div className="wc-popover-content">
              <p className="wc-popover-text">Are you sure you want to remove this product?</p>
              <div className="wc-popover-actions">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="wc-btn-cancel"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleRemove}
                  className="wc-btn-remove"
                >
                  YES, REMOVE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistCard;
