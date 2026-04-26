import mongoose from 'mongoose';

const MarkSchema = new mongoose.Schema({
    studentId: { type: String, required: true }, // University ID
    courseId: { type: String, required: true },
    assessmentType: {
        type: String,
        enum: ['attendance', 'assignment', 'midterm', 'total_40'],
        required: true
    },
    obtainedMarks: { type: Number, required: true },
    maxMarks: { type: Number, required: true }
});

export default mongoose.models.Mark || mongoose.model('Mark', MarkSchema);