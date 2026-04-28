/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Mark from "@/models/Mark";

export async function uploadMarks(courseData: any, csvRows: any[]) {
    await connectDB();
    const session = await auth();

    // Guard: Only teachers/admins can upload [cite: 113, 162]
    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
        return { error: "Unauthorized" };
    }

    try {
        const entries: any[] = [];

        // Find the header row dynamically
        let headerRowIdx = -1;
        let studentIdIdx = -1;
        let attendanceIdx = -1;
        let assignmentIdx = -1;
        let midtermIdx = -1;
        let totalIdx = -1;

        for (let i = 0; i < csvRows.length; i++) {
            const row = csvRows[i];
            if (!Array.isArray(row)) continue;

            const lowerRow = row.map(cell => String(cell).toLowerCase().trim());

            // Look for a cell that looks like Student ID
            const sidIdx = lowerRow.findIndex(cell => cell.includes('student id') || cell.includes('university id') || cell === 'id');

            if (sidIdx !== -1) {
                headerRowIdx = i;
                studentIdIdx = sidIdx;
                attendanceIdx = lowerRow.findIndex(cell => cell.includes('attendance'));
                assignmentIdx = lowerRow.findIndex(cell => cell.includes('assignment'));
                midtermIdx = lowerRow.findIndex(cell => cell.includes('midterm'));
                totalIdx = lowerRow.findIndex(cell => cell.includes('total'));
                break;
            }
        }

        if (headerRowIdx === -1 || studentIdIdx === -1) {
            return { error: "Could not find 'Student ID' column in the CSV." };
        }

        // Process data rows
        for (let i = headerRowIdx + 1; i < csvRows.length; i++) {
            const row = csvRows[i];
            if (!Array.isArray(row) || row.length <= studentIdIdx) continue;

            const studentId = String(row[studentIdIdx]).trim();
            if (!studentId) continue;

            const attendance = attendanceIdx !== -1 ? Number(row[attendanceIdx]) || 0 : 0;
            const assignment = assignmentIdx !== -1 ? Number(row[assignmentIdx]) || 0 : 0;
            const midterm = midtermIdx !== -1 ? Number(row[midtermIdx]) || 0 : 0;
            const total = totalIdx !== -1 ? Number(row[totalIdx]) : (attendance + assignment + midterm);

            entries.push({
                studentId,
                courseId: courseData.courseCode,
                courseTitle: courseData.courseTitle,
                session: courseData.session,
                semester: courseData.semester,
                degree: courseData.degree,
                instructorId: session.user.id,
                marks: {
                    attendance,
                    assignment,
                    midterm,
                    total_40: total
                }
            });
        }

        // Use bulkWrite or upsert to update existing records if they exist
        const operations = entries.map(entry => ({
            updateOne: {
                filter: { studentId: entry.studentId, courseId: entry.courseId, session: entry.session },
                update: { $set: entry },
                upsert: true
            }
        }));

        await Mark.bulkWrite(operations);
        return { success: `Successfully uploaded ${entries.length} student records.` };
    } catch (error) {
        console.error("Upload Error:", error);
        return { error: "Failed to upload marks. Check file format." };
    }
}