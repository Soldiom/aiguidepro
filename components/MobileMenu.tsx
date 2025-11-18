import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { navigationLinks, NavigationLink } from './navigationConfig';
import { getNavHighlightClasses } from './navUtils';
import { cn } from '../utils/cn';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const baseLinkClasses = 'flex items-center px-4 py-3 text-base rounded-2xl transition-all border border-transparent';

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isAdmin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const links = navigationLinks.filter((link) => (link.requiresAdmin ? isAdmin : true));

  const handleAnchorClick = (link: NavigationLink) => {
    onClose();
    const targetId = link.targetId;
    if (!targetId) {
      if (link.href) window.location.href = link.href;
      return;
    }

    const scrollToSection = () => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (link.href) {
        window.location.href = link.href;
      }
    };

    if (location.pathname !== '/') {
      navigate(`/${link.targetId ? `#${link.targetId}` : ''}`);
      window.setTimeout(scrollToSection, 150);
    } else {
      scrollToSection();
    }
  };

  return (
    <aside
      className={cn(
        'fixed top-0 right-0 h-full w-72 bg-slate-900 z-50 shadow-2xl border-l border-slate-800 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      aria-hidden={!isOpen}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white">AI Guide Pro</h2>
        <button onClick={onClose} className="text-white" aria-label="إغلاق القائمة">
          <CloseIcon />
        </button>
      </div>

      <nav className="p-4 overflow-y-auto h-[calc(100%-64px)]">
        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.id}>
              {link.type === 'route' && link.to ? (
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(baseLinkClasses, getNavHighlightClasses(link, isActive))
                  }
                  end={link.to === '/'}
                >
                  {link.icon}
                  <span className="ml-auto text-right">{link.label}</span>
                </NavLink>
              ) : link.type === 'external' && link.href ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(baseLinkClasses, getNavHighlightClasses(link))}
                  onClick={onClose}
                >
                  {link.icon}
                  <span className="ml-auto text-right">{link.label}</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAnchorClick(link)}
                  className={cn(baseLinkClasses, getNavHighlightClasses(link))}
                >
                  {link.icon}
                  <span className="ml-auto text-right">{link.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default MobileMenu;
