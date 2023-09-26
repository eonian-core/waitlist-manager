
export interface WaitlistEntry {
    email: string;
    referedCount: number;
    sharedSocialsCount: number;
}

export interface WaitlistDatabase {
    getLatest(count: number): Promise<WaitlistEntry[]>
    markAsGivenAccess(entry: WaitlistEntry): Promise<void>
}

export interface ApplicationAccessDatabase {
    add(email: string): Promise<void>
}

export interface EmailService {
    sendAccessGivenEmail(email: string): Promise<void>
}

export class AccessPosition {
    constructor(
        public entry: WaitlistEntry,
        public originalPosition: number,
        public points: number,
    ){}

    /** Allow negative values to sort relative entries at the top */
    public get resultPosition(): number {
        return this.originalPosition - this.points;
    }
}

export const MOVE_IN_LINE_PER_REFERED_FRIEND = +(process.env.MOVE_IN_LINE_PER_REFERED_FRIEND || 5);
export const MOVE_IN_LINE_PER_SHARED_SOCIAL = +(process.env.MOVE_IN_LINE_PER_SHARED_SOCIAL || 3);
/** Amount of entries to give access per one call */
export const ACCESS_WAVE_COUNT = +(process.env.ACCESS_WAVE_COUNT || 5);

export class WaitlistManager {
  constructor(
    private waitlist: WaitlistDatabase,
    private accesses: ApplicationAccessDatabase,
    private emails: EmailService
  ) {}
  
  /** 
   * Give access to top list of waitlist, 
   * takes into acount amount of reffered friends 
   * and shares on social media 
   * */
  public async giveAccess(): Promise<void> {

    // Expect that up to 10 times more entries have enough points to get access
    const entries = await this.waitlist.getLatest(ACCESS_WAVE_COUNT * 10);
    if(!entries.length) {
        console.log('Not have entries to give access')
        return;
    }

    let accessList = []

    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const points = entry.referedCount * MOVE_IN_LINE_PER_REFERED_FRIEND + entry.sharedSocialsCount * MOVE_IN_LINE_PER_SHARED_SOCIAL;

        accessList.push(new AccessPosition(entry, i, points));
    }

    // Sort by position
    accessList = accessList.sort((a, b) => a.resultPosition - b.resultPosition);
    console.log('Built access list', accessList.map(a => `${a.entry.email} ${a.resultPosition}`));

    await Promise.all(accessList.slice(0, ACCESS_WAVE_COUNT).map(async ({entry}) => {
        await this.accesses.add(entry.email);
        // TODO: move this calls inside of accesses service
        await this.emails.sendAccessGivenEmail(entry.email);
        await this.waitlist.markAsGivenAccess(entry);
    }))
  }
}