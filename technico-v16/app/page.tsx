'use client';

import { useEffect } from 'react';
import { useAuth } from './components/AuthContext';
import { useRouter } from 'next/navigation';
import TodaysRepairs from './admin/repairs-today/page';
import AllRepairs from './admin/all-repairs/page';
import UserRepairs from './user/user-repairs/page';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        router.push('/login'); // Redirect to login after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <p>A not authenticated user detected... Redirecting to login...</p>;
  }

  return (
    <>
      <h1 className="text-center text-2xl text-gray-600 mt-2">Technico App</h1>
      <p className="text-center text-1xl text-gray-600 mb-2">
        The best app out there.
        By far.
        It&apos;s not even close.
      </p>
      {isAdmin ? <AdminContent /> : <UserContent />}
    </>
  );
}

function AdminContent() {
  return (
    <div className="text-center text-gray-600 mt-5 m-3">
      <h2 className='m-3 text-4xl'>Admin Dashboard</h2>
      <TodaysRepairs />
    </div>
  );
}

function UserContent() {
  return (
    <div className="text-center text-gray-600 mt-5 m-3">
      <h2 className='m-3 text-4xl'>User Dashboard</h2>
      <UserRepairs />
    </div>
  );
}
