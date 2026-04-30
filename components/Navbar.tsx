'use client';
import Link from 'next/link';
import { GraduationCap, LogOut, LayoutDashboard, User, BookOpen } from 'lucide-react';
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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all duration-300">
              <GraduationCap size={24} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-colors duration-300">
              MarkTracker
            </span>
          </Link>

          {/* Navigation/Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/guide"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-slate-50"
              title="User Guide"
            >
              <BookOpen size={18} />
              <span className="hidden sm:inline">Guide</span>
            </Link>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {status === 'loading' ? (
              <div className="h-10 w-40 bg-slate-100/80 animate-pulse rounded-full"></div>
            ) : session ? (
              <div className="flex items-center gap-3 sm:gap-5">
                {(session.user?.role === 'teacher' || session.user?.role === 'admin') && (
                  <Link
                    href="/dashboard/teacher"
                    className="hidden md:flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-full transition-all duration-200"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                )}

                <div className="flex items-center gap-3 pl-2 sm:pl-5 sm:border-l border-slate-200/80">
                  <div className="hidden sm:flex flex-col items-end justify-center">
                    <span className="text-sm font-bold text-slate-800 leading-tight">
                      {session.user?.name}
                    </span>
                    <span className="text-xs font-semibold text-blue-600 capitalize bg-blue-50 px-2 py-0.5 rounded-md mt-0.5">
                      {session.user?.role}
                    </span>
                  </div>

                  <div className="h-10 w-10 rounded-full bg-linear-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-sm flex items-center justify-center text-slate-600 group hover:border-blue-300 hover:text-blue-600 transition-colors">
                    <User size={20} />
                  </div>

                  <button
                    onClick={handleLogout}
                    disabled={isPending}
                    className="ml-1 sm:ml-2 flex items-center justify-center w-10 h-10 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 hover:shadow-sm transition-all duration-200 disabled:opacity-50"
                    title="Sign Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-semibold bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
