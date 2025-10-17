import { Welcome } from "./components/welcome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Welcome />
      <h1 className="text-white mt-8">Hello Habit Tracker 👋</h1>
    </div>
  );
}