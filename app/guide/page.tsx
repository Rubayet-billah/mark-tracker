/* eslint-disable react/no-unescaped-entities */
import {
    BookOpen,
    Search,
    ShieldCheck,
    FileSpreadsheet,
    CheckCircle2,
    AlertCircle,
    GraduationCap,
    User,
    UploadCloud,
    FileText,
    CheckSquare,
    Printer
} from 'lucide-react';
import Link from 'next/link';

export default function UserGuidePage() {
    return (
        <div className="min-h-screen bg-white text-slate-900 py-16 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
                        <BookOpen size={16} />
                        Documentation
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        User Guide & Documentation
                    </h1>
                    <p className="text-lg text-slate-500 font-light">
                        Everything you need to know about navigating the Academic Mark Tracker.
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Section 1: The Core Mission */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-slate-900">
                            <CheckCircle2 className="text-green-500" />
                            Unified Academic Tracking
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4 text-lg">
                            Our platform acts as a <strong>"Single Source of Truth,"</strong> replacing scattered, non-trackable PDFs and spreadsheets with a centralized, searchable academic database.
                            The system securely stores all your internal marks in one place, ensuring data integrity and instant access.
                        </p>
                    </section>

                    {/* Section 2: Role-Based Access */}
                    <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-purple-600" />
                            Role-Based Access
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <GraduationCap className="text-blue-600 mb-4" size={32} />
                                <h3 className="font-bold mb-2">Student</h3>
                                <p className="text-sm text-slate-500">Search and view personal grade reports securely. Can export their transcripts.</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <User className="text-green-600 mb-4" size={32} />
                                <h3 className="font-bold mb-2">Teacher</h3>
                                <p className="text-sm text-slate-500">Manage assigned courses, perform bulk mark uploads using Smart Ingestion, and review class performance.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Smart Ingestion */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <UploadCloud className="text-blue-600" />
                            Smart Ingestion (Bulk Mark Upload)
                        </h2>
                        <p className="text-slate-600 mb-6">
                            For Teachers, our Smart Ingestion system makes uploading and updating marks effortless while preventing accidental data loss. We use an Upsert (Update or Insert) logic based on a "One Document per Student per Course" schema.
                        </p>

                        <div className="space-y-6">
                            {/* 1. Flexible CSV */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <FileSpreadsheet className="text-blue-500" size={20} />
                                    1. Flexible CSV Requirements
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Teachers can upload full or partial marks at any time. Whether you only have <strong>Attendance</strong>, or just the <strong>Midterm</strong> scores, you can upload them without needing to provide all columns at once.
                                </p>
                            </div>

                            {/* 2. Exact Header Names */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-red-500">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                    <AlertCircle className="text-red-500" size={20} />
                                    2. The "Student Id" Rule
                                </h3>
                                <p className="text-sm text-slate-600 mb-3">
                                    To map marks correctly, your CSV <strong>MUST</strong> contain a <code className="font-semibold text-red-600 bg-red-50 px-1 py-0.5 rounded">Student Id</code> column. While the system is <strong>case-insensitive</strong> (e.g., "student id" or "STUDENT ID" works fine), the header name itself must strictly be "Student Id". 
                                </p>
                                <p className="text-sm text-slate-600 mb-4">
                                    Do not use "University ID", "Roll No", or any other variant. Other headers like <code className="font-semibold text-slate-700 bg-slate-100 px-1 py-0.5 rounded">Attendance</code>, <code className="font-semibold text-slate-700 bg-slate-100 px-1 py-0.5 rounded">Assignment</code>, and <code className="font-semibold text-slate-700 bg-slate-100 px-1 py-0.5 rounded">Midterm</code> are supported for partial uploads. Here is an example of the expected CSV format:
                                </p>
                                <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                                    <img 
                                        src="/assets/upload-format-1.png" 
                                        alt="Correct CSV Format Example" 
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>

                            {/* 3. Incremental Updates */}
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-blue-900">
                                    <CheckCircle2 className="text-blue-500" size={20} />
                                    3. Smart Merging (Upsert)
                                </h3>
                                <p className="text-sm text-slate-700">
                                    Our system supports smart upserts. You can upload partial marks safely. For example, if you upload <strong>Midterms</strong> now, any previously uploaded <strong>Attendance</strong> marks will remain safe. The system safely merges your new data with the existing records, and the <strong>Total_40</strong> will be recalculated automatically.
                                </p>
                            </div>

                            {/* 4. Do NOT Calculate Totals */}
                            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm border-l-4 border-l-amber-500">
                                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-amber-900">
                                    <AlertCircle className="text-amber-600" size={20} />
                                    4. Do NOT Calculate Totals Manually
                                </h3>
                                <p className="text-sm text-amber-800">
                                    Please <strong>do not calculate the total yourself</strong> in the spreadsheet. The system automatically handles the <code>10 + 10 + 20 = 40</code> math internally based on the individual mark columns you provide.
                                </p>
                            </div>

                            {/* 5. Verification Flow */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <CheckSquare className="text-green-500" size={20} />
                                    5. Selection & Verification Flow
                                </h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    To ensure data accuracy, we use a strict safety protocol during upload. We utilize a confirmation modal where you must review the data:
                                </p>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex gap-3 items-start">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0 text-xs">A</div>
                                        <span><strong>Select Mark Type:</strong> You must explicitly check the boxes for the mark types you are uploading (e.g., Attendance, Midterm) <em>before</em> uploading. This ensures that <strong>only the intended fields are updated</strong> and nothing else is accidentally overwritten.</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0 text-xs">B</div>
                                        <span><strong>Review Data Preview Table:</strong> Verify the parsed data in the visual preview table to ensure your columns mapped accurately.</span>
                                    </li>
                                    <li className="flex gap-3 items-start">
                                        <div className="h-6 w-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0 text-xs">C</div>
                                        <span><strong>Confirm & Save:</strong> Once verified, clicking Confirm commits the data and triggers the automatic total calculation.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Search & Print */}
                    <section className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Search className="text-slate-900" />
                                Student Search
                            </h2>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Finding results is instantaneous. Navigate to the Marks or Results view and use the dynamic filters:
                            </p>
                            <ul className="space-y-2 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <li>• Select the <strong>Session</strong> (e.g., 2023-2024)</li>
                                <li>• Select the <strong>Semester</strong></li>
                                <li>• Enter the <strong>Course Code</strong></li>
                            </ul>
                            <p className="text-sm text-slate-500 mt-4">
                                The system will instantly retrieve the compiled marks for that specific cohort.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <Printer className="text-slate-900" />
                                Exporting Data
                            </h2>
                            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                                Need a physical copy or an official record? Our platform generates clean, print-ready documents.
                            </p>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-4">
                                <FileText className="text-blue-500 shrink-0" />
                                <p className="text-sm text-slate-700">
                                    Use the <strong>"Print / Save as PDF"</strong> button available on the marks view. It automatically formats the data into an official-style transcript, removing unnecessary UI elements like navigation bars for a clean print.
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Call to Action */}
                <div className="mt-20 pt-8 border-t border-slate-200 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                        &larr; Go back to Home Page
                    </Link>
                </div>
            </div>
        </div>
    );
}