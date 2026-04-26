import Link from 'next/link';
import { GraduationCap, Upload, Search, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <GraduationCap className="text-blue-600" /> MarkTracker
        </h1>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Centralized Academic Marks, Simplified.
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          No more hunting through PDFs. Access your 10+10+20 internal marks instantly.
        </p>

        {/* Priority Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {/* Student Feature */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Search className="text-blue-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">For Students</h3>
            <p className="text-gray-600 mb-4">Search by University ID to see your specific mark breakdown.</p>
            <Link href="/marks" className="text-blue-600 font-semibold hover:underline">View My Marks →</Link>
          </div>

          {/* Teacher Feature - Priority 1 */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <Upload className="text-green-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">For Teachers</h3>
            <p className="text-gray-600 mb-4">Bulk upload marks via CSV/Excel for your course sessions.</p>
            <Link href="/upload" className="text-green-600 font-semibold hover:underline">Upload CSV →</Link>
          </div>

          {/* Admin Feature */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <ShieldCheck className="text-purple-600 mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">For Admins</h3>
            <p className="text-gray-600 mb-4">Manage users, courses, and overall system accuracy.</p>
            <Link href="/admin" className="text-purple-600 font-semibold hover:underline">Manage Portal →</Link>
          </div>
        </div>
      </main>
    </div>
  );
}