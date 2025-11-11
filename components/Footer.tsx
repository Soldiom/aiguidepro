import React from 'react';
import FeedbackForm from './FeedbackForm';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-800 py-8 px-4">
      <div className="container mx-auto text-center text-slate-500">
        <p>
          &copy; {new Date().getFullYear()} مهندس علي يعقوب الذويخ. جميع الحقوق محفوظة.
        </p>
        <div className="mt-6">
          <FeedbackForm />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
