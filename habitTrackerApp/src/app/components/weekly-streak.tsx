
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
    <div className="flex flex-col items-center gap-4 py-8 px-6 bg-white rounded-3xl shadow-sm">
      {/* Title */}
      <h2 className="text-xl font-semibold text-black">Weekly streak</h2>
      
      {/* Days Container */}
      <div className="flex items-center gap-8">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            {/* Day Pill */}
            <div
              className={`w-14 h-32 rounded-full ${
                day.completed
                  ? 'bg-indigo-700'
                  : 'bg-white border-2 border-indigo-700'
              }`}
            />
            {/* Day Label */}
            <span className="text-sm font-medium text-black">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyStreak;
