import ProgressTracker from "./components/progress-tracker";
import TasksAndReminders from "./components/tasks-and-reminders";
import ToDoList from "./components/todo-list";
import WeeklyStreak from "./components/weekly-streak";
import { Welcome } from "./components/welcome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Welcome />
      <div className="mt-8">
        <WeeklyStreak />
      </div>
      <div className="mt-8 flex gap-24 items-start ml-8">
        <ProgressTracker />
        <TasksAndReminders />
        <ToDoList />
      </div>
    </div>
  );
}