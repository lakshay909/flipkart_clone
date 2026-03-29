import { Briefcase, HelpCircle, Gift, Tag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-flipkart-dark text-primary-foreground mt-4">
      <div className="max-w-[1300px] mx-auto px-4">
        {/* Top Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 py-10 border-b border-primary-foreground/10">
          <div>
            <h4 className="text-xs text-muted-foreground uppercase mb-3 font-semibold">ABOUT</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:underline cursor-pointer">Contact Us</li>
              <li className="hover:underline cursor-pointer">About Us</li>
              <li className="hover:underline cursor-pointer">Careers</li>
              <li className="hover:underline cursor-pointer">Flipkart Stories</li>
              <li className="hover:underline cursor-pointer">Press</li>
              <li className="hover:underline cursor-pointer">Corporate Information</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-muted-foreground uppercase mb-3 font-semibold">GROUP COMPANIES</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:underline cursor-pointer">Myntra</li>
              <li className="hover:underline cursor-pointer">Cleartrip</li>
              <li className="hover:underline cursor-pointer">Shopsy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-muted-foreground uppercase mb-3 font-semibold">HELP</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:underline cursor-pointer">Payments</li>
              <li className="hover:underline cursor-pointer">Shipping</li>
              <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
              <li className="hover:underline cursor-pointer">FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-muted-foreground uppercase mb-3 font-semibold">CONSUMER POLICY</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
              <li className="hover:underline cursor-pointer">Terms Of Use</li>
              <li className="hover:underline cursor-pointer">Security</li>
              <li className="hover:underline cursor-pointer">Privacy</li>
              <li className="hover:underline cursor-pointer">Sitemap</li>
              <li className="hover:underline cursor-pointer">Grievance Redressal</li>
              <li className="hover:underline cursor-pointer">EPR Compliance</li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="text-xs text-muted-foreground uppercase mb-3 font-semibold">Mail Us:</h4>
            <p className="text-xs leading-5">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
            <p className="text-xs mt-3">CIN: U51109KA2012PTC066107</p>
            <p className="text-xs">Telephone: 044-45614700</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-wrap items-center justify-between py-4 text-xs gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Briefcase className="w-4 h-4 text-flipkart-yellow" /> Become a Seller
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Tag className="w-4 h-4 text-flipkart-yellow" /> Advertise
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <Gift className="w-4 h-4 text-flipkart-yellow" /> Gift Cards
            </span>
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
              <HelpCircle className="w-4 h-4 text-flipkart-yellow" /> Help Center
            </span>
          </div>
          <span className="text-muted-foreground">© 2007-2026 Flipkart.com</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
