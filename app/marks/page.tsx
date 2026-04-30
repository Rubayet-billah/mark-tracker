/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, Layout, CheckCircle2 } from 'lucide-react';
import { auth } from '@/auth';
import { connectDB } from '@/lib/db';
import Mark from '@/models/Mark';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import PrintButton from '@/components/PrintButton';

export default async function StudentMarksPage(
    props: { searchParams?: Promise<{ query?: string, course?: string, session?: string, semester?: string }> }
) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const course = searchParams?.course || '';
    const sessionParam = searchParams?.session || '';
    const semester = searchParams?.semester || '';

    await connectDB();
    const session = await auth();
    if (!session) redirect('/login');

    let universityId = query;
    const isStudent = session.user.role === 'student';

    // If user is a student, lock the search to their own University ID
    if (isStudent) {
        const user = await User.findById(session.user.id);
        if (user) {
            universityId = user.universityId;
        }
    }

    const isSearchComplete = sessionParam && semester && course;
    let marksData: any[] = [];

    if (isSearchComplete) {
        const filter: any = {
            session: sessionParam,
            semester: semester,
            courseId: new RegExp(`^${course}$`, 'i')
        };
        if (universityId) {
            filter.studentId = new RegExp(`^${universityId}$`, 'i');
        }

        // Fetch marks based on the filter
        marksData = await Mark.find(filter).sort({ studentId: 1 }).lean();
    }

    const isAttendanceComplete = marksData.length > 0 && marksData.every(m => m.marks?.attendance != null && m.marks?.attendance !== '');
    const isAssignmentComplete = marksData.length > 0 && marksData.every(m => m.marks?.assignment != null && m.marks?.assignment !== '');
    const isMidtermComplete = marksData.length > 0 && marksData.every(m => m.marks?.midterm != null && m.marks?.midterm !== '');
    const isAllComplete = marksData.length > 0 && isAttendanceComplete && isAssignmentComplete && isMidtermComplete;

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* SEARCH FORM (Hidden when printing) */}
            <div className="print:hidden">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Mark Records</h1>

                <form method="GET" action="/marks" className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Session</label>
                            <select name="session" defaultValue={sessionParam} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                                <option value="" disabled>Select Session</option>
                                <option value="2018-19">2018-19</option>
                                <option value="2019-20">2019-20</option>
                                <option value="2020-21">2020-21</option>
                                <option value="2021-22">2021-22</option>
                                <option value="2022-23">2022-23</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2026-27">2026-27</option>
                                <option value="2027-28">2027-28</option>
                                <option value="2028-29">2028-29</option>
                                <option value="2029-30">2029-30</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                            <select name="semester" defaultValue={semester} className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required>
                                <option value="" disabled>Select Semester</option>
                                <option value="1.1">1.1</option>
                                <option value="1.2">1.2</option>
                                <option value="2.1">2.1</option>
                                <option value="2.2">2.2</option>
                                <option value="3.1">3.1</option>
                                <option value="3.2">3.2</option>
                                <option value="4.1">4.1</option>
                                <option value="4.2">4.2</option>
                                <option value="5.1">5.1</option>
                                <option value="5.2">5.2</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Course Code</label>
                            <input type="text" name="course" defaultValue={course} placeholder="e.g. PHY301" required className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        {/* {!isStudent && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID (Optional)</label>
                                <input type="text" name="query" defaultValue={query} placeholder="e.g. 2021001" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        )} */}
                        <div className={isStudent ? "md:col-span-1" : "md:col-span-4 flex justify-end"}>
                            <button type="submit" className="w-full md:w-auto bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                <Search size={18} /> View Marks
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* RESULTS DOCUMENT */}
            {isSearchComplete ? (
                <div className="bg-white print:bg-transparent">
                    {/* 1. Header & Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Layout className="text-blue-600 print:text-black" /> Academic Records
                        </h2>
                        <PrintButton />
                    </div>

                    {/* 2. Course Metadata Header - Visual on Screen, Official on Print */}
                    <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl shadow-sm print:bg-white print:border-gray-300 print:border-l-2 print:shadow-none print:p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-blue-600 font-bold print:text-gray-600">Course Code</p>
                                <p className="text-lg font-semibold text-gray-900">{course.toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-blue-600 font-bold print:text-gray-600">Session</p>
                                <p className="text-lg font-semibold text-gray-900">{sessionParam}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-blue-600 font-bold print:text-gray-600">Semester</p>
                                <p className="text-lg font-semibold text-gray-900">{semester}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-blue-600 font-bold print:text-gray-600">Status</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-semibold text-green-600 print:text-gray-900">Published</p>
                                    {isAllComplete && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold print:border print:border-green-600">
                                            <CheckCircle2 size={14} /> Complete
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Compact Minimalist Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm print:border-none print:shadow-none">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-100 border-b border-gray-200 print:bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 font-bold text-gray-700 print:border print:border-gray-300">Student ID</th>
                                    <th className="px-4 py-3 font-bold text-gray-700 text-center print:border print:border-gray-300">
                                        Attendance {isAttendanceComplete && <CheckCircle2 size={16} className="inline text-green-500 mb-0.5" />}
                                    </th>
                                    <th className="px-4 py-3 font-bold text-gray-700 text-center print:border print:border-gray-300">
                                        Assignment {isAssignmentComplete && <CheckCircle2 size={16} className="inline text-green-500 mb-0.5" />}
                                    </th>
                                    <th className="px-4 py-3 font-bold text-gray-700 text-center print:border print:border-gray-300">
                                        Midterm {isMidtermComplete && <CheckCircle2 size={16} className="inline text-green-500 mb-0.5" />}
                                    </th>
                                    <th className="px-4 py-3 font-bold text-gray-900 text-center bg-gray-200/50 print:bg-gray-100 print:border print:border-gray-300">Total (40)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {marksData.length > 0 ? (
                                    marksData.map((mark: any) => (
                                        <tr key={mark._id.toString()} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-medium text-gray-800 print:border print:border-gray-300">{mark.studentId}</td>
                                            <td className="px-4 py-3 text-center text-gray-600 print:border print:border-gray-300">
                                                {mark.marks?.attendance != null && mark.marks?.attendance !== '' ? mark.marks.attendance : <span className="text-red-500 font-bold">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 print:border print:border-gray-300">
                                                {mark.marks?.assignment != null && mark.marks?.assignment !== '' ? mark.marks.assignment : <span className="text-red-500 font-bold">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600 print:border print:border-gray-300">
                                                {mark.marks?.midterm != null && mark.marks?.midterm !== '' ? mark.marks.midterm : <span className="text-red-500 font-bold">-</span>}
                                            </td>
                                            <td className="px-4 py-3 text-center font-bold text-blue-700 bg-blue-50/30 print:bg-transparent print:text-black print:border print:border-gray-300">{mark.marks?.total_40 ?? '0'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500 print:border print:border-gray-300">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 4. Print-Only Footer */}
                    <div className="hidden print:block mt-12 pt-8 border-t border-dashed border-gray-300">
                        <div className="flex justify-between text-xs text-gray-400">
                            <p>Generated via Mark Tracker Project</p>
                            <p>Date: {new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center print:hidden">
                    <Search className="mx-auto text-gray-300 mb-4" size={48} />
                    <h2 className="text-xl font-bold text-gray-700">Find Mark Records</h2>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">Please select a Session, Semester, and Course Code from the filters above to view the marks.</p>
                </div>
            )}

        </div>
    );
}