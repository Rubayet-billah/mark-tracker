'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signOut } from '@/auth';

export async function logoutUser() {
    await signOut({ redirectTo: "/login" });
}

export async function registerUser(formData: FormData) {
    try {
        await connectDB();

        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const universityId = formData.get('universityId')?.toString().trim() ?? '';
        const role = formData.get('role')?.toString().trim() || 'student';
        const password = formData.get('password')?.toString() ?? '';

        if (!name || !email || !universityId || !password) {
            return { error: 'Please fill in all required fields.' };
        }

        // 1. Check if user already exists by Email or University ID [cite: 250, 269]
        const existingUser = await User.findOne({
            $or: [{ email }, { universityId }]
        });

        if (existingUser) {
            return { error: "User with this email or ID already exists." };
        }

        // 2. Hash the password [cite: 268, 273]
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Directly create the user using the Model
        const result = await User.create({
            name,
            email,
            universityId,
            role,
            password: hashedPassword,
        });

        if (!result) {
            throw new Error("User creation failed");
        }

        return { success: "Registration successful!" };

    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}

export async function loginUser(formData: FormData) {
    try {
        await connectDB();

        const email = formData.get('email')?.toString().trim() ?? '';
        const password = formData.get('password')?.toString() ?? '';

        if (!email || !password) {
            return { error: 'Please enter both email and password.' };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return { error: 'Invalid email or password.' };
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return { error: 'Invalid email or password.' };
        }

        return { success: 'Login successful.' };
    } catch (error) {
        console.error('Login Error:', error);
        return { error: 'Unable to login. Please try again.' };
    }
}