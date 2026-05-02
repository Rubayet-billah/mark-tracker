import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    universityId: { type: String, unique: true, sparse: true },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    password: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;