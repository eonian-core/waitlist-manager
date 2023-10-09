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

    /** If exists and not null then access is granted */
    access_granted_at?: string | null;

    points: number;
    position: number;
    people_ahead: number;
    shared_on: {
        [social: string]: boolean | undefined;
        telegram?: boolean;
    }
}

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

    /** Mark email as granted access and not count in queue */
    grantAccess(emailId: string): Promise<TuemilioEmail>;
}

export class WaitlistAdapter implements WaitlistDatabase {
    constructor(
        private tuemelio: TuemilioListClient,
        /** Used to calculate referals amount */
        private pointsPerReferedFriend: number,
        /** Used to calculate shares amount */
        private pointsPerSharedSocial: number
    ) { }

    public async markAsGivenAccess(entry: WaitlistEntry): Promise<void> {
        await this.tuemelio.grantAccess(entry.id);
    }

    /** Returns top of the list sorted from oldest to newest */
    public async getLatest(): Promise<WaitlistEntry[]> {
        const records = await this.tuemelio.getAll();
        // filter out already granted access
        const withoutAccess = records.filter(record => !record.access_granted_at);

        console.log('WaitlistAdapter.getLatest:', {total: records.length, 'without access': withoutAccess.length, 'with access': records.length - withoutAccess.length});

        return withoutAccess
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map(record => {
                // We cannot get exact amount of referals, so will calculate it from points
                // Main assumptions is that:
                // * each referal gives 5 points
                // * each share gives 3 points 
                // * we have only this point sources
                const sharedSocialsCount = Object.values(record.shared_on).filter(Boolean).length;
                const pointsFromShares = sharedSocialsCount * this.pointsPerSharedSocial;
                const pointsFromReferals = record.points - pointsFromShares;

                return {
                    ...record,
                    id: `${record.id}`,
                    email: record.address,
                    referedCount: pointsFromReferals / this.pointsPerReferedFriend,
                    sharedSocialsCount,
                }
            });
    }
}