import { Welcome } from "./components/welcome";
import WeeklyStreak from "./components/weekly-streak";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Welcome />
      <div className="mt-8">
        <WeeklyStreak />
      </div>
      <h1 className="text-white mt-8">Hello Habit Tracker 👋</h1>
    </div>
  );
}