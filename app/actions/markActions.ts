/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Mark from "@/models/Mark";

export async function previewMarksUpload(courseData: any, csvRows: any[]) {
    await connectDB();
    const session = await auth();

    // Guard: Only teachers/admins can upload
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

        // Fetch existing records to check for past marks
        const studentIds = entries.map(e => e.studentId);
        const existingMarks = await Mark.find({
            courseId: new RegExp(`^${courseData.courseCode}$`, 'i'),
            session: courseData.session,
            semester: courseData.semester,
            studentId: { $in: studentIds }
        }).lean();

        const existingMap = new Map();
        existingMarks.forEach((m: any) => existingMap.set(m.studentId, m));

        let hasExisting = false;
        const previewData = entries.map(entry => {
            const existing = existingMap.get(entry.studentId);
            if (existing) hasExisting = true;

            return {
                studentId: entry.studentId,
                oldMarks: existing ? existing.marks : null,
                newMarks: entry.marks,
                entryData: entry
            };
        });

        return { preview: previewData, hasExisting };
    } catch (error) {
        console.error("Preview Error:", error);
        return { error: "Failed to process marks. Check file format." };
    }
}

export async function commitMarksUpload(entries: any[]) {
    await connectDB();
    const session = await auth();

    if (!session || (session.user.role !== 'teacher' && session.user.role !== 'admin')) {
        return { error: "Unauthorized" };
    }

    try {
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
        return { error: "Failed to commit marks." };
    }
}