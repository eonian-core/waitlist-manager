import { AccessService } from "./AccessService";
import { WaitlistDatabase } from "./WaitlistAdapter";
import { WaitlistEntry } from "./WaitlistEntry";


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

export class WaitlistManager {
  constructor(
    private waitlist: WaitlistDatabase,
    private accesses: AccessService,
    private moveInLinePerReferedFriend: number,
    private moveInLinePerSharedSocial: number,
    /** Amount of entries to give access per one call */
    private accessWaveCount: number
  ) {}
  
  /** 
   * Give access to top list of waitlist, 
   * takes into acount amount of reffered friends 
   * and shares on social media 
   * */
  public async giveAccessToTop(): Promise<void> {

    // Expect that up to 10 times more entries have enough points to get access
    const entries = await this.waitlist.getLatest();
    if(!entries.length) {
        console.log('Not have entries to give access')
        return;
    }

    const accessList = entries.map((entry, i) => {
        const points = entry.referedCount * this.moveInLinePerReferedFriend + entry.sharedSocialsCount * this.moveInLinePerSharedSocial;

        return new AccessPosition(entry, i, points)
    })
    // Sort by position
    .sort((a, b) => a.resultPosition - b.resultPosition)
    .slice(0, this.accessWaveCount)
    
    console.log('Built access list', accessList.map(a => `${a.entry.email} ${a.resultPosition}`));

    await Promise.all(accessList.map(async ({entry}) => {
      return await this.accesses.giveAccess(entry);
    }))

    console.log("Accesses given to all entries!")
  }
}