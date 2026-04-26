import Link from 'next/link';
import { GraduationCap, Upload, Search, ShieldCheck, LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function LandingPage() {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }
  const userRole = session.user?.role;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="text-blue-600" /> MarkTracker
        </h1>
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full capitalize">
                {userRole} View
              </span>
              <Link href="/api/auth/signout" className="text-gray-500 hover:text-red-600">
                <LogOut size={20} />
              </Link>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          {session ? `Welcome back, ${session.user?.name}` : "Centralized Academic Marks, Simplified."}
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          {session
            ? "Access your dashboard and manage your academic progress below."
            : "No more hunting through PDFs. Access your 10+10+20 internal marks instantly."}
        </p>

        {/* Dynamic Action Cards based on Role */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">

          {/* TEACHER & ADMIN: Show Upload Card */}
          {(userRole === 'teacher' || userRole === 'admin') && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-green-600">
              <Upload className="text-green-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Upload Marks</h3>
              <p className="text-gray-600 mb-4">Process 10+10+20 internal marks via CSV/Excel upload[cite: 82, 153].</p>
              <Link href="/upload" className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                Start Bulk Upload
              </Link>
            </div>
          )}

          {/* STUDENT & ADMIN: Show Marks View Card */}
          {(userRole === 'student' || userRole === 'admin') && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-blue-600">
              <Search className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">My Gradebook</h3>
              <p className="text-gray-600 mb-4">View your mark breakdown for current and past sessions[cite: 22, 166].</p>
              <Link href="/marks" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Check My Marks
              </Link>
            </div>
          )}

          {/* ADMIN ONLY: Show System Management Card */}
          {userRole === 'admin' && (
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-purple-600">
              <ShieldCheck className="text-purple-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
              <p className="text-gray-600 mb-4">Manage users, roles, and course assignments[cite: 161].</p>
              <Link href="/admin" className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
                Open Settings
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}