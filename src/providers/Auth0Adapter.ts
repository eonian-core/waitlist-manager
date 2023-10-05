import { ManagementClient, ManagementClientOptionsWithClientSecret } from 'auth0';
import fetch from 'node-fetch';
import { ApplicationAccessDatabase } from "../AccessService";

export class Auth0Adapter implements ApplicationAccessDatabase {
    private client: ManagementClient;

    constructor(private options: ManagementClientOptionsWithClientSecret) {
        // Initialize the auth0 client
        this.client = new ManagementClient({
            ...this.options,
            fetch: fetch as any
        });
    }

    /** Creates new user in Auth0 database */
    async add(email: string, password?: string): Promise<any> {
        console.log('Auth0Adapter.add', email);
        
        try {
            // Implement logic using the auth0 client
            const result = await this.client.users.create({
                email,
                password: password || `ps-placeholder!${Math.floor(Math.random() * 10000)}`,
                connection: 'Username-Password-Authentication'
            });
            return result.data;
        } catch (error) {
            console.error('Auth0Adapter.add', error);
            // TODO: add handling error for existing users
            // errorCode: 'auth0_idp_error', error: 'Conflict',statusCode: 409, body: '{"statusCode":409,"error":"Conflict","message":"The user already exists.","errorCode":"auth0_idp_error"}',
            throw error;
        }
    }
}

/** Adapter for development environment */
export class DevAuth0Adapter extends Auth0Adapter {

    /** Creates new user in Auth0 database */
    async add(email: string, password?: string): Promise<any> {
        const testEmail = `a${Math.floor(Math.random() * 10000)}@test.com`;
        console.log('DevAuth0Adapter.add', email, 'will change to ', testEmail);

        return super.add(testEmail, password);
    }
}