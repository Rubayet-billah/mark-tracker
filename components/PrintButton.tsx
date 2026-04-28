'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition shadow-md print:hidden"
        >
            <Printer size={18} /> Print / Save as PDF
        </button>
    );
}
