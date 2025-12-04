// Connect to MongoDB
import mongoose from 'mongoose'

export async function connectToMongo(url, dbName) {
    if (!url) throw new Error('Missing MONGO_URL');
    if (!dbName) throw new Error('Missing MONGO_DB');

    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection URL (masked):', url.substring(0, 20) + '...');
        
        const options = {
            dbName,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of default 30s
        };
        
        await mongoose.connect(url, options);
        console.log(`✅ Mongo connected to ${dbName}`);
        
        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongo connection error: ', err.message);
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongo disconnected');
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
}