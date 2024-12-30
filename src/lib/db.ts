import { Db, MongoClient } from 'mongodb';
import config from './config';

const client = new MongoClient(config.MONGODB_URI);

export let db: Db;

export async function connectToDatabase(dbName: string) {
    if (!db) {
        try {
            await client.connect();
            console.log('Connected to MongoDB !');
            db = client.db(dbName);
        } catch (err) {
            console.error('Failed to connect to MongoDB !', err);
            throw err;
        }
    }

    return db;
}

export async function closeDatabaseConnection() {
    await client.close();
    console.log('MongoDB connection closed !');
}
