import { TUEMILIO_API_TOKEN, TUEMILIO_LIST_ID, TuemilioListClientAdapter } from "../TuemilioListClient";

describe('TuemilioListClientAdapter', () => {
    it('should be able to get all emails', async () => {
        const tuemilioListClient = new TuemilioListClientAdapter(TUEMILIO_LIST_ID!, TUEMILIO_API_TOKEN!);
        const emails = await tuemilioListClient.getAll();

        console.log(emails.filter(({ points }) => points > 0));
        expect(emails).toBeInstanceOf(Array);
    })
})