import { Navbar } from '../components/navbar';

export default function Calendar() {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Habit Calendar</h2>
            <p className="text-gray-600">View your habit completion calendar and plan your schedule.</p>
            {/* Add your calendar functionality here */}
          </div>
        </div>
      </main>
    </div>
  );
}
