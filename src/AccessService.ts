import { WaitlistDatabase } from "./WaitlistAdapter";
import { WaitlistEntry } from "./WaitlistEntry"

export interface ApplicationAccessDatabase {
    add(email: string): Promise<void>
}

export interface EmailService {
    sendAccessGivenEmail(email: string): Promise<void>
}

export class AccessService {
    constructor(
        private waitlist: WaitlistDatabase,
        private accesses: ApplicationAccessDatabase,
        private emails: EmailService
    ) {}

    public async giveAccess(entry: WaitlistEntry) {
        await this.accesses.add(entry.email);

        await this.emails.sendAccessGivenEmail(entry.email);

        await this.waitlist.markAsGivenAccess(entry);
    }
}