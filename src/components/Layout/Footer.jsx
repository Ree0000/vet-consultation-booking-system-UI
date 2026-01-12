import React from 'react';
import { Heart, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: 'mailto:info@pawcarevet.com', label: 'Email' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand & Address */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Heart size={18} className="text-white" fill="white" />
              </div>
              <span className="text-lg font-bold text-gray-800">PawCare Vet</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span>123 Pet Street, Animal City, AC 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0 text-blue-500" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0 text-blue-500" />
                <span>info@pawcarevet.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          {/* <div> */}
          {/*   <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3> */}
          {/*   <ul className="space-y-2 text-sm text-gray-600"> */}
          {/*     <li> */}
          {/*       <a href="#" className="hover:text-blue-600 transition-colors"> */}
          {/*         About Us */}
          {/*       </a> */}
          {/*     </li> */}
          {/*     <li> */}
          {/*       <a href="#" className="hover:text-blue-600 transition-colors"> */}
          {/*         Our Services */}
          {/*       </a> */}
          {/*     </li> */}
          {/*     <li> */}
          {/*       <a href="#" className="hover:text-blue-600 transition-colors"> */}
          {/*         Contact */}
          {/*       </a> */}
          {/*     </li> */}
          {/*     <li> */}
          {/*       <a href="#" className="hover:text-blue-600 transition-colors"> */}
          {/*         FAQ */}
          {/*       </a> */}
          {/*     </li> */}
          {/*   </ul> */}
          {/* </div> */}

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
            <div className="flex gap-3 mb-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 hover:bg-blue-500 rounded-lg flex items-center justify-center text-blue-600 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Stay connected for updates and pet care tips!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <p>© {currentYear} PawCare Vet. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
