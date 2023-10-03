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

const WaitlistEntryModel: Model<WaitlistEntryModel> = model("WaitlistEntry", WaitlistEntrySchema);

export class MongoDbAdapter implements PersistentDatabase {

    constructor(
        private uri: string
    ) {}

    async connect(): Promise<void> {
        await connect(this.uri)
    }

    async disconnect(): Promise<void> {
        await disconnect();
    }

    async add(entry: WaitlistEntry): Promise<any> {
        console.log('MongoDbAdapter.add', entry.email, 'will add it to database')

        const waitlistEntry = new WaitlistEntryModel({
            ...entry,
            givenAccessAt: new Date()
        });
        await waitlistEntry.save();

        return waitlistEntry;
    }
}