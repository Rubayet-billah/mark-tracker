import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

export const connectDB = async () => {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGODB_URI, {
            tls: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error;
    }
};