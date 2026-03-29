import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import HomepageSlider from '../components/HomepageSlider';
import './ProductListing.css';

const API_URL = import.meta.env.VITE_API_URL;

const GADGET_CATS = ['electronics', 'mobiles', 'home appliances'];
const FINDING_CATS = ['fashion', 'beauty', 'sports', 'furniture'];

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        const qs = params.toString();
        const url = qs ? `${API_URL}/products?${qs}` : `${API_URL}/products`;
        const response = await axios.get(url);
        const productData = Array.isArray(response.data) ? response.data : [];
        setProducts(productData);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  // ── Derived filtered arrays (no extra state needed) ──
  const gadgetProducts = useMemo(
    () => products.filter((p) => GADGET_CATS.includes((p.category || '').toLowerCase())),
    [products]
  );

  const findingProducts = useMemo(
    () => products.filter((p) => FINDING_CATS.includes((p.category || '').toLowerCase())),
    [products]
  );

  if (error) {
    return (
      <div className="listing-error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="product-listing-page">
      {/* ── Promotional Banner + Slider (only on unfiltered homepage) ── */}
      {!category && !search && (
        <>
          <div className="promo-banner">
            <div className="promo-banner-content">
              <div className="promo-left">
                <span className="promo-badge">✦ SALE IS LIVE</span>
                <h2 className="promo-headline">Big Billion Days</h2>
                <p className="promo-subtext">Up to 80% Off on Electronics, Fashion & More</p>
              </div>
              <div className="promo-right">
                <div className="promo-offers">
                  <div className="promo-offer-pill">Extra ₹100 Off on UPI</div>
                  <div className="promo-offer-pill">No Cost EMI</div>
                  <div className="promo-offer-pill">Free Delivery</div>
                </div>
              </div>
            </div>
          </div>
          <HomepageSlider />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — Best Gadgets & Appliances
          ═══════════════════════════════════════════════════════ */}
      {!category && !search && !isLoading && gadgetProducts.length > 0 && (
        <div className="hp-category-section">
          <div className="hp-cat-header">
            <h2 className="hp-cat-title">Best Gadgets & Appliances</h2>
            <button className="hp-cat-explore">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
          <div className="hp-cat-scroll">
            {gadgetProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="hp-cat-card"
              >
                <div className="hp-cat-img-circle">
                  <img
                    src={product.image_urls?.[0] || ''}
                    alt={product.title}
                    className="hp-cat-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.opacity = '0.3';
                    }}
                  />
                </div>
                <span className="hp-cat-name">{product.title}</span>
                <span className="hp-cat-discount">
                  {product.discount_percentage
                    ? `Min. ${product.discount_percentage}% Off`
                    : 'Best Price'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — Interesting Findings
          ═══════════════════════════════════════════════════════ */}
      {!category && !search && !isLoading && findingProducts.length > 0 && (
        <div className="hp-category-section">
          <div className="hp-cat-header">
            <h2 className="hp-cat-title">Interesting Findings</h2>
            <button className="hp-cat-explore">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
          <div className="hp-cat-scroll">
            {findingProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="hp-cat-card"
              >
                <div className="hp-cat-img-circle">
                  <img
                    src={product.image_urls?.[0] || ''}
                    alt={product.title}
                    className="hp-cat-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.opacity = '0.3';
                    }}
                  />
                </div>
                <span className="hp-cat-name">{product.title}</span>
                <span className="hp-cat-discount">
                  {product.discount_percentage
                    ? `Min. ${product.discount_percentage}% Off`
                    : 'Best Price'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="listing-header">
        <h1 className="listing-title">
          {isLoading
            ? 'Fetching Best Deals...'
            : search
              ? `Search results for "${search}"`
              : category
                ? `Results for "${category}"`
                : 'Best Deals on Top Products'}
        </h1>
        {!isLoading && (
          <span className="listing-count">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Skeleton Loader Grid (shown while loading) ── */}
      {isLoading && (
        <div className="products-grid">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {/* ── Real Products Grid (shown after loading) ── */}
      {!isLoading && products.length > 0 && (
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isLoading && products.length === 0 && (
        <div className="listing-empty">
          <p>No products found.</p>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
