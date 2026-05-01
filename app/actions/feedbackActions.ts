'use server';

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Feedback from "@/models/Feedback";

export async function submitFeedback(type: string, message: string) {
    try {
        await connectDB();
        const session = await auth();

        const newFeedback = await Feedback.create({
            type,
            message,
            submittedBy: session?.user?.id || null,
        });

        return { success: true, feedback: JSON.parse(JSON.stringify(newFeedback)) };
    } catch (error: unknown) {
        console.error("Failed to submit feedback:", error);
        return { error: error instanceof Error ? error.message : "Failed to submit feedback" };
    }
}

export async function getFeedbacks() {
    try {
        await connectDB();
        const session = await auth();

        if (!session || session.user?.role !== 'admin') {
            return { error: "Unauthorized. Admin access required." };
        }

        const feedbacks = await Feedback.find({})
            .populate('submittedBy', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return { success: true, feedbacks: JSON.parse(JSON.stringify(feedbacks)) };
    } catch (error: unknown) {
        console.error("Failed to fetch feedbacks:", error);
        return { error: error instanceof Error ? error.message : "Failed to fetch feedbacks" };
    }
}

export async function updateFeedbackStatus(id: string, status: string) {
    try {
        await connectDB();
        const session = await auth();

        if (!session || session.user?.role !== 'admin') {
            return { error: "Unauthorized" };
        }

        const updated = await Feedback.findByIdAndUpdate(id, { status }, { new: true });
        
        return { success: true, feedback: JSON.parse(JSON.stringify(updated)) };
    } catch (error: unknown) {
        console.error("Failed to update feedback status:", error);
        return { error: "Failed to update status" };
    }
}
