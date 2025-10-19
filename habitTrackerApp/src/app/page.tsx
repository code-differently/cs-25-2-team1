import ProgressTracker from "./components/progress-tracker";
import TasksAndReminders from "./components/tasks-and-reminders";
import ToDoList from "./components/todo-list";
import WeeklyStreak from "./components/weekly-streak";
import { Welcome } from "./components/welcome";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <Welcome />
      <div className="mt-4 sm:mt-6 lg:mt-8">
        <WeeklyStreak />
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-24 items-start ml-0 sm:ml-4 lg:ml-8">
        <ProgressTracker />
        <TasksAndReminders />
        <ToDoList />
      </div>
    </div>
  );
}