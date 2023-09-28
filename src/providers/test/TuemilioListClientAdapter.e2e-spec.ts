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

        console.log(emails.filter(({ points }) => points > 0));
        
        expect(emails).toBeInstanceOf(Array);
    })
})