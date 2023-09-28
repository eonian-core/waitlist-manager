import { Document, Model, Schema, model, connect, disconnect } from "mongoose";
import { PersistentDatabase } from "../WaitlistAdapter";
import { WaitlistEntry } from "../WaitlistEntry";

interface WaitlistEntryModel extends WaitlistEntry, Document<string> {
    id: string;
    givenAccessAt: Date
}

const WaitlistEntrySchema = new Schema<WaitlistEntryModel>({
    id: { type: String, required: true },
    givenAccessAt: { type: Date, default: Date.now }
}, {strict: false});

export const MONGODB_URI = process.env.MONGODB_URI;

const WaitlistEntryModel: Model<WaitlistEntryModel> = model("WaitlistEntry", WaitlistEntrySchema);

export class MongodbAdapter implements PersistentDatabase {

    async connect(): Promise<void> {
        if(!MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not defined")
        }
        await connect(MONGODB_URI)
    }

    async disconnect(): Promise<void> {
        await disconnect();
    }

    async add(entry: WaitlistEntry): Promise<any> {
        const waitlistEntry = new WaitlistEntryModel({
            ...entry,
            givenAccessAt: new Date()
        });
        await waitlistEntry.save();

        return waitlistEntry;
    }
}