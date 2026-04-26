'use client';
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email')?.toString().trim() ?? '';
        const password = formData.get('password')?.toString() ?? '';

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            setError('Invalid email or password.');
            return;
        }

        router.push('/mark');
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="text-blue-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Welcome Back</h1>
                    <p className="text-gray-500">Sign in to view or manage academic marks</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}
                    <div>
                        <label className="block text-sm font-medium mb-1">University Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="name@university.edu"
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition mt-2"
                    >
                        <LogIn size={20} /> Sign In
                    </button>
                </form>

                {/* Footer Refactored for Registration */}
                <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-sm text-gray-500">
                        New to the platform?{' '}
                        <Link href="/register" className="text-blue-600 font-bold hover:underline">
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}