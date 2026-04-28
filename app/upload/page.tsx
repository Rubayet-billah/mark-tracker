'use client';
import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, X } from 'lucide-react';
import Papa from 'papaparse';
import { previewMarksUpload, commitMarksUpload } from '../actions/markActions';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [hasExistingMarks, setHasExistingMarks] = useState(false);

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setStatus(null);
        const formData = new FormData(e.currentTarget);

        const courseMetadata = {
            degree: formData.get('degree'),
            session: formData.get('session'),
            semester: formData.get('semester'),
            courseCode: formData.get('courseCode'),
            courseTitle: formData.get('courseTitle'),
        };

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                const response = await previewMarksUpload(courseMetadata, results.data);
                if (response.error) {
                    setStatus({ type: 'error', msg: response.error });
                } else if (response.preview) {
                    setPreviewData(response.preview);
                    setHasExistingMarks(response.hasExisting || false);
                    setIsModalOpen(true);
                }
                setLoading(false);
            }
        });
    };

    const handleConfirmUpload = async () => {
        setLoading(true);
        const entries = previewData.map(p => p.entryData);
        const response = await commitMarksUpload(entries);
        
        if (response.error) {
            setStatus({ type: 'error', msg: response.error });
        } else {
            setStatus({ type: 'success', msg: response.success as string });
            setFile(null); // Reset file
        }
        
        setLoading(false);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Upload className="text-blue-600" /> Bulk Mark Upload
            </h1>

            <form onSubmit={handleFileUpload} className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium mb-1">Degree</label>
                        <select name="degree" className="w-full border rounded-lg p-2" required>
                            <option value="BSc">BSc</option>
                            <option value="MSc">MSc</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Session</label>
                        <select name="session" className="w-full border rounded-lg p-2" required defaultValue="">
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
                        <label className="block text-sm font-medium mb-1">Semester</label>
                        <select name="semester" className="w-full border rounded-lg p-2" required defaultValue="">
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
                        <label className="block text-sm font-medium mb-1">Course Code</label>
                        <input name="courseCode" placeholder="e.g., CSE-301" className="w-full border rounded-lg p-2" required />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Course Title</label>
                        <input name="courseTitle" placeholder="e.g., Database Management Systems" className="w-full border rounded-lg p-2" required />
                    </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition mb-6">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                        <FileSpreadsheet className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-blue-600 font-semibold">Click to upload CSV</span>
                        <span className="text-gray-500 text-sm">{file ? file.name : "Ensure columns match template"}</span>
                    </label>
                </div>

                <button
                    disabled={loading || !file}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                >
                    {loading ? "Processing..." : "Preview & Check Marks"}
                </button>
            </form>

            {status && (
                <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
                    {status.msg}
                </div>
            )}

            {/* Preview Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Preview Marks Upload</h2>
                                {hasExistingMarks ? (
                                    <p className="text-amber-600 text-sm mt-1 flex items-center gap-1">
                                        <AlertCircle size={16} /> Past marks found! New marks will update existing records.
                                    </p>
                                ) : (
                                    <p className="text-gray-500 text-sm mt-1">Review the marks before final submission.</p>
                                )}
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body (Table) */}
                        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-gray-100 border-b border-gray-200 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-3 font-bold text-gray-700">Student ID</th>
                                            <th className="px-4 py-3 font-bold text-gray-700 text-center">Attendance</th>
                                            <th className="px-4 py-3 font-bold text-gray-700 text-center">Assignment</th>
                                            <th className="px-4 py-3 font-bold text-gray-700 text-center">Midterm</th>
                                            <th className="px-4 py-3 font-bold text-gray-900 text-center bg-gray-200/50">Total (40)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {previewData.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-medium text-gray-800">{row.studentId}</td>
                                                <td className="px-4 py-3 text-center">
                                                    {row.oldMarks && row.oldMarks.attendance !== row.newMarks.attendance && (
                                                        <span className="text-gray-400 line-through mr-2">{row.oldMarks.attendance}</span>
                                                    )}
                                                    <span className={row.oldMarks && row.oldMarks.attendance !== row.newMarks.attendance ? "text-blue-600 font-bold" : "text-gray-600"}>
                                                        {row.newMarks.attendance}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {row.oldMarks && row.oldMarks.assignment !== row.newMarks.assignment && (
                                                        <span className="text-gray-400 line-through mr-2">{row.oldMarks.assignment}</span>
                                                    )}
                                                    <span className={row.oldMarks && row.oldMarks.assignment !== row.newMarks.assignment ? "text-blue-600 font-bold" : "text-gray-600"}>
                                                        {row.newMarks.assignment}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {row.oldMarks && row.oldMarks.midterm !== row.newMarks.midterm && (
                                                        <span className="text-gray-400 line-through mr-2">{row.oldMarks.midterm}</span>
                                                    )}
                                                    <span className={row.oldMarks && row.oldMarks.midterm !== row.newMarks.midterm ? "text-blue-600 font-bold" : "text-gray-600"}>
                                                        {row.newMarks.midterm}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold bg-blue-50/30">
                                                    {row.oldMarks && row.oldMarks.total_40 !== row.newMarks.total_40 && (
                                                        <span className="text-gray-400 line-through mr-2 font-normal">{row.oldMarks.total_40}</span>
                                                    )}
                                                    <span className={row.oldMarks && row.oldMarks.total_40 !== row.newMarks.total_40 ? "text-blue-700" : "text-gray-800"}>
                                                        {row.newMarks.total_40}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-4 bg-white">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                disabled={loading}
                                type="button"
                                className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleConfirmUpload}
                                disabled={loading}
                                type="button"
                                className="px-6 py-2.5 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                {loading ? "Uploading..." : "Confirm & Upload"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}