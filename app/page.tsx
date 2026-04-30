import Link from 'next/link';
import { Upload, Search, ShieldCheck, BarChart3, FileSpreadsheet, Lock } from 'lucide-react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getTeacherStats } from '@/app/actions/markActions';

export default async function LandingPage() {
  const session = await auth(); 

  if (!session) {
    redirect("/login"); 
  }
  const userRole = session.user?.role;
  const userName = session.user?.name || "User";

  let teacherStats = null;
  if (userRole === 'teacher' || userRole === 'admin') {
    teacherStats = await getTeacherStats(session.user?.id as string);
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[100px] opacity-60 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-green-50 rounded-full blur-[80px] opacity-60 transform -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium mb-8 border border-slate-200 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Welcome back, {userName}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-[1.1]">
            Academic Tracking, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
              Simplified for Everyone.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            The modern platform to effortlessly manage and view 10+10+20 internal marks. No more hunting through spreadsheets. Access everything instantly in one secure place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {(userRole === 'teacher' || userRole === 'admin') && (
              <Link href="/upload" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Upload size={20} />
                Upload Marks
              </Link>
            )}
            
            {(userRole === 'student' || userRole === 'admin') && (
              <Link href="/marks" className={`w-full sm:w-auto px-8 py-4 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 ${userRole === 'student' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-slate-900 border border-slate-200 hover:border-slate-300'}`}>
                <Search size={20} />
                View My Results
              </Link>
            )}

            {userRole === 'admin' && (
              <Link href="/admin" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-full font-medium hover:border-slate-300 hover:bg-slate-50 transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <ShieldCheck size={20} />
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Teacher Activity Dashboard */}
      {(userRole === 'teacher' || userRole === 'admin') && teacherStats && teacherStats.history && (
        <section className="py-16 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Teacher Dashboard</h2>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <FileSpreadsheet size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Total Courses Managed</p>
                  <p className="text-3xl font-extrabold text-slate-900">{teacherStats.totalCourses}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md transition">
                <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                  <BarChart3 size={28} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Total Student Records</p>
                  <p className="text-3xl font-extrabold text-slate-900">{teacherStats.totalStudents}</p>
                </div>
              </div>
            </div>

            {/* Recent Activity Table */}
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity Logs</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Course Code</th>
                      <th className="px-6 py-4 font-semibold">Course Title</th>
                      <th className="px-6 py-4 font-semibold">Session & Semester</th>
                      <th className="px-6 py-4 font-semibold text-center">Student Records</th>
                      <th className="px-6 py-4 font-semibold text-right">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {teacherStats.history?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          No upload history found. Upload marks to see your activity here.
                        </td>
                      </tr>
                    ) : (
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      teacherStats.history?.map((log: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 font-bold text-slate-900">{log.courseId.toUpperCase()}</td>
                          <td className="px-6 py-4 text-slate-600">{log.courseTitle}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium text-xs">
                              {log.session} ({log.semester})
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-700">{log.studentCount}</td>
                          <td className="px-6 py-4 text-right text-slate-500">
                            {new Date(log.lastUpdated).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upload Marks Section (Dynamic for Teachers) */}
      {(userRole === 'teacher' || userRole === 'admin') && (
        <section className="py-24 bg-slate-50/50 relative overflow-hidden border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
                  For Educators
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900 tracking-tight">Seamlessly Upload Course Marks</h2>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed font-light">
                  Our bulk upload tool allows you to process your entire class&apos;s internal marks via CSV or Excel in seconds. Simply format your spreadsheet, upload the file, and let our system handle the validation and storage.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Supports standard CSV formats",
                    "Automatic student ID validation",
                    "Instant preview and conflict resolution",
                    "Secure and immutable grade records"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/upload" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group">
                  Go to Upload Portal
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-green-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
                <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-xl">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                     <FileSpreadsheet size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Expected File Format</h3>
                  <p className="text-slate-500 mb-6 text-sm">Ensure your file contains Student ID, CT1, CT2, and Assignment columns.</p>
                  <div className="w-full bg-slate-50 rounded-xl border border-slate-200/60 p-5 font-mono text-sm text-slate-600 overflow-x-auto">
                    <div className="flex gap-8 border-b border-slate-200 pb-3 mb-3 font-bold text-slate-800">
                      <span className="w-20">studentId</span>
                      <span className="w-12">ct1</span>
                      <span className="w-12">ct2</span>
                      <span className="w-16">assign</span>
                    </div>
                    <div className="flex gap-8">
                      <span className="w-20">20210001</span>
                      <span className="w-12 text-blue-600">08</span>
                      <span className="w-12 text-blue-600">09</span>
                      <span className="w-16 text-blue-600">18</span>
                    </div>
                    <div className="flex gap-8 mt-3">
                      <span className="w-20">20210002</span>
                      <span className="w-12 text-blue-600">10</span>
                      <span className="w-12 text-blue-600">07</span>
                      <span className="w-16 text-blue-600">19</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Overview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Built for Clarity</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-light">From the ground up, we designed Mark Tracker to provide a secure, fast, and transparent grading experience.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Analytics",
                description: "View comprehensive breakdowns of performance instantly across all semesters.",
                icon: <BarChart3 size={24} className="text-blue-600" />,
                bg: "bg-blue-50"
              },
              {
                title: "Centralized Records",
                description: "Say goodbye to scattered files. Every mark is safely stored in one structured database.",
                icon: <FileSpreadsheet size={24} className="text-green-600" />,
                bg: "bg-green-50"
              },
              {
                title: "Bank-grade Security",
                description: "Only authorized personnel can upload or modify records, ensuring data integrity.",
                icon: <Lock size={24} className="text-purple-600" />,
                bg: "bg-purple-50"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all bg-white group cursor-default">
                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-out`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}