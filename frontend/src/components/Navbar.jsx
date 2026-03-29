import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Navbar.css';

const API_URL = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [location, setLocation] = useState('Locating...');
  const [locationLoading, setLocationLoading] = useState(true);
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  // ── Debounced auto-suggest fetch ──
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(
          `${API_URL}/products?search=${encodeURIComponent(searchQuery.trim())}`
        );
        const top = res.data.slice(0, 8);
        setSuggestions(top);
        setShowDropdown(top.length > 0);
      } catch {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product.id}`);
    setSearchQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  // ── Geolocation: detect user's location on mount ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation('Location N/A');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            'Unknown';
          const pincode = addr.postcode || '';
          setLocation(pincode ? `${city}, ${pincode}` : city);
        } catch {
          setLocation('Location Error');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        setLocation('Update Location');
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return (
    <header className="fk-header">
      <div className="fk-header-container">

        {/* ═══════ ROW 1: Flipkart/Travel Tabs + Location ═══════ */}
        <div className="fk-row fk-row-1">
          {/* Left: Toggle Tabs */}
          <div className="fk-row1-left">
            {/* Flipkart Tab — Yellow active pill */}
            <Link to="/" className="fk-pill fk-pill-flipkart">
              <img
                src="https://rukminim2.flixcart.com/fk-p-flap/52/44/image/d2ecfddf891a3922.png?q=60"
                alt="Flipkart"
                className="fk-pill-logo"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
              <span>Flipkart</span>
            </Link>

            {/* Travel Tab — White pill */}
            <button className="fk-pill fk-pill-travel">
              <img
                src="https://rukminim2.flixcart.com/fk-p-flap/58/44/image/7ab4040af860941d.png?q=60"
                alt="Travel"
                className="fk-pill-plane"
                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
              />
              <img
                src="https://rukminim2.flixcart.com/fk-p-flap/72/36/image/5a9ff48eef96b876.png?q=60"
                alt="Travel"
                className="fk-pill-travel-text"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentElement.insertAdjacentHTML('beforeend', '<span class="fk-travel-fallback">Travel</span>');
                }}
              />
            </button>
          </div>

          {/* Right: Location */}
          <button className="fk-location">
            <svg className="fk-loc-pin" width="16" height="16" viewBox="0 0 24 24" fill="#2874f0">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span className={`fk-loc-text ${locationLoading ? 'fk-loc-pulse' : ''}`}>
              {location}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* ═══════ ROW 2: Search Bar + Login/More/Cart ═══════ */}
        <div className="fk-row fk-row-2">
          {/* Left/Center: Search Bar (flex-grow) */}
          <div className="fk-search-wrapper" ref={searchRef}>
            <form className="fk-search" onSubmit={handleSearch}>
              <svg className="fk-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#878787" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="fk-search-input"
                placeholder="Search for Products, Brands and More"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
            </form>

            {/* ── Auto-Suggest Dropdown ── */}
            {showDropdown && (
              <div className="fk-suggest-dropdown">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="fk-suggest-item"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSuggestionClick(product);
                    }}
                  >
                    <div className="fk-suggest-img-wrap">
                      <img
                        src={product.image_urls?.[0] || ''}
                        alt={product.title}
                        className="fk-suggest-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'; }}
                      />
                    </div>
                    <div className="fk-suggest-info">
                      <span className="fk-suggest-title">{product.title}</span>
                      <span className="fk-suggest-cat">in {product.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Nav Actions */}
          <nav className="fk-nav">
            {/* ── User Dropdown ── */}
            <div className="fk-nav-item fk-nav-dropdown-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>User</span>
              <svg className="fk-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>

              {/* Dropdown */}
              <div className="fk-dropdown">
                <div className="fk-dropdown-header">
                  <span>New customer?</span>
                  <a href="#" className="fk-dropdown-signup">Sign Up</a>
                </div>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>My Profile</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>
                  <span>Flipkart Plus Zone</span>
                </a>
                <Link to="/orders" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  <span>Orders</span>
                </Link>
                <Link to="/wishlist" className="fk-dropdown-item" onClick={() => document.activeElement.blur()}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span>Wishlist</span>
                </Link>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <span>Become a Seller</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  <span>Rewards</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M12 8V5a3 3 0 0 0-3-3H9a3 3 0 0 0 0 6h6a3 3 0 0 0 0-6h0a3 3 0 0 0-3 3v3"/><line x1="12" y1="8" x2="12" y2="20"/></svg>
                  <span>Gift Cards</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span>Notification Preferences</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>24x7 Customer Care</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span>Advertise</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span>Download App</span>
                </a>
              </div>
            </div>

            {/* ── More Dropdown ── */}
            <div className="fk-nav-item fk-nav-dropdown-wrap">
              <span>More</span>
              <svg className="fk-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>

              {/* Dropdown */}
              <div className="fk-dropdown">
                <div className="fk-dropdown-section-title">More</div>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  <span>Become a Seller</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  <span>Notification Settings</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <span>24x7 Customer Care</span>
                </a>
                <a href="#" className="fk-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  <span>Advertise on Flipkart</span>
                </a>
              </div>
            </div>

            {/* Cart */}
            <Link to="/cart" className="fk-nav-item fk-nav-cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 1.99 1.61h9.72a2 2 0 0 0 1.99-1.61L23 6H6" />
              </svg>
              <span>Cart</span>
            </Link>
          </nav>
        </div>

      </div>
    </header>
  );
};

export default Navbar;
