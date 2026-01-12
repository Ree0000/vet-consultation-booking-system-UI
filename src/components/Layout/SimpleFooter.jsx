import React from 'react';

const SimpleFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 text-center text-sm text-gray-600">
      <p>© {currentYear} PawCare Vet. All rights reserved.</p>
      <div className="flex justify-center gap-4 mt-2">
        <a href="#" className="hover:text-blue-600 transition-colors">
          Privacy Policy
        </a>
        <span>•</span>
        <a href="#" className="hover:text-blue-600 transition-colors">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default SimpleFooter;
