'use client';
import { Search, Filter } from 'lucide-react';

export default function StudentMarksPage() {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium mb-2">Search by University ID</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Enter ID (e.g. 2021001)"
                            className="w-full border pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <button className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white hover:bg-gray-50">
                        <Filter size={18} /> Filter by Course
                    </button>
                </div>
            </div>

            {/* Marks Display Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold">Course</th>
                            <th className="px-6 py-4 text-sm font-semibold">Assessment Type</th>
                            <th className="px-6 py-4 text-sm font-semibold">Obtained</th>
                            <th className="px-6 py-4 text-sm font-semibold">Max</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {/* Sample Row */}
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">CSE-101</td>
                            <td className="px-6 py-4 capitalize text-gray-600">Midterm</td>
                            <td className="px-6 py-4 font-bold text-blue-600">18</td>
                            <td className="px-6 py-4 text-gray-400">20</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}