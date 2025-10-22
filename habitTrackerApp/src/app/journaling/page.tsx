'use client'
import { useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function Journaling() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [supabase, router]);
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Journaling</h1>
      <p className="text-indigo-600 font-bold text-xl mb-6">Journaling page is working! ✍️</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Today&apos;s Entry</h2>
          <p className="text-gray-600 mb-4">
            Reflect on your day and track your thoughts and feelings.
          </p>
          <div className="p-4 bg-indigo-50 rounded-md">
            <p className="text-sm text-indigo-700">
              📝 Journal editor will be implemented here!
            </p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
          <p className="text-gray-600 mb-4">
            Browse through your previous journal entries and memories.
          </p>
          <div className="p-4 bg-yellow-50 rounded-md">
            <p className="text-sm text-yellow-700">
              📚 Entry history will be displayed here!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
