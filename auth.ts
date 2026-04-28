// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials) return null;

                    await connectDB();
                    const user = await User.findOne({ email: credentials.email });

                    if (!user || !user.password) return null;

                    const isMatch = await bcrypt.compare(
                        credentials.password as string,
                        user.password
                    );

                    if (!isMatch) return null;

                    // Return user object with the role for callbacks
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error) {
                    console.error("Auth Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // Attach role to token 
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.role && session.user) {
                session.user.role = token.role as string; // Attach role to session 
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});