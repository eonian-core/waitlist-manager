import { getConfig } from "../../config";
import { Auth0Adapter } from "../Auth0Adapter";


describe('Auth0Adapter', () => {

    let auth0Adapter: Auth0Adapter;
    
    beforeEach(() => {
        const {
            AUTH0_DOMAIN,
            AUTH0_TOKEN
        } = getConfig();

        auth0Adapter = new Auth0Adapter({
            domain: AUTH0_DOMAIN,
            token: AUTH0_TOKEN
        });
    })


    it('should create a new user', async () => {
        // Arrange
        const email = `test-${Math.floor(Math.random() * 10000)}@test.com`;

        // Act
        const result = await auth0Adapter.add(email, "test123");
        console.log('result', result)

        // Assert
        expect(result).toBeDefined();
        expect(result.email).toEqual(email);
    })
})
