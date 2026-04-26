/* eslint-disable @typescript-eslint/no-explicit-any */
import { connectDB } from "@/lib/db"; // Adjust the path to where your db.ts is
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({
            message: "Connected to mark-tracker successfully!",
            status: "Success"
        });
    } catch (error: any) {
        return NextResponse.json({
            message: "Connection failed",
            error: error.message
        }, { status: 500 });
    }
}