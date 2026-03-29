import { Shirt, Smartphone, Sparkle, Monitor, Home, Refrigerator, Gamepad2, Apple, Car, Bike, Dumbbell, BookOpen, Sofa, Sparkles } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="w-6 h-6" />,
  shirt: <Shirt className="w-6 h-6" />,
  smartphone: <Smartphone className="w-6 h-6" />,
  sparkle: <Sparkle className="w-6 h-6" />,
  monitor: <Monitor className="w-6 h-6" />,
  home: <Home className="w-6 h-6" />,
  refrigerator: <Refrigerator className="w-6 h-6" />,
  'gamepad-2': <Gamepad2 className="w-6 h-6" />,
  apple: <Apple className="w-6 h-6" />,
  car: <Car className="w-6 h-6" />,
  bike: <Bike className="w-6 h-6" />,
  dumbbell: <Dumbbell className="w-6 h-6" />,
  'book-open': <BookOpen className="w-6 h-6" />,
  sofa: <Sofa className="w-6 h-6" />,
};

import productsData from '@/data/products.json';

const CategoryMenu = () => {
  const categories = productsData.categories;

  return (
    <div className="bg-card shadow-sm border-b border-border">
      <div className="max-w-[1300px] mx-auto flex items-center justify-between overflow-x-auto px-4">
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="flex flex-col items-center gap-1 py-3 px-3 min-w-[80px] text-foreground hover:text-flipkart-blue transition-colors group"
          >
            <span className="text-flipkart-blue group-hover:text-flipkart-blue">
              {iconMap[cat.icon] || <Sparkles className="w-6 h-6" />}
            </span>
            <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryMenu;
