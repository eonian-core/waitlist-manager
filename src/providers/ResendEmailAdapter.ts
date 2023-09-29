import { EmailService } from "../AccessService";
import { Resend } from 'resend';

export class ResendEmailAdapter implements EmailService {
    private client: Resend

    constructor(token: string) {
        this.client = new Resend(token)
    }

    async sendAccessGivenEmail(email: string): Promise<any> {
        // TODO: real email and domain
        return await this.client.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Hello World',
            html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
        });
    }
}