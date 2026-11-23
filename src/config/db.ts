import { MongoClient, Db } from 'mongodb';

let db: Db;

export const connectDB = async (): Promise<Db> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is missing from .env file');
  }

  const client = new MongoClient(uri);

  await client.connect();

  db = client.db('mentorlagbe');

  console.log('MongoDB Connected Successfully!');

  return db;
};

export const getDB = (): Db => {
  if (!db) {
    throw new Error('Database is not connected yet!');
  }

  return db;
};
