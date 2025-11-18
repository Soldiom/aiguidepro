import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { isAdmin } from '../utils/admin';
import { cn } from '../utils/cn';
import { navigationLinks, NavigationLink } from './navigationConfig';
import { getNavHighlightClasses } from './navUtils';
import UnifiedSystemButton from './ui/UnifiedSystemButton';

interface SideMenuProps {
  className?: string;
}

const baseLinkClasses = 'flex items-center px-4 py-3 text-lg rounded-2xl transition-all border border-transparent';

const SideMenu: React.FC<SideMenuProps> = ({ className }) => {
  const [adminEnabled, setAdminEnabled] = useState<boolean>(isAdmin());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const syncAdmin = () => setAdminEnabled(isAdmin());
    window.addEventListener('storage', syncAdmin);
    window.addEventListener('aiguidepro-admin-change', syncAdmin as EventListener);
    return () => {
      window.removeEventListener('storage', syncAdmin);
      window.removeEventListener('aiguidepro-admin-change', syncAdmin as EventListener);
    };
  }, []);

  const links = useMemo(
    () => navigationLinks.filter((link) => (link.requiresAdmin ? adminEnabled : true)),
    [adminEnabled]
  );

  const handleAnchorClick = (link: NavigationLink) => {
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
      navigate(`/${targetId ? `#${targetId}` : ''}`);
      window.setTimeout(scrollToSection, 150);
    } else {
      scrollToSection();
    }
  };

  const renderLink = (link: NavigationLink) => {
    if (link.id === 'unified') {
      return <UnifiedSystemButton fullWidth className="text-base" />;
    }

    if (link.type === 'route' && link.to) {
      return (
        <NavLink
          to={link.to}
          end={link.to === '/'}
          className={({ isActive }) => cn(baseLinkClasses, getNavHighlightClasses(link, isActive))}
        >
          {link.icon}
          <span className="ml-auto text-right">{link.label}</span>
        </NavLink>
      );
    }

    if (link.type === 'external' && link.href) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(baseLinkClasses, getNavHighlightClasses(link))}
        >
          {link.icon}
          <span className="ml-auto text-right">{link.label}</span>
        </a>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handleAnchorClick(link)}
        className={cn(baseLinkClasses, getNavHighlightClasses(link))}
      >
        {link.icon}
        <span className="ml-auto text-right">{link.label}</span>
      </button>
    );
  };

  return (
    <aside className={cn('bg-slate-800/95 backdrop-blur-sm p-6 border-l border-slate-700 h-full flex flex-col', className)}>
      <div className="mb-10 text-center space-y-1">
        <h2 className="text-3xl font-black text-white">AI Guide Pro</h2>
        <p className="text-sm text-slate-400">دليلك العربي للذكاء الاصطناعي</p>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-4">
          {links.map((link) => (
            <li key={link.id} className="text-right">
              {renderLink(link)}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
