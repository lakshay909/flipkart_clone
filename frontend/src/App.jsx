import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import CategoryBar from './components/CategoryBar';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccess from './pages/OrderSuccess';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import { Toaster } from 'react-hot-toast';
import './App.css';

const DemoBanner = () => (
  <div className="demo-mode-banner">
    🚀 <strong>Demo Project:</strong> Backend is hosted on a free tier. The first request may take 30-50 seconds to wake up. Thank you for your patience!
  </div>
);

function App() {
  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'Roboto, sans-serif'
          },
          success: {
            iconTheme: {
              primary: '#26a541',
              secondary: '#fff',
            },
          },
        }} 
      />
      <DemoBanner />
      <Router>
        <Navbar />

        <CategoryBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProductListing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccess />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </Router>
    </>
  );
}

export default App;
