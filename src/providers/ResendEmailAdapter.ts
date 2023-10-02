import { readFile } from "fs";
import { promisify } from "util";
import { EmailService } from "../AccessService";
import { Resend } from 'resend';


const read = promisify(readFile)

export class ResendEmailAdapter implements EmailService {
    private client: Resend

    constructor(
        private token: string, 
        private fromEmail: string,
    ) {
        this.client = new Resend(this.token)
    }

    async sendAccessGivenEmail(email: string): Promise<any> {
        console.log('ResendEmailAdapter.sendAccessGivenEmail', email);

        const content = await read(process.cwd() + '/src/emails/access-given.html', 'utf8');

        return await this.client.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `You're in! 🎉 You've got exclusive access to Eonian!`,
            html: content
        });
    }
}

/** Adapter for development environment */
export class DevResendEmailAdapter extends ResendEmailAdapter {
    constructor(
        token: string, 
        fromEmail: string,
        /** Will send email allways there */
        private testEmail: string,
    ) {
        super(token, fromEmail);
    }

    async sendAccessGivenEmail(email: string): Promise<any> {
        console.log('DevResendEmailAdapter.sendAccessGivenEmail', email, 'will send to test email instead', this.testEmail);

        return await super.sendAccessGivenEmail(this.testEmail);
    }
}