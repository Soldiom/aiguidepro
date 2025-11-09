import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 py-8 px-4">
      <div className="container mx-auto text-center text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} مهندس علي يعقوب الذويخ. جميع الحقوق محفوظة.
        </p>
        <a 
          href="http://kuwaitai.alsabahaward.org"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          kuwaitai.alsabahaward.org
        </a>
      </div>
    </footer>
  );
};

export default Footer;
