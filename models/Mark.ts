import mongoose from 'mongoose';

// Clear mongoose models cache for HMR
if (mongoose.models.Mark) {
    delete mongoose.models.Mark;
}

const MarkSchema = new mongoose.Schema({
    studentId: { type: String, required: true, index: true }, // University ID
    courseId: { type: String, required: true, index: true }, // e.g., CSE-301
    courseTitle: { type: String, required: true },
    session: { type: String, required: true }, // e.g., 2018-19
    semester: { type: String, required: true }, // e.g., 2.1
    degree: { type: String, required: true }, // BSc or MSc
    instructorId: { type: String, required: true },

    // Grouped marks for the 10+10+20 structure
    marks: {
        attendance: { type: Number, default: 0 },
        assignment: { type: Number, default: 0 },
        midterm: { type: Number, default: 0 },
        total_40: { type: Number, default: 0 }
    },

    updatedAt: { type: Date, default: Date.now }
});

// Compound index to prevent duplicate course entries for the same student
MarkSchema.index({ studentId: 1, courseId: 1, session: 1 }, { unique: true });

export default mongoose.models.Mark || mongoose.model('Mark', MarkSchema);