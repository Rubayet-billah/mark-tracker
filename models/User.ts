import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    universityId: { type: String, required: true, unique: true }, // [cite: 35, 58]
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    password: { type: String, required: true },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);