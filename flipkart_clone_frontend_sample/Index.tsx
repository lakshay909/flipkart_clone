import Navbar from '@/components/Navbar';
import CategoryMenu from '@/components/CategoryMenu';
import BannerCarousel from '@/components/BannerCarousel';
import ProductSlider from '@/components/ProductSlider';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { useStore } from '@/store/useStore';

const HomePage = () => {
  const products = useStore((s) => s.products);

  const fashionProducts = products.filter((p) => p.category === 'Fashion');
  const mobileProducts = products.filter((p) => p.category === 'Mobiles');
  const electronicsProducts = products.filter((p) => p.category === 'Electronics');
  const applianceProducts = products.filter((p) => p.category === 'Home Appliances');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CategoryMenu />

      <main className="max-w-[1300px] mx-auto px-2 py-3 space-y-3">
        {/* Banner */}
        <BannerCarousel />

        {/* Recommendation section */}
        <div className="bg-card rounded-sm p-4">
          <h2 className="text-lg font-bold text-foreground mb-3">Deep, still looking for these?</h2>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {products.slice(0, 6).map((p) => (
              <div key={p.id} className="min-w-[140px] max-w-[140px] flex flex-col items-center">
                <div className="w-[140px] h-[140px] bg-secondary rounded-sm overflow-hidden flex items-center justify-center">
                  <img src={p.image} alt={p.name} className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Sliders */}
        <ProductSlider products={fashionProducts} title="Top Deals on Fashion" subtitle="Best of styles" />
        <ProductSlider products={mobileProducts} title="Best of Mobiles" subtitle="Top picks for you" />
        <ProductSlider products={electronicsProducts} title="Top Electronics Deals" subtitle="Grab the best offers" />

        {/* Full grid */}
        <ProductGrid products={applianceProducts} title="Home Appliances for You" />
        <ProductGrid products={products} title="Suggested for You" />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
