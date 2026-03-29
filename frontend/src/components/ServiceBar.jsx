import { useState, useEffect } from 'react';
import './ServiceBar.css';

const ServiceBar = () => {
  const [location, setLocation] = useState('Locating...');
  const [locationLoading, setLocationLoading] = useState(true);

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
          // Free reverse geocoding via OpenStreetMap Nominatim (no API key needed)
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
        // User denied or error
        setLocation('Update Location');
        setLocationLoading(false);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return (
    <div className="fk-servicebar">
      <div className="fk-servicebar-inner">
        {/* ── LEFT: Flipkart & Travel Tabs ── */}
        <div className="fk-servicebar-tabs">
          {/* Flipkart Tab (active, yellow pill) */}
          <button className="fk-tab fk-tab-flipkart active">
            <svg
              className="fk-tab-flogo"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#2874f0"
            >
              <path d="M5.5 2C4.12 2 3 3.12 3 4.5v15C3 20.88 4.12 22 5.5 22H11v-4.5c0-.28.22-.5.5-.5h1c.28 0 .5.22.5.5V22h5.5c1.38 0 2.5-1.12 2.5-2.5v-15C21 3.12 19.88 2 18.5 2h-13zM9 16H7v-2h2v2zm0-4H7V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4zm4 4h-2v-2h2v2zm0-4h-2V8h2v4z" />
            </svg>
            <span>Flipkart</span>
          </button>

          {/* Travel Tab (inactive, white pill) */}
          <button className="fk-tab fk-tab-travel">
            <svg
              className="fk-tab-plane"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="#e53935"
            >
              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
            <span>Travel</span>
          </button>
        </div>

        {/* ── RIGHT: Location Detector ── */}
        <button className="fk-location-btn">
          {/* Pin icon */}
          <svg
            className="fk-location-pin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#2874f0"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>

          <span className={`fk-location-text ${locationLoading ? 'fk-location-pulse' : ''}`}>
            {location}
          </span>

          {/* Chevron */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServiceBar;
