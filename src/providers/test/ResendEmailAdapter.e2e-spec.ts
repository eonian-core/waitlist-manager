import { getConfig } from "../../config";
import { ResendEmailAdapter } from "../ResendEmailAdapter";


describe('ResendEmailAdapter', () => {

    let adapter: ResendEmailAdapter;
    
    beforeEach(() => {
        const {
            RESEND_API_KEY,
            ACCESS_EMAIL_DOMAIN
        } = getConfig();

        adapter = new ResendEmailAdapter(RESEND_API_KEY, ACCESS_EMAIL_DOMAIN);
    })

    it('should send email', async () => {
        // Arrange
        const email = process.env.TEST_EMAIL;
        if(!email) 
            throw new Error('Missing TEST_EMAIL environment variable')
        
        // Act
        const result = await adapter.sendAccessGivenEmail(email);
        console.log('result', result)

        // Assert
        expect(result).toBeDefined();
    })

})