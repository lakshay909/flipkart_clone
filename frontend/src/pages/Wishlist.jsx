import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WishlistCard from '../components/WishlistCard';

const API_URL = import.meta.env.VITE_API_URL;

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`${API_URL}/wishlist`);
      setWishlistProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParentRemoveUpdate = (productId) => {
    setWishlistProducts(prev => prev.filter(p => p.id !== productId));
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading wishlist...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto my-6 bg-white border border-gray-200 rounded-sm">

      {wishlistProducts.length === 0 ? (
        <div className="p-10 text-center text-gray-500">
          Your wishlist is empty!
        </div>
      ) : (
        <div className="flex flex-col">
          {wishlistProducts.map((product) => (
            <WishlistCard 
              key={product.id} 
              product={product} 
              onRemoveSuccess={handleParentRemoveUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
