import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import IntroductionSection from './components/IntroductionSection';
import ToolsShowcaseSection from './components/ToolsShowcaseSection';
import GptToolsSection from './components/GptToolsSection';
import InteractiveBookSection from './components/InteractiveBookSection';
import Footer from './components/Footer';
import SideMenu from './components/SideMenu';
import CoursesSection from './components/CoursesSection';
import CallToActionSection from './components/CallToActionSection';
import VisionMissionSection from './components/VisionMissionSection';
import CommunityVoting from './components/CommunityVoting';
import NewsArabicImproved from './components/NewsArabicImproved';
import AIFeaturesPage from './components/AIFeaturesPage';
import CoursesPage from './components/CoursesPage';
import NoraChatBot from './components/NoraChatBot';
import AgenticAISection from './components/AgenticAISection';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminCourseGenerator from './components/AdminCourseGenerator';
import CourseSuggestionsVoting from './components/CourseSuggestionsVoting';
import PdfImporter from './components/PdfImporter';
import { isAdmin, setAdmin } from './utils/admin';
import { startAutoCourseFlow } from './services/autoCourseOrchestrator';

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const [canAdmin, setCanAdmin] = useState<boolean>(isAdmin());

    // Close the mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
        // allow enabling admin via query param admin=1
        try {
            const params = new URLSearchParams(location.search);
            if (params.get('admin') === '1') {
                setAdmin(true);
            }
        } catch {}
        setCanAdmin(isAdmin());
    }, [location.pathname, location.hash]);

    // Start background automation once on first mount
    useEffect(() => {
        startAutoCourseFlow();
    }, []);

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Sidebar for desktop */}
            <div className="hidden md:block md:w-64 lg:w-72 flex-shrink-0">
                 <SideMenu className="fixed top-0 right-0 h-full w-64 lg:w-72" />
            </div>

            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMenuOpen(false)}></div>
            )}
            
            {/* Mobile Sidebar */}
            <div className={`md:hidden fixed top-0 right-0 h-full w-64 bg-slate-800 z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <SideMenu />
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
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <>
                                    <Hero />
                                    <div className="relative z-10">
                                        <IntroductionSection />
                                        <VisionMissionSection />
                                        <AgenticAISection />
                                        <CoursesSection />
                                        <CallToActionSection />
                                    </div>
                                </>
                            }
                        />
                        <Route
                            path="/adminali"
                            element={
                                <div className="relative z-10">
                                    {canAdmin ? (
                                        <>
                                            <AdminCourseGenerator />
                                            <CourseSuggestionsVoting />
                                            <PdfImporter />
                                        </>
                                    ) : (
                                        <div className="py-32 text-center text-slate-300">
                                            <h2 className="text-3xl font-bold mb-4 text-white">غير مصرح</h2>
                                            <p className="mb-6">هذه الصفحة مخصصة للمسؤول فقط.</p>
                                            <p className="text-sm text-slate-500">(أضف ?admin=1 إلى الرابط لتمكين وضع الإدارة محلياً)</p>
                                        </div>
                                    )}
                                </div>
                            }
                        />
                        <Route
                            path="/tools"
                            element={
                                <div className="relative z-10 py-10">
                                    <ToolsShowcaseSection />
                                    <GptToolsSection />
                                </div>
                            }
                        />
                        <Route
                            path="/book"
                            element={
                                <div className="relative z-10 py-10">
                                    <InteractiveBookSection />
                                </div>
                            }
                        />
                        <Route
                            path="/vote"
                            element={<CommunityVoting />}
                        />
                        <Route
                            path="/news"
                            element={<NewsArabicImproved />}
                        />
                        <Route
                            path="/ai-features"
                            element={<AIFeaturesPage />}
                        />
                        <Route
                            path="/courses"
                            element={<CoursesPage />}
                        />
        <Route path="/about" element={
                            <div className="relative z-10 py-20 px-4 max-w-4xl mx-auto">
                                <h1 className="text-4xl font-bold text-white mb-6">عن المنصة</h1>
                                <div className="bg-slate-800 rounded-lg p-8 text-slate-300 space-y-4">
                                    <p>AI Guide Pro هي منصة عربية متكاملة لتعليم الذكاء الاصطناعي.</p>
                                    <p>نهدف إلى توفير محتوى عربي عالي الجودة في مجال الذكاء الاصطناعي.</p>
                                </div>
                            </div>
                        } />

                    </Routes>
                    <Footer />
                </main>
            </div>
            
            {/* Nora AI ChatBot - Available on all pages */}
            <NoraChatBot />
        </div>
    );
};

export default App;