'use client';
import { useState } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse'; // [cite: 181, 428]
import { uploadMarks } from '../actions/markActions';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData(e.currentTarget);

        // Metadata from dropdowns [cite: 419, 421]
        const courseMetadata = {
            degree: formData.get('degree'),
            session: formData.get('session'),
            semester: formData.get('semester'),
            courseCode: formData.get('courseCode'),
            courseTitle: formData.get('courseTitle'),
        };

        // Parse CSV on the client side before sending to Server Action [cite: 158, 430]
        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: async (results) => {
                const response = await uploadMarks(courseMetadata, results.data);
                if (response.error) {
                    setStatus({ type: 'error', msg: response.error });
                } else {
                    setStatus({ type: 'success', msg: response.success as string });
                }
                setLoading(false);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Upload className="text-blue-600" /> Bulk Mark Upload
            </h1>

            <form onSubmit={handleFileUpload} className="bg-white shadow-md rounded-xl p-8 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Course Metadata Fields [cite: 419] */}
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

                {/* File Upload Zone [cite: 73, 157] */}
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
                    {loading ? "Processing..." : "Submit Marks"}
                </button>
            </form>

            {/* Status Messages  */}
            {status && (
                <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {status.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
                    {status.msg}
                </div>
            )}
        </div>
    );
}