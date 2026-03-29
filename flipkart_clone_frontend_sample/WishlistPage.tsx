import Navbar from '@/components/Navbar';
import AccountSidebar from '@/components/AccountSidebar';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useStore } from '@/store/useStore';

const WishlistPage = () => {
  const { products, wishlist } = useStore();
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sub-header categories bar */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-[1300px] mx-auto flex items-center gap-6 px-4 h-10 overflow-x-auto text-xs font-medium">
          {['Electronics', 'TVs & Appliances', 'Men', 'Women', 'Baby & Kids', 'Home & Furniture', 'Sports, Books & More', 'Flights', 'Offer Zone'].map((cat) => (
            <span key={cat} className="whitespace-nowrap text-foreground hover:text-flipkart-blue cursor-pointer">{cat}</span>
          ))}
        </div>
      </div>

      <main className="max-w-[1300px] mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <AccountSidebar />
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground mb-4">
              My Wishlist ({wishlistProducts.length})
            </h1>
            <div className="space-y-3">
              {wishlistProducts.length === 0 ? (
                <div className="bg-card rounded-sm p-8 text-center text-muted-foreground">
                  Your wishlist is empty
                </div>
              ) : (
                wishlistProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout="horizontal" />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WishlistPage;
