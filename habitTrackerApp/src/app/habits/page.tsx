'use client'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Habits() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login');
    }
  }, [user, isLoaded, router]);
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Habits</h1>
      <p className="text-purple-600 font-bold text-xl mb-6">Habits page is working! ✅</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Habit</h2>
          <p className="text-gray-600 mb-4">
            Build healthy routines by creating and tracking new habits.
          </p>
          <div className="p-4 bg-purple-50 rounded-md">
            <p className="text-sm text-purple-700">
              🔧 Habit creation form will be implemented here!
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Habits</h2>
          <p className="text-gray-600 mb-4">
            View and manage your current active habits.
          </p>
          <div className="p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-700">
              📋 Your habit list will appear here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
