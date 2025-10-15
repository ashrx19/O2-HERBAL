import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#12372A] text-[#ADBC9F] py-16 px-[5%]">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row justify-between gap-8 pb-10 mb-8 border-b border-white/20">
        {/* Contact Column */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="heading-font text-xl font-bold mb-5 text-white">CONTACT</h3>
          <p className="mb-2"><strong>India</strong></p>
          <p className="mb-2">supporto2herbal@gmail.com</p>
          <p>987654321</p>
        </div>
        
        {/* Products Column */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="heading-font text-xl font-bold mb-5 text-white">PRODUCTS</h3>
          <ul className="space-y-2">
            <li><Link to="/products/soap">Soap</Link></li>
            <li><Link to="/products/shampoo">Shampoo</Link></li>
          </ul>
        </div>
        
        {/* About Us Column */}
        <div className="flex-1 min-w-[180px]">
          <h3 className="heading-font text-xl font-bold mb-5 text-white">ABOUT US</h3>
          <p className="text-sm leading-relaxed">
            O2 Herbal Products is a Coimbatore-based homemade herbal skincare brand
            offering chemical-free, natural products made from plants and essential oils.
            We focus on quality, eco-friendliness, and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex flex-col md:flex-row justify-between items-start pb-10 mb-10 border-b border-white/20">
        <div className="flex-grow mb-6 md:mb-0">
          <h4 className="text-white font-bold mb-4">O2 HERBALS PRIVATE LIMITED</h4>
          <p><strong>Address:</strong> XX,YYY,ZZZ</p>
          <p>Egmore, Chennai, Chennai, Tamil Nadu, 600008</p>
          <p className="mt-2"><strong>Registration Number:</strong> 33AAJCN06391ZM</p>
        </div>
        <div className="flex gap-4 text-2xl">
          <i className="fab fa-facebook-f hover:text-white cursor-pointer transition-colors"></i>
          <i className="fab fa-twitter hover:text-white cursor-pointer transition-colors"></i>
          <i className="fab fa-instagram hover:text-white cursor-pointer transition-colors"></i>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="text-center">
        <div className="heading-font text-5xl font-bold text-white mb-4">O2HERBALS</div>
        <p className="text-sm mb-6">Copyright © 2025, O2 HERBALS India | All Rights Reserved</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link to="/refund-policy" className="hover:text-white hover:border-b border-white transition-colors">
            REFUND POLICY
          </Link>
          <Link to="/privacy-policy" className="hover:text-white hover:border-b border-white transition-colors">
            PRIVACY POLICY
          </Link>
          <Link to="/terms-of-service" className="hover:text-white hover:border-b border-white transition-colors">
            TERMS OF SERVICE
          </Link>
          <Link to="/shipping-policy" className="hover:text-white hover:border-b border-white transition-colors">
            SHIPPING POLICY
          </Link>
        </div>
      </div>
    </footer>
  );
}
