import { readFile } from "fs";
import { promisify } from "util";
import { EmailService } from "../AccessService";
import { Resend } from 'resend';


const read = promisify(readFile)

export class ResendEmailAdapter implements EmailService {
    private client: Resend

    constructor(private token: string, private fromEmail: string) {
        this.client = new Resend(this.token)
    }

    async sendAccessGivenEmail(email: string): Promise<any> {
        const content = await read(process.cwd() + '/src/emails/access-given.html', 'utf8');

        return await this.client.emails.send({
            from: this.fromEmail,
            to: email,
            subject: `You're in! 🎉 You've got exclusive access to Eonian!`,
            html: content
        });
    }
}
