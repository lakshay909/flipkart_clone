import Navbar from '@/components/Navbar';
import AccountSidebar from '@/components/AccountSidebar';
import Footer from '@/components/Footer';

const ProfilePage = () => {
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
        <div className="flex flex-col lg:flex-row gap-4">
          <AccountSidebar />
          <div className="flex-1 bg-card rounded-sm p-6">
            {/* Personal Information */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-foreground">Personal Information</h2>
                <button className="text-flipkart-blue text-sm font-medium">Edit</button>
              </div>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  defaultValue="deep"
                  className="border border-border rounded-sm px-4 py-2.5 text-sm text-foreground bg-secondary w-full max-w-[240px]"
                  readOnly
                />
                <input
                  type="text"
                  defaultValue="narula"
                  className="border border-border rounded-sm px-4 py-2.5 text-sm text-foreground bg-secondary w-full max-w-[240px]"
                  readOnly
                />
              </div>
              <div className="mb-4">
                <p className="text-sm text-foreground mb-2">Your Gender</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="radio" name="gender" defaultChecked className="accent-flipkart-blue" /> Male
                  </label>
                  <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                    <input type="radio" name="gender" className="accent-flipkart-blue" /> Female
                  </label>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-foreground">Email Address</h2>
                <button className="text-flipkart-blue text-sm font-medium">Edit</button>
              </div>
              <input
                type="email"
                defaultValue="deepnarula18@gmail.com"
                className="border border-border rounded-sm px-4 py-2.5 text-sm text-foreground bg-secondary w-full max-w-[340px]"
                readOnly
              />
            </div>

            {/* Mobile */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-foreground">Mobile Number</h2>
                <button className="text-flipkart-blue text-sm font-medium">Edit</button>
              </div>
              <input
                type="tel"
                defaultValue="+918445987100"
                className="border border-border rounded-sm px-4 py-2.5 text-sm text-foreground bg-secondary w-full max-w-[340px]"
                readOnly
              />
            </div>

            {/* FAQs */}
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">FAQs</h2>
              <p className="text-sm text-flipkart-blue underline cursor-pointer">
                What happens when I update my email address (or mobile number)?
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
