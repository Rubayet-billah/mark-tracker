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

            const attendance = attendanceIdx !== -1 ? Number(row[attendanceIdx]) || 0 : null;
            const assignment = assignmentIdx !== -1 ? Number(row[assignmentIdx]) || 0 : null;
            const midterm = midtermIdx !== -1 ? Number(row[midtermIdx]) || 0 : null;

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
                    uploadedTotal: totalIdx !== -1 ? Number(row[totalIdx]) : null
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

        const uploadTypes = courseData.uploadTypes || [];

        let hasExisting = false;
        const previewData = entries.map(entry => {
            const existing = existingMap.get(entry.studentId);
            if (existing) hasExisting = true;

            const newMarksObj = { ...(existing?.marks || {}) };
            
            if (uploadTypes.includes('attendance') && entry.marks.attendance !== null) {
                newMarksObj.attendance = entry.marks.attendance;
            }
            if (uploadTypes.includes('assignment') && entry.marks.assignment !== null) {
                newMarksObj.assignment = entry.marks.assignment;
            }
            if (uploadTypes.includes('midterm') && entry.marks.midterm !== null) {
                newMarksObj.midterm = entry.marks.midterm;
            }

            // Recalculate total
            if (entry.marks.uploadedTotal !== null && uploadTypes.includes('total')) {
                newMarksObj.total_40 = entry.marks.uploadedTotal;
            } else {
                newMarksObj.total_40 = (newMarksObj.attendance || 0) + (newMarksObj.assignment || 0) + (newMarksObj.midterm || 0);
            }

            // Clean up entry object
            const finalEntry = { ...entry, marks: newMarksObj };

            return {
                studentId: entry.studentId,
                oldMarks: existing ? existing.marks : null,
                newMarks: newMarksObj,
                rawCsvMarks: entry.marks,
                entryData: finalEntry
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

export async function getTeacherStats(instructorId: string) {
    await connectDB();

    try {
        const stats = await Mark.aggregate([
            { $match: { instructorId: instructorId } },
            {
                $group: {
                    _id: { courseId: "$courseId", session: "$session", semester: "$semester" },
                    courseTitle: { $first: "$courseTitle" },
                    lastUpdated: { $max: "$updatedAt" },
                    studentCount: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id.courseId",
                    session: "$_id.session",
                    semester: "$_id.semester",
                    courseTitle: 1,
                    lastUpdated: 1,
                    studentCount: 1
                }
            },
            { $sort: { lastUpdated: -1 } }
        ]);

        const totalCourses = stats.length;
        const totalStudents = stats.reduce((sum: number, course: any) => sum + course.studentCount, 0);

        return {
            totalCourses,
            totalStudents,
            history: stats
        };
    } catch (error) {
        console.error("Failed to fetch teacher stats:", error);
        return { error: "Failed to fetch teacher stats" };
    }
}

export async function getCourseStudents(instructorId: string, courseId: string, sessionStr: string, semester: string) {
    await connectDB();
    try {
        const marks = await Mark.find({
            instructorId,
            courseId: new RegExp(`^${courseId}$`, 'i'),
            session: sessionStr,
            semester
        }).sort({ studentId: 1 }).lean();
        return marks;
    } catch (error) {
        console.error("Failed to fetch course students:", error);
        return [];
    }
}

export async function getTeacherCourses(instructorId: string) {
    // Alias to satisfy requirements while keeping DRY
    const stats = await getTeacherStats(instructorId);
    return stats.history || [];
}