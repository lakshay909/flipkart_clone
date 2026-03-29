import { useState } from 'react';
import { Search, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useStore } from '@/store/useStore';

const OrdersPage = () => {
  const orders = useStore((s) => s.orders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [timeFilter, setTimeFilter] = useState<string[]>([]);

  const toggleFilter = (filter: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(filter) ? list.filter((f) => f !== filter) : [...list, filter]);
  };

  const filteredOrders = orders.filter((order) => {
    if (searchQuery && !order.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(order.status)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Sub-header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-[1300px] mx-auto flex items-center gap-6 px-4 h-10 overflow-x-auto text-xs font-medium">
          {['Electronics', 'TVs & Appliances', 'Men', 'Women', 'Baby & Kids', 'Home & Furniture', 'Sports, Books & More', 'Flights', 'Offer Zone'].map((cat) => (
            <span key={cat} className="whitespace-nowrap text-foreground hover:text-flipkart-blue cursor-pointer">{cat}</span>
          ))}
        </div>
      </div>

      <main className="max-w-[1300px] mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-xs text-muted-foreground mb-3">
          Home {'>'} My Account {'>'} My Orders
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Filters Sidebar */}
          <div className="bg-card rounded-sm shadow-sm w-full lg:w-[220px] shrink-0 p-4">
            <h3 className="font-bold text-foreground text-sm mb-4">Filters</h3>

            <div className="mb-5">
              <h4 className="font-semibold text-xs text-foreground uppercase mb-2">ORDER STATUS</h4>
              {['On the way', 'Delivered', 'Cancelled', 'Returned'].map((status) => (
                <label key={status} className="flex items-center gap-2 py-1 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={statusFilter.includes(status)}
                    onChange={() => toggleFilter(status, statusFilter, setStatusFilter)}
                    className="accent-flipkart-blue"
                  />
                  {status}
                </label>
              ))}
            </div>

            <div>
              <h4 className="font-semibold text-xs text-foreground uppercase mb-2">ORDER TIME</h4>
              {['Last 30 days', '2024', '2023', 'Older'].map((time) => (
                <label key={time} className="flex items-center gap-2 py-1 text-sm text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={timeFilter.includes(time)}
                    onChange={() => toggleFilter(time, timeFilter, setTimeFilter)}
                    className="accent-flipkart-blue"
                  />
                  {time}
                </label>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1">
            {/* Search */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 flex items-center border border-border bg-card rounded-sm overflow-hidden">
                <input
                  type="text"
                  placeholder="Search your orders here"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-sm text-foreground bg-transparent outline-none"
                />
              </div>
              <button className="bg-flipkart-blue text-primary-foreground px-6 py-2.5 rounded-sm text-sm font-medium flex items-center gap-1.5">
                <Search className="w-4 h-4" /> Search Orders
              </button>
            </div>

            {/* Order Cards */}
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-sm p-4">
                  {order.sharedBy && (
                    <div className="bg-flipkart-yellow/20 text-flipkart-dark text-xs px-3 py-1.5 rounded-sm mb-3 inline-block">
                      {order.sharedBy} shared this order with you.
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-sm flex items-center justify-center overflow-hidden shrink-0">
                      <img src={order.image} alt={order.name} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-foreground">{order.name}</h3>
                      {order.color && <p className="text-xs text-muted-foreground">Color: {order.color}</p>}
                    </div>
                    <div className="text-sm font-medium text-foreground shrink-0">
                      ₹{order.price}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className={`w-2 h-2 rounded-full ${order.status === 'Delivered' ? 'bg-flipkart-green' : 'bg-flipkart-blue'}`} />
                        <span className="font-medium text-foreground">{order.status} on {order.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">Your item has been delivered</p>
                      <button className="flex items-center gap-1 text-flipkart-blue text-xs font-medium mt-1">
                        <Star className="w-3 h-3 text-flipkart-yellow fill-flipkart-yellow" /> Rate & Review Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrdersPage;
