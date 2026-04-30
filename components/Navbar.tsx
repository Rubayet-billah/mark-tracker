'use client';
import Link from 'next/link';
import { GraduationCap, LogOut, BarChart3 } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useTransition } from 'react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      // signOut from next-auth/react clears the client cache and logs out
      await signOut({ callbackUrl: '/login' });
    });
  };

  return (
    <nav className="border-b bg-white p-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold flex items-center gap-2 text-blue-600">
        <GraduationCap /> MarkTracker
      </Link>

      {status === 'loading' ? (
         <div className="h-6 w-24 bg-slate-100 animate-pulse rounded"></div>
      ) : session ? (
        <div className="flex items-center gap-6">
          {(session.user?.role === 'teacher' || session.user?.role === 'admin') && (
            <Link href="/dashboard/teacher" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition flex items-center gap-1.5">
              <BarChart3 size={16} /> <span className="hidden sm:inline">Teacher Dashboard</span>
            </Link>
          )}
          <span className="text-sm font-medium text-slate-600 hidden md:inline">
            {session.user?.name} <span className="text-slate-400 capitalize">({session.user?.role})</span>
          </span>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Sign Out"
          >
            <LogOut size={20} />
            <span className="text-sm font-semibold hidden sm:inline">{isPending ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
