import { getConfig } from "../../config";
import { TuemilioListClientAdapter } from "../TuemilioListClientAdapter";

describe('TuemilioListClientAdapter', () => {
    let tuemilioListClient: TuemilioListClientAdapter;

    beforeEach(() => {
        const {TUEMILIO_LIST_ID, TUEMILIO_API_TOKEN} = getConfig();

        tuemilioListClient = new TuemilioListClientAdapter(TUEMILIO_LIST_ID, TUEMILIO_API_TOKEN);
    })

    it('should be able to get all emails', async () => {
        const emails = await tuemilioListClient.getAll();

        console.log(emails.slice(0, 10));
        
        expect(emails).toBeInstanceOf(Array);
    })

    it('should be able to grant access to an email', async () => {
        const email = 1078178

        const updatedEmail = await tuemilioListClient.grantAccess(`${email}`);

        console.log(updatedEmail);

        expect(updatedEmail).toHaveProperty('access_granted_at');
    })
})