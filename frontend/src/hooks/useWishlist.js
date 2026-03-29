import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const useWishlist = (productId) => {
  // Local state to instantly turn the heart red/gray
  const [wishlisted, setWishlisted] = useState(false);

  // Function to actually hit the backend
  const toggleWishlist = async () => {
    // 1. Optimistic Update: Change UI immediately for snappy feel
    const previousState = wishlisted;
    setWishlisted(!wishlisted);

    try {
      // 2. Send request to our actual backend DB
      const res = await axios.post(`${API_URL}/wishlist/toggle`, {
        productId: productId
      });
      
      // 3. Log success to console so we know it worked!
      console.log(`✅ Success: Product ${productId} wishlist state is now:`, res.data.isWishlisted);
      
      // Sync state with strict DB response
      setWishlisted(res.data.isWishlisted);
    } catch (error) {
      // If backend fails, revert the heart color and log error
      console.error('❌ Backend API Error toggling wishlist:', error);
      setWishlisted(previousState);
    }
  };

  return [wishlisted, toggleWishlist];
};

export default useWishlist;