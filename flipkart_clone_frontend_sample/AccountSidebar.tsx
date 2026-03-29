import { Link, useLocation } from 'react-router-dom';
import { Package, User, CreditCard, MapPin, FileText, Heart, Gift, ChevronRight } from 'lucide-react';

const AccountSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="bg-card rounded-sm shadow-sm w-full lg:w-[270px] shrink-0">
      {/* User Info */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Hello,</p>
          <p className="font-bold text-foreground">Deep Narula</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="py-2">
        <Link
          to="/orders"
          className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-secondary ${isActive('/orders') ? 'text-flipkart-blue font-medium' : 'text-foreground'}`}
        >
          <span className="flex items-center gap-3">
            <Package className="w-5 h-5 text-flipkart-blue" />
            MY ORDERS
          </span>
          <ChevronRight className="w-4 h-4" />
        </Link>

        <div className="border-t border-border my-1" />

        <div className="px-4 py-2">
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground uppercase mb-1">
            <User className="w-5 h-5 text-flipkart-blue" />
            ACCOUNT SETTINGS
          </div>
          <Link
            to="/profile"
            className={`block py-2 pl-8 text-sm hover:text-flipkart-blue ${isActive('/profile') ? 'text-flipkart-blue font-medium' : 'text-foreground'}`}
          >
            Profile Information
          </Link>
          <div className="py-2 pl-8 text-sm text-foreground hover:text-flipkart-blue cursor-pointer">
            Manage Addresses
          </div>
          <div className="py-2 pl-8 text-sm text-foreground hover:text-flipkart-blue cursor-pointer">
            PAN Card Information
          </div>
        </div>

        <div className="border-t border-border my-1" />

        <div className="px-4 py-2">
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground uppercase mb-1">
            <CreditCard className="w-5 h-5 text-flipkart-blue" />
            PAYMENTS
          </div>
          <div className="flex items-center justify-between py-2 pl-8 text-sm text-foreground">
            <span>Gift Cards</span>
            <span className="text-muted-foreground">₹0</span>
          </div>
          <div className="py-2 pl-8 text-sm text-foreground hover:text-flipkart-blue cursor-pointer">
            Saved UPI
          </div>
          <div className="py-2 pl-8 text-sm text-foreground hover:text-flipkart-blue cursor-pointer">
            Saved Cards
          </div>
        </div>

        <div className="border-t border-border my-1" />

        <div className="px-4 py-2">
          <div className="flex items-center gap-3 text-sm font-semibold text-muted-foreground uppercase mb-1">
            <Heart className="w-5 h-5 text-flipkart-blue" />
            MY STUFF
          </div>
          <Link
            to="/wishlist"
            className={`block py-2 pl-8 text-sm hover:text-flipkart-blue ${isActive('/wishlist') ? 'text-flipkart-blue font-medium' : 'text-foreground'}`}
          >
            My Wishlist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountSidebar;
