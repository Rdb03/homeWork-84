import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";

const dropCollection = async (db: mongoose.Connection, collectionName: string) => {
    try {
        await db.dropCollection(collectionName);
    } catch (e) {
        console.log(`Collection ${collectionName} was missing, skipping drop...`);
    }
};

const run = async () => {
    await mongoose.connect(config.mongoose.db);
    const db = mongoose.connection;

    const collections = ['users', 'tasks'];

    for (const collectionName of collections) {
        await dropCollection(db, collectionName);
    }

    const user = await User.create({
        username: 'user',
        password: '123456',
        token: crypto.randomUUID(),
    });

    await Task.create({
        user: user,
        title: 'Go to the GYM',
        description: 'leg day',
        status: 'complete',
    });

    await db.close();
};

void run();