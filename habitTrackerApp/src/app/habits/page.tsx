import { Navbar } from '../components/navbar';

export default function Habits() {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Habits</h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Habit Tracker</h2>
            <p className="text-gray-600">Create, manage, and track your daily habits here.</p>
            {/* Add your habit tracking functionality here */}
          </div>
        </div>
      </main>
    </div>
  );
}
