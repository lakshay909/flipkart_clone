import { Minus, Plus, Bookmark, Trash2, Zap } from 'lucide-react';
import { useStore, CartItem } from '@/store/useStore';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const { updateQuantity, removeFromCart } = useStore();
  const { product, quantity } = item;

  return (
    <div className="bg-card border border-border rounded-sm p-4">
      <div className="flex gap-4">
        <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-secondary rounded-sm overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm text-foreground">{product.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Seller: {product.brand} {product.assured && <span className="flipkart-assured">ⓕ Assured</span>}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            {product.discount > 0 && (
              <span className="text-flipkart-green text-sm font-medium">↓{product.discount}%</span>
            )}
            {product.discount > 0 && (
              <span className="flipkart-mrp">₹{product.mrp.toLocaleString()}</span>
            )}
            <span className="flipkart-price text-lg font-bold">₹{product.price.toLocaleString()}</span>
          </div>
          {!product.inStock && (
            <span className="text-destructive text-sm font-medium mt-1 block">Out Of Stock</span>
          )}
          {product.inStock && (
            <p className="text-xs text-muted-foreground mt-1">Delivery by Apr 02, Wed</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 pt-3 border-t border-border">
        {product.inStock && (
          <div className="flex items-center border border-border rounded-full">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary rounded-l-full"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-bold bg-card border-x border-border">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary rounded-r-full"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <button className="text-sm font-semibold text-foreground hover:text-flipkart-blue flex items-center gap-1 uppercase">
          <Bookmark className="w-4 h-4" /> Save for later
        </button>
        <button
          onClick={() => removeFromCart(product.id)}
          className="text-sm font-semibold text-foreground hover:text-destructive flex items-center gap-1 uppercase"
        >
          <Trash2 className="w-4 h-4" /> Remove
        </button>
        {product.inStock && (
          <button className="text-sm font-semibold text-foreground hover:text-flipkart-blue flex items-center gap-1 uppercase ml-auto">
            <Zap className="w-4 h-4" /> Buy this now
          </button>
        )}
      </div>
    </div>
  );
};

export default CartItemCard;
