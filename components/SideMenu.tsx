import React from 'react';

// Icons as simple SVG components
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);
const ToolsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

type View = 'home' | 'tools' | 'book';

interface SideMenuProps {
    activeView: View;
    onNavigate: (view: View) => void;
    className?: string;
}

const NavLink: React.FC<{
    view: View;
    activeView: View;
    onNavigate: (view: View) => void;
    children: React.ReactNode;
}> = ({ view, activeView, onNavigate, children }) => {
    const isActive = activeView === view;
    return (
        <li>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    onNavigate(view);
                }}
                className={`flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${
                    isActive
                        ? 'bg-emerald-500/10 text-emerald-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
            >
                {children}
            </a>
        </li>
    );
};


const SideMenu: React.FC<SideMenuProps> = ({ activeView, onNavigate, className }) => {
    return (
        <aside className={`bg-slate-800 p-6 border-l border-slate-700 h-full flex flex-col ${className}`}>
            <div className="mb-10 text-center">
                 <h2 className="text-3xl font-black text-white">AI Guide Pro</h2>
                 <p className="text-sm text-slate-400">دليلك العربي للذكاء الاصطناعي</p>
            </div>
            <nav>
                <ul className="space-y-4">
                    <NavLink view="home" activeView={activeView} onNavigate={onNavigate}>
                        <HomeIcon />
                        الرئيسية
                    </NavLink>
                    <NavLink view="tools" activeView={activeView} onNavigate={onNavigate}>
                        <ToolsIcon />
                        الأدوات
                    </NavLink>
                    <NavLink view="book" activeView={activeView} onNavigate={onNavigate}>
                        <BookIcon />
                        الكتاب
                    </NavLink>
                </ul>
            </nav>
        </aside>
    );
};

export default SideMenu;
