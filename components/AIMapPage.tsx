import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps';

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

type AiLevel = 'Not Available' | 'Low' | 'Medium' | 'High' | 'Very High';

const mapColors: Record<AiLevel, string> = {
  'Not Available': '#475569',
  Low: '#f59e0b',
  Medium: '#facc15',
  High: '#38bdf8',
  'Very High': '#34d399',
};

const levelConfig: Record<AiLevel, { color: string; label: string }> = {
  'Not Available': { color: 'bg-slate-600', label: 'غير متوفر' },
  Low: { color: 'bg-amber-500', label: 'منخفض' },
  Medium: { color: 'bg-yellow-400', label: 'متوسط' },
  High: { color: 'bg-sky-400', label: 'عالي' },
  'Very High': { color: 'bg-emerald-400', label: 'عالي جداً' },
};

// Basic country name mapping (EN to AR)
const countryNameENtoAR: Record<string, string> = {
  'United States of America': 'الولايات المتحدة',
  'United Kingdom': 'المملكة المتحدة',
  China: 'الصين',
  Japan: 'اليابان',
  Germany: 'ألمانيا',
  France: 'فرنسا',
  Canada: 'كندا',
  Australia: 'أستراليا',
  India: 'الهند',
  Brazil: 'البرازيل',
  Russia: 'روسيا',
  'South Korea': 'كوريا الجنوبية',
  Italy: 'إيطاليا',
  Spain: 'إسبانيا',
  Mexico: 'المكسيك',
  Indonesia: 'إندونيسيا',
  Netherlands: 'هولندا',
  'Saudi Arabia': 'السعودية',
  Turkey: 'تركيا',
  Switzerland: 'سويسرا',
  Poland: 'بولندا',
  Belgium: 'بلجيكا',
  Sweden: 'السويد',
  Argentina: 'الأرجنتين',
  Norway: 'النرويج',
  Austria: 'النمسا',
  'United Arab Emirates': 'الإمارات',
  Israel: 'فلسطين',
  Palestine: 'فلسطين',
  Egypt: 'مصر',
  Iraq: 'العراق',
  Jordan: 'الأردن',
  Lebanon: 'لبنان',
  Kuwait: 'الكويت',
  Qatar: 'قطر',
  Bahrain: 'البحرين',
  Oman: 'عمان',
  Yemen: 'اليمن',
  Syria: 'سوريا',
  Morocco: 'المغرب',
  Algeria: 'الجزائر',
  Tunisia: 'تونس',
  Libya: 'ليبيا',
  Sudan: 'السودان',
};

// Sample country data - this would normally come from an API
const sampleCountryData: Record<string, AiLevel> = {
  'United States of America': 'Very High',
  'United Kingdom': 'Very High',
  China: 'Very High',
  Canada: 'High',
  Germany: 'High',
  France: 'High',
  Japan: 'High',
  'South Korea': 'High',
  Australia: 'High',
  Singapore: 'High',
  'Saudi Arabia': 'Medium',
  'United Arab Emirates': 'Medium',
  India: 'Medium',
  Brazil: 'Medium',
  Israel: 'High',
  Palestine: 'Low',
  Egypt: 'Low',
  Kuwait: 'Medium',
  Qatar: 'Medium',
};

const Legend: React.FC = () => (
  <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-xs text-slate-300 space-y-2 w-56 shadow-xl">
    <h4 className="font-bold text-white text-sm text-right mb-3">
      المستوى المعلوماتي
    </h4>
    {Object.entries(levelConfig)
      .filter(([level]) => level !== 'Not Available')
      .reverse()
      .map(([level, { color, label }]) => (
        <div key={level} className="flex items-center justify-end gap-2">
          <span className="flex-grow text-right">{label}</span>
          <div className={`w-4 h-4 rounded-full border border-slate-900 ${color}`}></div>
        </div>
      ))}
  </div>
);

const Instructions: React.FC = () => (
  <div className="absolute top-4 left-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-sm text-slate-200 shadow-xl">
    <p className="flex items-center gap-2">
      <span className="text-xl">💡</span>
      <span>انقر على أي دولة لعرض التقرير المعلوماتي</span>
    </p>
  </div>
);

const UpdateNotice: React.FC = () => (
  <div className="absolute top-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 text-sm text-slate-200 shadow-xl max-w-md">
    <p className="flex items-start gap-2">
      <span className="text-xl">ℹ️</span>
      <span>يتم تحديث البيانات المعلوماتية تلقائياً بواسطة Gemini أسبوعياً</span>
    </p>
  </div>
);

const CountryInfoPanel: React.FC<{ countryName: string; level: AiLevel; onClose: () => void }> = ({
  countryName,
  level,
  onClose,
}) => {
  const nameAR = countryNameENtoAR[countryName] || countryName;
  const levelInfo = levelConfig[level];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full shadow-2xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-white">{nameAR}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h4 className="text-sm text-slate-400 mb-2">المستوى المعلوماتي</h4>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${levelInfo.color}`}></div>
              <span className="text-xl font-bold text-white">{levelInfo.label}</span>
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4">
            <h4 className="text-sm text-slate-400 mb-2">معلومات إضافية</h4>
            <p className="text-slate-300">
              التقرير المعلوماتي الكامل لـ {nameAR} سيتم إضافته قريباً.
              يتم جمع البيانات وتحليلها بواسطة نظام Gemini AI.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AIMapPage() {
  const [tooltip, setTooltip] = useState<{
    content: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const resolveName = (name: string) => {
    if (name === 'Israel') return 'Palestine';
    return name;
  };

  const handleCountryClick = (nameEN: string) => {
    setSelectedCountry(nameEN);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-6xl">🗺️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            خريطة الذكاء الاصطناعي العالمية
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            تقرير معلوماتي شامل لمستوى تبني الذكاء الاصطناعي حول العالم
          </p>
        </div>

        {/* Map Container */}
        <div className="relative bg-slate-900/40 rounded-xl border border-slate-700 overflow-hidden aspect-video shadow-2xl">
          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute bg-black/90 text-white text-sm px-3 py-2 rounded-lg pointer-events-none z-40 shadow-xl border border-slate-600"
              style={{
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(-50%, -120%)',
              }}
            >
              {tooltip.content}
            </div>
          )}

          <ComposableMap
            projectionConfig={{ scale: 160 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ZoomableGroup>
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const props = geo.properties || {};

                    const nameEN = resolveName(
                      props.ADMIN ||
                        props.NAME ||
                        props.NAME_LONG ||
                        props.SOVEREIGNT ||
                        props.name ||
                        'Unknown'
                    );

                    const nameAR = countryNameENtoAR[nameEN] || nameEN;
                    const isSelected = nameEN === selectedCountry;

                    const level: AiLevel = sampleCountryData[nameEN] || 'Not Available';

                    const color = mapColors[level];
                    const levelLabel = levelConfig[level]?.label || level;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => handleCountryClick(nameEN)}
                        onMouseEnter={(evt) => {
                          const container = evt.currentTarget.closest('div.relative');
                          if (container) {
                            const rect = container.getBoundingClientRect();
                            setTooltip({
                              content: `${nameAR} — ${levelLabel}`,
                              x: evt.clientX - rect.left,
                              y: evt.clientY - rect.top,
                            });
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          default: {
                            fill: color,
                            stroke: isSelected ? '#0ea5e9' : '#111827',
                            strokeWidth: isSelected ? 1.5 : 0.5,
                            outline: 'none',
                          },
                          hover: {
                            fill: '#94a3b8',
                            cursor: 'pointer',
                            outline: 'none',
                          },
                          pressed: {
                            fill: '#0284c7',
                            outline: 'none',
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          <Instructions />
          <Legend />
          <UpdateNotice />
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">معلوماتي</h3>
            <p className="text-slate-400">
              بيانات دقيقة ومحدثة عن مستوى التبني التقني للذكاء الاصطناعي
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">معلوماتي</h3>
            <p className="text-slate-400">
              تحليلات عميقة واستراتيجية لفهم التوجهات العالمية في AI
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-xl font-bold text-white mb-2">مدعوم بـ Gemini</h3>
            <p className="text-slate-400">
              تحديثات تلقائية أسبوعية بواسطة نظام الذكاء الاصطناعي Gemini
            </p>
          </div>
        </div>
      </div>

      {/* Country Info Modal */}
      {selectedCountry && (
        <CountryInfoPanel
          countryName={selectedCountry}
          level={sampleCountryData[selectedCountry] || 'Not Available'}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
