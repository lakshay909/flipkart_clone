import { useNavigate, useSearchParams } from 'react-router-dom';
import './CategoryBar.css';

/* ── UI category names → exact DB category names ── */
const categoryMap = {
  'Top Offers': null,           // clears filter → show all
  'Mobiles & Tablets': 'Mobiles',
  'Electronics': 'Electronics',
  'TVs & Appliances': 'Home Appliances',
  'Fashion': 'Fashion',
  'Beauty': 'Beauty',
  'Home & Furniture': 'Furniture',
  'Flights': null,              // no DB match, goes home
  'Grocery': 'Grocery',
};

const categories = [
  {
    name: 'Top Offers',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/698ba0cebe456aaf.jpg?q=100',
  },
  {
    name: 'Mobiles & Tablets',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/44e10b16e649b691.jpg?q=100',
  },
  {
    name: 'Electronics',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/4da1d0d19350cc84.jpg?q=100',
  },
  {
    name: 'TVs & Appliances',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/717b5077a5e25324.jpg?q=100',
  },
  {
    name: 'Fashion',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/9d4e9c605fc1d2d3.jpg?q=100',
  },
  {
    name: 'Beauty',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/a5e54f0c5a3fa710.jpg?q=100',
  },
  {
    name: 'Home & Furniture',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/5b813b64a3179784.jpg?q=100',
  },
  {
    name: 'Flights',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/57fe0ce3b1bc4187.png?q=100',
  },
  {
    name: 'Grocery',
    img: 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/25f400c36bc3487d.jpg?q=100',
  },
];

/* ── Emoji fallbacks (only used if the CDN image fails to load) ── */
const fallbackIcons = ['🏷️', '📱', '💻', '📺', '👗', '💄', '🛋️', '✈️', '🛒'];

const CategoryBar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const handleClick = (catName) => {
    const dbCategory = categoryMap[catName];
    if (dbCategory) {
      navigate(`/?category=${encodeURIComponent(dbCategory)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="fk-catbar">
      <div className="fk-catbar-inner">
        {categories.map((cat, index) => {
          const dbCat = categoryMap[cat.name];
          const isActive = dbCat && activeCategory === dbCat;
          return (
            <button
              key={index}
              className={`fk-catbar-item ${isActive ? 'fk-catbar-item-active' : ''}`}
              onClick={() => handleClick(cat.name)}
            >
              <div className="fk-catbar-img-wrap">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="fk-catbar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.setAttribute('data-emoji', fallbackIcons[index] || '📦');
                    e.target.parentElement.classList.add('fk-catbar-emoji-fallback');
                  }}
                />
              </div>
              <span className="fk-catbar-label">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
