import Link from 'next/link';
import { GraduationCap, LogOut } from 'lucide-react';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
      <Link href="/" className="text-xl font-bold flex items-center gap-2 text-blue-600">
        <GraduationCap /> MarkTracker
      </Link>

      {session ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {session.user?.name} {session.user?.role ? `(${session.user.role})` : ''}
          </span>

          {/* Sign Out Form using Server Action */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
              <span className="text-sm font-semibold hidden sm:inline">Logout</span>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}
