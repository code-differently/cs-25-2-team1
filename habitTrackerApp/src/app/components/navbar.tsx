import Link from "next/link";
import { FC } from "react";


export interface NavbarProps {
    url: string;
    title: string;
}

export const Navbar: FC<NavbarProps> = ({ url, title }) => {
    return (
        <nav className="bg-indigo-700 p-6 text-white h-screen w-64 fixed left-0 top-0 flex flex-col items-center justify-start space-y-6">
            <div className="text-center mb-8">
                <div className="font-bold text-lg">{url}</div>
                <div className="text-sm">{title}</div>
            </div>

            {/* navigation links*/}
            <Link href="/dashboard" className="nav-link hover:underline text-center w-full py-2">
                Dashboard
            </Link>
            <Link href="/habits" className="nav-link hover:underline text-center w-full py-2">
                Habits
            </Link>
            <Link href="/calendar" className="nav-link hover:underline text-center w-full py-2">
                Calendar
            </Link>
            <Link href="/journaling" className="nav-link hover:underline text-center w-full py-2">
                Journaling
            </Link>
        </nav>
        
    )
}