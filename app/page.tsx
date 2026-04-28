import Link from 'next/link';
import { Upload, Search, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function LandingPage() {
  const session = await auth(); // Standard Auth.js v5 session check [cite: 380, 396]

  if (!session) {
    redirect("/login"); // Protect the route [cite: 388]
  }
  const userRole = session.user?.role;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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