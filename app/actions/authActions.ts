'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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

        console.log({
            name, email, password
        });

        // 2. Hash the password for security [cite: 268]
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create and save the new user [cite: 251]
        const newUser = new User({
            name,
            email,
            universityId,
            role,
            password: hashedPassword,
        });



        await newUser.save();
        return { success: "Registration successful! You can now login." };

    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Something went wrong. Please try again." };
    }
}