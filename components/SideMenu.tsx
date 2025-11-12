import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { isAdmin } from '../utils/admin';

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

interface SideMenuProps { className?: string; }

const SideMenu: React.FC<SideMenuProps> = ({ className }) => {
    const [admin, setAdmin] = useState(false);
    useEffect(() => {
        setAdmin(isAdmin());
        const onStorage = () => setAdmin(isAdmin());
        const onCustom = () => setAdmin(isAdmin());
        window.addEventListener('storage', onStorage);
        window.addEventListener('aiguidepro-admin-change', onCustom as EventListener);
        return () => {
            window.removeEventListener('storage', onStorage);
            window.removeEventListener('aiguidepro-admin-change', onCustom as EventListener);
        };
    }, []);
    return (
        <aside className={`bg-slate-800 p-6 border-l border-slate-700 h-full flex flex-col ${className}`}>
            <div className="mb-10 text-center">
                 <h2 className="text-3xl font-black text-white">AI Guide Pro</h2>
                 <p className="text-sm text-slate-400">دليلك العربي للذكاء الاصطناعي</p>
            </div>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <HomeIcon />
                            الرئيسية
                        </NavLink>
                    </li>
                    <li>
                        <a
                            href="#vision"
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById('vision');
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                } else {
                                    window.location.href = '/#vision';
                                }
                            }}
                            className="flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            رؤيتنا ورسالتنا
                        </a>
                    </li>
                    <li>
                        <NavLink
                            to="/tools"
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <ToolsIcon />
                            الأدوات
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/vote"
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6a2 2 0 012 2v6a2 2 0 01-2 2H3V7z" />
                            </svg>
                            تصويت الدورات
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/book"
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <BookIcon />
                            الكتاب
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/news"
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2z" />
                            </svg>
                            الأخبار والأبحاث
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/courses"
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                            </svg>
                            الدورات 🎓
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/ai-features"
                            className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            ميزات AI 🚀
                        </NavLink>
                    </li>
                        {admin && (
                            <li>
                                <NavLink
                                    to="/adminali"
                                    className={({ isActive }) => `flex items-center px-4 py-3 text-lg rounded-lg transition-colors duration-200 ${isActive ? 'bg-emerald-500/10 text-emerald-300 font-bold' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}
                                >
                                    إدارة الدورات
                                </NavLink>
                            </li>
                        )}
                </ul>
            </nav>
        </aside>
    );
};

export default SideMenu;
