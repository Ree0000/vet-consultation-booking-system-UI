import { Heart, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Contact - Minimal Horizontal */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-gray-600">(555) 123-4567</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-blue-500 flex-shrink-0" />
            <span className="text-gray-600">info@urbananimal.com</span>
          </div>
        </div>
        {/* Copyright */}
        <div className="pt-1 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {currentYear} Klinik Urban Animal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SimpleFooter;
