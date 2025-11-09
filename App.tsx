import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import IntroductionSection from './components/IntroductionSection';
import ToolsShowcaseSection from './components/ToolsShowcaseSection';
import GptToolsSection from './components/GptToolsSection';
import InteractiveBookSection from './components/InteractiveBookSection';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import CoursesSection from './components/CoursesSection';
import CallToActionSection from './components/CallToActionSection';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const CloseIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const App: React.FC = () => {
    const [view, setView] = useState<'home' | 'tools' | 'book'>('home');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNavigate = (targetView: 'home' | 'tools' | 'book') => {
        setView(targetView);
        setIsMenuOpen(false); // Close menu on navigation
    };

    const renderContent = () => {
        switch (view) {
            case 'home':
                return (
                    <>
                        <Hero />
                        <div className="relative z-10">
                            <IntroductionSection />
                            <CoursesSection />
                            <CallToActionSection />
                        </div>
                    </>
                );
            case 'tools':
                return (
                    <div className="relative z-10 py-10">
                        <ToolsShowcaseSection />
                        <GptToolsSection />
                    </div>
                );
            case 'book':
                return (
                    <div className="relative z-10 py-10">
                        <InteractiveBookSection />
                    </div>
                );
            default:
                return <Hero />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Sidebar for desktop */}
            <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
                 <SideMenu activeView={view} onNavigate={handleNavigate} className="fixed top-0 right-0 h-full w-64 lg:w-72" />
            </div>

            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)}></div>
            )}
            
            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <SideMenu activeView={view} onNavigate={handleNavigate} />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col md:mr-64 lg:mr-72">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 bg-slate-900/80 backdrop-blur-sm z-30 flex items-center justify-between p-4 border-b border-slate-800">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                    <h1 className="text-xl font-bold text-white">AI Guide Pro</h1>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {renderContent()}
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default App;