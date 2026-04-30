import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-slate-500 text-sm">
                        &copy; 2026 Mark Tracker Project. All rights reserved.
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/marks" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            My Gradebook
                        </Link>
                        <Link href="/support" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
