import mongoose from 'mongoose'

export async function connectToMongo(url, dbName) {
    if (!url) throw new Error('Missing MONGO_URL');
    if (!dbName) throw new Error('Missing MONGO_DB');

    await mongoose.connect(url, {dbName});
    mongoose.connection.on('connected', () => {
        console.group(`✅ Mongo connected to ${dbName}`);
    });

    mongoose.connection.on('error', (err) => {
        console.error('❌ Mongo connection error: ', err.message);
    });
}