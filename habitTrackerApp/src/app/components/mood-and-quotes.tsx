import React, { useState } from 'react';
import { useDailyQuote } from '../../hooks/useDailyQuote';

const MoodAndQuote = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { quote, loading, error, refreshQuote } = useDailyQuote();

  // Custom SVG Icons
  const HappyFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="35" cy="40" r="4" fill="currentColor"/>
      <circle cx="65" cy="40" r="4" fill="currentColor"/>
      <path d="M 30 55 Q 50 70 70 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const JoyFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M 28 38 L 32 42 L 38 36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 62 36 L 68 42 L 72 38" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M 30 55 Q 50 75 70 55" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const FearFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="35" cy="35" r="5" fill="currentColor"/>
      <circle cx="65" cy="35" r="5" fill="currentColor"/>
      <ellipse cx="50" cy="65" rx="8" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const DisgustFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="30" y1="38" x2="40" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="60" y1="42" x2="70" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 35 65 Q 40 58 45 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const AngerFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="25" y1="32" x2="42" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="38" x2="75" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 30 70 Q 50 55 70 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const SurprisedFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="35" cy="40" r="4" fill="currentColor"/>
      <circle cx="65" cy="40" r="4" fill="currentColor"/>
      <circle cx="50" cy="65" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );

  const AnxiousFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M 30 35 Q 35 40 40 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 60 35 Q 65 40 70 35" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M 35 65 Q 50 60 65 65" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const SadFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <circle cx="35" cy="40" r="4" fill="currentColor"/>
      <circle cx="65" cy="40" r="4" fill="currentColor"/>
      <path d="M 30 70 Q 50 55 70 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const AnnoyedFace = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2"/>
      <line x1="28" y1="35" x2="42" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="58" y1="40" x2="72" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="35" y1="68" x2="65" y2="68" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );

  const moods = [
    { id: 'happy', icon: HappyFace, label: 'Happy', color: 'text-yellow-500' },
    { id: 'joy', icon: JoyFace, label: 'Joy', color: 'text-pink-500' },
    { id: 'fear', icon: FearFace, label: 'Fear', color: 'text-purple-500' },
    { id: 'disgust', icon: DisgustFace, label: 'Disgust', color: 'text-green-600' },
    { id: 'anger', icon: AngerFace, label: 'Anger', color: 'text-red-500' },
    { id: 'surprised', icon: SurprisedFace, label: 'Surprised', color: 'text-blue-500' },
    { id: 'anxious', icon: AnxiousFace, label: 'Anxious', color: 'text-orange-500' },
    { id: 'sad', icon: SadFace, label: 'Sad', color: 'text-blue-400' },
    { id: 'annoyed', icon: AnnoyedFace, label: 'Annoyed', color: 'text-gray-600' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full sm:w-64 lg:w-64">
      {/* Mood Tracker Card */}
      <div className="flex flex-col items-center justify-center py-6 px-4 sm:px-8 bg-white border-2 border-gray-300 rounded-3xl h-36 sm:h-44">
        <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-4">Mood</h3>
        
        {selectedMood ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex flex-col items-center gap-1">
              {(() => {
                const mood = moods.find(m => m.id === selectedMood);
                if (!mood) return null;
                const IconComponent = mood.icon;
                return (
                  <>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 ${mood.color}`}>
                      <IconComponent />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-500 text-center">Today I feel {mood.label.toLowerCase()}</span>
                  </>
                );
              })()}
            </div>
            <button
              onClick={() => {
                setSelectedMood(null);
                setIsDropdownOpen(false);
              }}
              className="text-xs text-blue-500 hover:text-blue-600 underline mt-1"
            >
              Change mood
            </button>
          </div>
        ) : (
          <div className="w-full relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 sm:px-4 py-2 text-xs sm:text-sm border-2 border-black rounded-full bg-white text-left flex items-center justify-between focus:outline-none focus:border-blue-500"
            >
              <span className="text-gray-500">Today I feel...</span>
              <span className="text-black">{isDropdownOpen ? '∧' : '∨'}</span>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute w-full mt-1 bg-white border-2 border-black rounded-2xl overflow-hidden z-10 max-h-32 sm:max-h-48 overflow-y-auto">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => {
                      setSelectedMood(mood.id);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 sm:px-4 py-2 text-left hover:bg-gray-100 text-black transition-colors text-xs sm:text-sm"
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Daily Quote Card */}
      <div className="flex flex-col items-center justify-center py-4 px-4 sm:px-6 bg-indigo-700 rounded-3xl h-36 sm:h-44 relative">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            <span className="text-xs text-white/80">Loading quote...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-sm text-white/90">💭</span>
            <span className="text-xs text-white/80">Quote unavailable</span>
            <button 
              onClick={refreshQuote}
              className="text-xs text-white underline hover:text-white/80"
            >
              Try again
            </button>
          </div>
        ) : quote ? (
          <div className="flex flex-col items-center text-center h-full justify-between px-1">
            <div className="flex-1 flex flex-col justify-center min-h-0">
              <p className={`text-white leading-relaxed mb-2 overflow-hidden font-medium ${
                  quote.quote.length > 100 
                    ? 'text-xs sm:text-sm' 
                    : quote.quote.length > 60 
                    ? 'text-sm sm:text-base' 
                    : 'text-sm sm:text-lg'
                }`}
                 style={{
                   display: '-webkit-box',
                   WebkitLineClamp: quote.quote.length > 100 ? 4 : 3,
                   WebkitBoxOrient: 'vertical',
                   lineHeight: quote.quote.length > 100 ? '1.3' : '1.4'
                 }}>
                "{quote.quote}"
              </p>
              <p className="text-xs sm:text-sm text-white/80 font-medium">
                — {quote.author}
              </p>
            </div>
            <button 
              onClick={refreshQuote}
              className="text-xs text-white/60 hover:text-white/80 transition-colors mt-1 flex-shrink-0"
              title="Get new quote"
            >
              ↻
            </button>
          </div>
        ) : (
          <div className="text-center">
            <span className="text-sm text-white/90">💭</span>
            <p className="text-xs text-white/80 mt-1">No quote available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodAndQuote;
