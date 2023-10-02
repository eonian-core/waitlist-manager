import { WaitlistDatabase } from "./WaitlistAdapter";
import { WaitlistEntry } from "./WaitlistEntry"
import { Environment } from "./config";

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
        private emails: EmailService,
    ) {}

    public async giveAccess(entry: WaitlistEntry) {
        await this.accesses.add(entry.email);

        await this.emails.sendAccessGivenEmail(entry.email);

        // Mark as given access cannot be reverted
        // so important to make it only after all other actions is done
        await this.waitlist.markAsGivenAccess(entry);
    }
}