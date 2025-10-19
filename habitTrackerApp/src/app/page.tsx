import { Welcome } from "./components/welcome";
import WeeklyStreak from "./components/weekly-streak";
import ProgressTracker from "./components/progress-tracker";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Welcome />
      <div className="mt-8">
        <WeeklyStreak />
      </div>
      <div className="mt-8">
        <ProgressTracker />
      </div>
    </div>
  );
}