import mongoose from 'mongoose';

const FeedbackSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['bug', 'feature', 'general'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false, // Optional for guests
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
export default Feedback;
