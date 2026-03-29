import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'horizontal';
}

const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  if (layout === 'horizontal') {
    return (
      <div className="flex bg-card border border-border rounded-sm p-4 gap-4 hover:shadow-md transition-shadow">
        <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-secondary rounded-sm overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-foreground truncate">{product.name}</h3>
          {product.assured && <span className="flipkart-assured">ⓕ Assured</span>}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="flipkart-price text-lg font-bold">₹{product.price.toLocaleString()}</span>
            {product.discount > 0 && (
              <>
                <span className="flipkart-mrp">₹{product.mrp.toLocaleString()}</span>
                <span className="flipkart-discount">{product.discount}% off</span>
              </>
            )}
          </div>
          {!product.inStock && <span className="text-destructive text-xs font-medium">Currently unavailable</span>}
        </div>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="self-start p-1"
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-sm p-3 hover:shadow-lg transition-shadow cursor-pointer group relative">
      <button
        onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        className="absolute top-3 right-3 z-10 p-1"
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
      </button>

      <div className="w-full aspect-square flex items-center justify-center bg-secondary rounded-sm overflow-hidden mb-3">
        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
      </div>

      <h3 className="text-sm text-foreground line-clamp-2 mb-1">{product.brand}</h3>
      <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.name}</p>

      <div className="flex items-center gap-1 mb-1">
        <span className="bg-flipkart-green text-primary-foreground text-xs px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
          {product.rating} <Star className="w-2.5 h-2.5 fill-current" />
        </span>
        <span className="text-xs text-muted-foreground">({product.reviews.toLocaleString()})</span>
      </div>

      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="flipkart-price font-bold">₹{product.price.toLocaleString()}</span>
        {product.discount > 0 && (
          <>
            <span className="flipkart-mrp text-xs">₹{product.mrp.toLocaleString()}</span>
            <span className="flipkart-discount text-xs">{product.discount}% off</span>
          </>
        )}
      </div>

      {product.assured && <span className="flipkart-assured text-[10px] mt-1 block">ⓕ Assured</span>}

      {product.inStock ? (
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="mt-2 w-full flex items-center justify-center gap-1 bg-flipkart-yellow text-flipkart-dark text-xs font-bold py-2 rounded-sm hover:brightness-95 transition"
        >
          <ShoppingCart className="w-3.5 h-3.5" /> ADD TO CART
        </button>
      ) : (
        <div className="mt-2 text-center text-destructive text-xs font-medium py-2">Out of Stock</div>
      )}
    </div>
  );
};

export default ProductCard;
