import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCourseStudents } from "@/app/actions/markActions";
import Link from "next/link";
import { Users, Upload, ArrowLeft, GraduationCap } from "lucide-react";

export default async function ManageCoursePage(props: { params: Promise<{ courseId: string }>, searchParams: Promise<{ session: string, semester: string }> }) {
    const sessionUser = await auth();

    if (!sessionUser || (sessionUser.user.role !== 'teacher' && sessionUser.user.role !== 'admin')) {
        redirect("/login");
    }

    const { courseId } = await props.params;
    const { session, semester } = await props.searchParams;

    if (!session || !semester) {
        redirect("/dashboard/teacher");
    }

    const students = await getCourseStudents(sessionUser.user.id, courseId, session, semester);
    
    // We can infer courseTitle and degree from the first student record
    const courseTitle = students.length > 0 ? students[0].courseTitle : "Unknown Course";
    const degree = students.length > 0 ? students[0].degree : "Unknown Degree";

    // URL safe parameters for the upload pre-fill
    const uploadParams = new URLSearchParams({
        courseCode: courseId.toUpperCase(),
        courseTitle,
        session,
        semester,
        degree
    }).toString();

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto">
                {/* Back Navigation */}
                <Link href="/dashboard/teacher" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-6 transition">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>

                {/* Header Card */}
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded-lg text-sm tracking-wide">
                                {courseId.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 font-semibold rounded-lg text-sm">
                                {session} • {semester}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">{courseTitle}</h1>
                        <p className="text-slate-500 font-medium flex items-center gap-2">
                            <GraduationCap size={18} /> {degree} Program • <Users size={18} className="ml-2" /> {students.length} Enrolled Students
                        </p>
                    </div>

                    <Link href={`/upload?${uploadParams}`} className="px-6 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-sm whitespace-nowrap">
                        <Upload size={18} /> Update Marks
                    </Link>
                </div>

                {/* Students Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="text-xl font-bold text-slate-800">Student Roster</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Student ID</th>
                                    <th className="px-6 py-4 font-semibold text-center">Attendance</th>
                                    <th className="px-6 py-4 font-semibold text-center">Assignment</th>
                                    <th className="px-6 py-4 font-semibold text-center">Midterm</th>
                                    <th className="px-6 py-4 font-semibold text-center text-slate-900 bg-slate-100/50">Total (40)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                                            No students found for this course session.
                                        </td>
                                    </tr>
                                ) : (
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    students.map((student: any) => (
                                        <tr key={student._id.toString()} className="hover:bg-slate-50 transition">
                                            <td className="px-6 py-4 font-bold text-slate-800">{student.studentId}</td>
                                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                                                {student.marks?.attendance != null ? student.marks.attendance : <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                                                {student.marks?.assignment != null ? student.marks.assignment : <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                                                {student.marks?.midterm != null ? student.marks.midterm : <span className="text-slate-300">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-blue-700 bg-blue-50/30">
                                                {student.marks?.total_40 ?? 0}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
