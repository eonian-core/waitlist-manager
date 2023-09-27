import { AccessService } from "./AccessService";
import { WaitlistEntry } from "./WaitlistEntry";


export interface WaitlistDatabase {
    getLatest(count: number): Promise<WaitlistEntry[]>
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
    private accesses: AccessService
  ) {}
  
  /** 
   * Give access to top list of waitlist, 
   * takes into acount amount of reffered friends 
   * and shares on social media 
   * */
  public async giveAccessToTop(): Promise<void> {

    // Expect that up to 10 times more entries have enough points to get access
    const entries = await this.waitlist.getLatest(ACCESS_WAVE_COUNT * 10);
    if(!entries.length) {
        console.log('Not have entries to give access')
        return;
    }

    const accessList = entries.map((entry, i) => {
        const points = entry.referedCount * MOVE_IN_LINE_PER_REFERED_FRIEND + entry.sharedSocialsCount * MOVE_IN_LINE_PER_SHARED_SOCIAL;

        return new AccessPosition(entry, i, points)
    })
    // Sort by position
    .sort((a, b) => a.resultPosition - b.resultPosition)
    .slice(0, ACCESS_WAVE_COUNT)
    
    console.log('Built access list', accessList.map(a => `${a.entry.email} ${a.resultPosition}`));

    await Promise.all(accessList.map(async ({entry}) => {
        return await this.accesses.giveAccess(entry);
    }))
  }
}