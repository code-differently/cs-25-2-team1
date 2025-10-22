import Link from "next/link";
import { FC } from "react";


export interface NavbarProps {}

export const Navbar: FC<NavbarProps> = ({}) => {
    return (
        <nav className="bg-indigo-700 p-6 text-white h-screen w-64 fixed left-0 top-0 flex flex-col items-center justify-start space-y-6">
            <div className="text-center mb-8">
                <div className="font-bold text-lg">Habit Tracker</div>
                <div className="text-sm">Stay on track</div>
            </div>

            {/* navigation links*/}
            <Link href="/" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                Dashboard
            </Link>
            <Link href="/habits" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                Habits
            </Link>
            <Link href="/calendar" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                Calendar
            </Link>
            <Link href="/journaling" className="nav-link hover:bg-indigo-500 hover:text-neutral-950 active:bg-indigo-800 text-center w-full py-2 rounded">
                Journaling
            </Link>
        </nav>
        
    )
}