import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronDown, User, Heart, Package, CreditCard, Gift, Bell, LogOut, Star, Zap } from 'lucide-react';
import { useStore } from '@/store/useStore';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const navigate = useNavigate();
  const getCartCount = useStore((s) => s.getCartCount);
  const cartCount = getCartCount();

  return (
    <header className="bg-flipkart-blue sticky top-0 z-50">
      <div className="max-w-[1300px] mx-auto flex items-center h-14 px-4 gap-4">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-end shrink-0">
          <span className="text-primary-foreground text-xl font-bold italic leading-none">Flipkart</span>
          <span className="text-[10px] text-primary-foreground/80 italic flex items-center gap-0.5">
            Explore <span className="text-flipkart-yellow font-semibold">Plus</span>
            <Zap className="w-3 h-3 text-flipkart-yellow fill-flipkart-yellow" />
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-[560px]">
          <div className="flex items-center bg-card rounded-sm overflow-hidden">
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 text-sm text-foreground outline-none bg-transparent"
            />
            <button className="px-3 py-2 text-flipkart-blue">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account */}
        <div
          className="relative"
          onMouseEnter={() => setShowAccountMenu(true)}
          onMouseLeave={() => setShowAccountMenu(false)}
        >
          <button className="flex items-center gap-1 text-primary-foreground font-medium text-sm px-3 py-2 hover:bg-flipkart-subheader rounded-sm">
            <User className="w-4 h-4" />
            <span>deep</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showAccountMenu && (
            <div className="absolute right-0 top-full bg-card shadow-xl rounded-sm border border-border w-60 py-2 z-50">
              <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary">
                <User className="w-4 h-4 text-flipkart-blue" /> My Profile
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary">
                <Heart className="w-4 h-4 text-flipkart-blue" /> Wishlist
              </Link>
              <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary">
                <Package className="w-4 h-4 text-flipkart-blue" /> Orders
              </Link>
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">
                <Star className="w-4 h-4 text-flipkart-blue" /> Supercoin
              </div>
              <hr className="my-1 border-border" />
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">
                <CreditCard className="w-4 h-4 text-flipkart-blue" /> Saved Cards & Wallet
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">
                <Gift className="w-4 h-4 text-flipkart-blue" /> Gift Cards
              </div>
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">
                <Bell className="w-4 h-4 text-flipkart-blue" /> Notifications
              </div>
              <hr className="my-1 border-border" />
              <div className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">
                <LogOut className="w-4 h-4 text-flipkart-blue" /> Logout
              </div>
            </div>
          )}
        </div>

        {/* Become a Seller */}
        <span className="text-primary-foreground font-medium text-sm hidden lg:block cursor-pointer hover:underline">
          Become a Seller
        </span>

        {/* More */}
        <div
          className="relative"
          onMouseEnter={() => setShowMoreMenu(true)}
          onMouseLeave={() => setShowMoreMenu(false)}
        >
          <button className="flex items-center gap-1 text-primary-foreground font-medium text-sm">
            More
            <ChevronDown className="w-3 h-3" />
          </button>
          {showMoreMenu && (
            <div className="absolute right-0 top-full bg-card shadow-xl rounded-sm border border-border w-52 py-2 z-50">
              <div className="px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">Notification Preferences</div>
              <div className="px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">24x7 Customer Care</div>
              <div className="px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">Advertise</div>
              <div className="px-4 py-2.5 text-sm text-foreground hover:bg-secondary cursor-pointer">Download App</div>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link to="/cart" className="flex items-center gap-1.5 text-primary-foreground font-medium text-sm relative">
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-flipkart-yellow text-flipkart-dark text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
