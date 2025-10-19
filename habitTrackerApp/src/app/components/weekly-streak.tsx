
const WeeklyStreak = () => {
  const days = [
    { label: 'M', completed: true },
    { label: 'T', completed: false },
    { label: 'W', completed: true },
    { label: 'TH', completed: true },
    { label: 'F', completed: true },
    { label: 'S', completed: false },
    { label: 'SU', completed: false }
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:py-8 px-4 sm:px-6 bg-white rounded-3xl shadow-sm">
      {/* Title */}
      <h2 className="text-lg sm:text-xl font-semibold text-black">Weekly streak</h2>
      
      {/* Days Container */}
      <div className="flex items-center gap-2 sm:gap-4 lg:gap-8 overflow-x-auto w-full justify-center">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2 flex-shrink-0">
            {/* Day Pill */}
            <div
              className={`w-10 sm:w-12 lg:w-14 h-20 sm:h-28 lg:h-32 rounded-full ${
                day.completed
                  ? 'bg-indigo-700'
                  : 'bg-white border-2 border-indigo-700'
              }`}
            />
            {/* Day Label */}
            <span className="text-xs sm:text-sm font-medium text-black">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyStreak;
