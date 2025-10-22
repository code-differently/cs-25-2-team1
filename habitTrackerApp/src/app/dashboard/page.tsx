import { Navbar } from '../components/navbar';

export default function Dashboard() {
  return (
    <div className="flex">
      <Navbar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Habit Progress</h2>
              <p className="text-gray-600">Track your daily habits and see your progress over time.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibinal mb-4">Recent Activity</h2>
              <p className="text-gray-600">View your recent habit completions and journal entries.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <p className="text-gray-600">Get an overview of your habit tracking statistics.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
