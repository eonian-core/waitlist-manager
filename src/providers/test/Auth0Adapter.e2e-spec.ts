import { getConfig } from "../../config";
import { AddOutcome, Auth0Adapter } from "../Auth0Adapter";


describe('Auth0Adapter', () => {

    let auth0Adapter: Auth0Adapter;
    
    beforeEach(() => {
        const {
            AUTH0_DOMAIN,
            AUTH0_CLIENT_ID,
            AUTH0_SECRET
        } = getConfig();

        auth0Adapter = new Auth0Adapter({
            domain: AUTH0_DOMAIN,
            clientId: AUTH0_CLIENT_ID,
            clientSecret: AUTH0_SECRET,
        });
    })


    it('should create a new user', async () => {
        // Arrange
        const email = `test-${Math.floor(Math.random() * 10000)}@test.com`;

        // Act
        const result = await auth0Adapter.add(email, "test123");
        console.log('result', result)

        // Assert
        expect(result.outcome).toBe(AddOutcome.Created);
        expect(result.data.email).toEqual(email);
    })

    it('should throw error for existing user', async () => {
        // Arrange
        const email = `a3616@test.com`;

        // Act
        const result = await auth0Adapter.add(email, "test123");

        // Assert
        expect(result.outcome).toBe(AddOutcome.Exists);
    })
})
