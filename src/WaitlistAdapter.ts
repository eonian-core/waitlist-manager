import { WaitlistEntry } from "./WaitlistEntry"

export interface WaitlistDatabase {
    markAsGivenAccess(entry: WaitlistEntry): Promise<void>
    getLatest(): Promise<WaitlistEntry[]>
}

export interface TuemilioEmail {
    id: number;
    /** Email address */
    address: string;
    /** Date in string format, aka 2023-07-27T12:45:29.000000Z */
    created_at: string;

    points: number;
    position: number;
    people_ahead: number;
    shared_on: {
        [social: string]: boolean | undefined;
        telegram?: boolean;
    }
}

/** Used to calculate referals amount */
export const POINTS_PER_REFERED_FRIEND = +(process.env.POINTS_PER_REFERED_FRIEND || 5);
/** Used to calculate shares amount */
export const POINTS_PER_SHARED_SOCIAL = +(process.env.POINTS_PER_SHARED_SOCIAL || 3);

/** Need pass in constructor list id and api token, required for each call */
export interface TuemilioListClient {
    /** 
     * You can see a list of emails belonging to a specific wait list. 
     * The emails are returned in sorted order, 
     * with the most recent emails appearing first. 
     * */
    getAll(): Promise<TuemilioEmail[]>

    /** Returns the updated email object, and throws an error otherwise. */
    update(emailId: string, data: TuemilioEmail): Promise<TuemilioEmail>

    /** Delete an email from an specific wait list. */
    delete(emailId: string): Promise<void>
}

export interface PersistentDatabase {
    add(entry: WaitlistEntry): Promise<any>
}

export class WaitlistAdapter implements WaitlistDatabase {
    constructor(
        private tuemelio: TuemilioListClient,
        private db: PersistentDatabase
    ) { }

    public async markAsGivenAccess(entry: WaitlistEntry): Promise<void> {
        // There currently no way to mark an email as given access in Tuemilio through the API
        // So we will save the record in Airtable and delete it from Tuemilio

        await this.db.add(entry);
        await this.tuemelio.delete(entry.id);
    }

    /** Returns top of the list sorted from oldest to newest */
    public async getLatest(): Promise<WaitlistEntry[]> {
        const records = await this.tuemelio.getAll();
        return records
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map(record => {
                // We cannot get exact amount of referals, so will calculate it from points
                // Main assumptions is that:
                // * each referal gives 5 points
                // * each share gives 3 points 
                // * we have only this point sources
                const sharedSocialsCount = Object.values(record.shared_on).filter(Boolean).length;
                const pointsFromShares = sharedSocialsCount * POINTS_PER_SHARED_SOCIAL;
                const pointsFromReferals = record.points - pointsFromShares;

                return {
                    ...record,
                    id: `${record.id}`,
                    email: record.address,
                    referedCount: pointsFromReferals / POINTS_PER_REFERED_FRIEND,
                    sharedSocialsCount,
                }
            });
    }
}