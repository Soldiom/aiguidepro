import { NavigationLink } from './navigationConfig';

export const getNavHighlightClasses = (link: NavigationLink, isActive = false) => {
  if (link.highlight === 'gradient') {
    return isActive
      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/20'
      : 'text-white bg-gradient-to-r from-emerald-500/70 to-teal-500/70 font-bold';
  }

  if (link.highlight === 'primary') {
    return 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/40 font-semibold';
  }

  if (link.highlight === 'accent') {
    return isActive
      ? 'bg-gradient-to-r from-purple-500 to-emerald-500 text-white font-bold'
      : 'text-white border border-purple-500/40 bg-purple-900/30 font-semibold';
  }

  return isActive
    ? 'bg-slate-800/80 text-white font-semibold border-slate-700'
    : 'text-slate-300 hover:text-white hover:bg-slate-800/80';
};
