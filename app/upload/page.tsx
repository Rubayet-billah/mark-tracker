'use client';
import { Upload, FileSpreadsheet } from 'lucide-react';

export default function UploadPage() {
    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
                <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <FileSpreadsheet className="text-green-600" /> Upload Course Marks
                </h1>
                <p className="text-gray-500 mb-8">Bulk upload your 10+10+20 internal marks via CSV file.</p>

                <form className="space-y-6">
                    {/* Metadata Section */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Course Code</label>
                            <input type="text" placeholder="e.g. CSE-101" className="w-full border p-2 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Academic Session</label>
                            <input type="text" placeholder="e.g. Fall 2024" className="w-full border p-2 rounded-md" required />
                        </div>
                    </div>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center hover:border-blue-400 transition cursor-pointer">
                        <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                        <p className="text-sm font-medium">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">Accepts .csv or .xlsx</p>
                        <input type="file" accept=".csv" className="hidden" id="csv-upload" />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                        Process & Save Marks
                    </button>
                </form>
            </div>
        </div>
    );
}