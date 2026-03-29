import { ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartItemCard from '@/components/CartItemCard';
import ProductSlider from '@/components/ProductSlider';
import { useStore } from '@/store/useStore';

const CartPage = () => {
  const { cart, products, getCartTotal } = useStore();
  const { mrp, discount, total, fees } = getCartTotal();
  const inStockItems = cart.filter((item) => item.product.inStock);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-[1300px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Cart Items */}
          <div className="flex-1 w-full">
            {/* Delivery Address */}
            <div className="bg-card border border-border rounded-sm p-4 mb-3 flex items-center justify-between">
              <div>
                <span className="text-sm text-foreground">
                  Deliver to: <strong>Lakshay, 140413</strong>
                </span>
                <span className="ml-2 text-xs bg-secondary text-muted-foreground px-1.5 py-0.5 rounded-sm">HOME</span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Chandigarh University ZakirC Boys hostel, Chandigarh University, Sahibzada Ajit Singh Nagar District
                </p>
              </div>
              <button className="text-flipkart-blue text-sm font-medium border border-flipkart-blue px-4 py-1.5 rounded-sm">
                Change
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="bg-card rounded-sm p-8 text-center">
                <p className="text-lg text-muted-foreground">Your cart is empty</p>
                <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            )}

            {/* Suggested */}
            {products.length > 0 && (
              <div className="mt-4">
                <ProductSlider
                  products={products.slice(0, 8)}
                  title="Suggested for You"
                  subtitle="Based on Your Activity"
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="w-full lg:w-[360px] shrink-0 sticky top-20">
              <div className="bg-card border border-border rounded-sm p-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase pb-3 border-b border-border">
                  PRICE DETAILS
                </h3>
                <div className="space-y-3 py-3 text-sm">
                  <div className="flex justify-between text-foreground">
                    <span>Price ({inStockItems.length} items)</span>
                    <span>₹{mrp.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Discount</span>
                    <span className="text-flipkart-green">− ₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Delivery Charges</span>
                    <span className={fees === 0 ? 'text-flipkart-green' : ''}>{fees === 0 ? 'FREE' : `₹${fees}`}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-foreground py-3 border-t border-border border-dashed text-base">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <div className="bg-flipkart-green/10 text-flipkart-green text-sm font-medium p-2.5 rounded-sm text-center my-3">
                  You'll save ₹{discount.toLocaleString()} on this order!
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  Safe and secure payments. Easy returns. 100% Authentic products.
                </div>

                <div className="flex items-center justify-between bg-flipkart-yellow/10 border border-flipkart-yellow/30 rounded-sm p-3">
                  <div>
                    <span className="line-through text-xs text-muted-foreground">₹{mrp.toLocaleString()}</span>
                    <span className="text-lg font-bold text-foreground ml-2">₹{total.toLocaleString()}</span>
                  </div>
                  <button className="bg-flipkart-orange text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-sm hover:brightness-95 transition">
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
