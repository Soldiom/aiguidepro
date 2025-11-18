import React from 'react';
import { UNIFIED_SYSTEM_URL } from './ui/UnifiedSystemButton';

const iconBase = 'h-5 w-5 ml-3 flex-shrink-0';

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const VisionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ToolsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const VoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h8" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6a2 2 0 012 2v6a2 2 0 01-2 2H3V7z" />
  </svg>
);

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const NewsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2z" />
  </svg>
);

const CoursesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
  </svg>
);

const LightningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChipIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
    <rect x="9" y="9" width="6" height="6" rx="1.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className={iconBase} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export type NavigationLinkType = 'route' | 'anchor' | 'external';
export type NavigationHighlight = 'default' | 'primary' | 'gradient' | 'accent';

export interface NavigationLink {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: NavigationLinkType;
  to?: string;
  href?: string;
  targetId?: string;
  highlight?: NavigationHighlight;
  requiresAdmin?: boolean;
}

export const navigationLinks: NavigationLink[] = [
  { id: 'home', label: 'الرئيسية', icon: <HomeIcon />, type: 'route', to: '/' },
  { id: 'vision', label: 'رؤيتنا ورسالتنا', icon: <VisionIcon />, type: 'anchor', targetId: 'vision', href: '/#vision' },
  { id: 'tools', label: 'الأدوات', icon: <ToolsIcon />, type: 'route', to: '/tools' },
  { id: 'vote', label: 'تصويت الدورات', icon: <VoteIcon />, type: 'route', to: '/vote' },
  { id: 'book', label: 'الكتاب', icon: <BookIcon />, type: 'route', to: '/book' },
  { id: 'news', label: 'الأخبار والأبحاث', icon: <NewsIcon />, type: 'route', to: '/news' },
  { id: 'courses', label: 'الدورات 🎓', icon: <CoursesIcon />, type: 'route', to: '/courses', highlight: 'gradient' },
  { id: 'ai-features', label: 'ميزات AI 🚀', icon: <LightningIcon />, type: 'route', to: '/ai-features', highlight: 'accent' },
  { id: 'unified', label: 'النظام الموحد 🤖🔧', icon: <ChipIcon />, type: 'external', href: UNIFIED_SYSTEM_URL, highlight: 'primary' },
  { id: 'admin', label: 'إدارة الدورات', icon: <ShieldIcon />, type: 'route', to: '/adminali', requiresAdmin: true },
];
