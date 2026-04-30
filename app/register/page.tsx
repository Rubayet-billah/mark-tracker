'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { UserPlus, GraduationCap, User, Mail, Hash } from 'lucide-react';
import Link from 'next/link';
import { registerUser } from '../actions/authActions';
import { twMerge } from 'tw-merge';

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [role, setRole] = useState('student');

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        const formData = new FormData(event.currentTarget);
        const result = await registerUser(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            router.push('/login'); // Redirect to login on success [cite: 263]
        }
    }
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border p-8">
                <div className="text-center mb-8">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="text-green-600" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <p className="text-gray-500">Join the Academic Mark Tracker</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    ) : null}
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium mb-2">I am a:</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-checked:border-green-500 has-checked:bg-green-50">
                                <input type="radio" name="role" value="student" className="hidden" checked={role === 'student'} onChange={(e) => setRole(e.target.value)} />
                                <User size={18} />
                                <span>Student</span>
                            </label>
                            <label className="flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-checked:border-green-500 has-checked:bg-green-50">
                                <input type="radio" name="role" value="teacher" className="hidden" checked={role === 'teacher'} onChange={(e) => setRole(e.target.value)} />
                                <GraduationCap size={18} />
                                <span>Teacher</span>
                            </label>
                        </div>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="name" type="text" placeholder="John Doe" className="w-full border pl-10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
                        </div>
                    </div>

                    {/* University ID */}
                    <div className={twMerge(`transition-opacity duration-200 ${role === 'teacher' ? 'opacity-50' : ''}`)}>
                        <label className="block text-sm font-medium mb-1">University ID</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                name="universityId"
                                type="text"
                                placeholder="20210001"
                                className={`w-full border pl-10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500 ${role === 'teacher' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                required={role === 'student'}
                                disabled={role === 'teacher'}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-1">University Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="email" type="email" placeholder="john@university.edu" className="w-full border pl-10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input name="password" type="password" placeholder="••••••••" className="w-full border pl-10 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500" required />
                        </div>
                    </div>



                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mt-4">
                        Register Now
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account? <Link href="/login" className="text-green-600 font-medium hover:underline">Login here</Link>
                </p>
            </div>
        </div>
    );
}