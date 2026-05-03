import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getTeacherCourses } from "@/app/actions/markActions";
import Link from "next/link";
import { Users, FileSpreadsheet, ArrowRight, LayoutDashboard } from "lucide-react";

export default async function TeacherDashboard() {
    const session = await auth();

    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
        redirect("/login");

    }
    console.log(session);
    const history = await getTeacherCourses(session.user.id);

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <LayoutDashboard className="text-blue-600" /> My Courses
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg">Manage your classes and update student marks securely.</p>
                    </div>
                    <Link href="/upload" className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm">
                        <FileSpreadsheet size={18} /> Upload New Marks
                    </Link>
                </div>

                {history.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <FileSpreadsheet size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No Courses Found</h3>
                        <p className="text-slate-500 mb-6 max-w-md mx-auto">You haven&apos;t uploaded marks for any courses yet. Once you upload a CSV, your courses will appear here.</p>
                        <Link href="/upload" className="inline-flex px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition shadow-sm">
                            Go to Upload Tool
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {history.map((course: any, idx: number) => {
                            // URL encode parameters for safe routing
                            const queryParams = new URLSearchParams({
                                session: course.session,
                                semester: course.semester
                            }).toString();

                            return (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group flex flex-col h-full">
                                    <div className="mb-4 flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-sm tracking-wide">
                                                {course.courseId.toUpperCase()}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded-md">
                                                {course.degree}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2" title={course.courseTitle}>
                                            {course.courseTitle}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <span className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Session: <span className="font-semibold text-slate-800">{course.session}</span></span>
                                            <span className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">Semester: <span className="font-semibold text-slate-800">{course.semester}</span></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                            <Users size={16} className="text-slate-400" />
                                            {course.studentCount} Students
                                        </div>
                                        <Link
                                            href={`/dashboard/teacher/${course.courseId}?${queryParams}`}
                                            className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:text-blue-700 transition"
                                        >
                                            Manage Marks <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
