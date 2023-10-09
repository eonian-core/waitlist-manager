import { ManagementClient, ManagementClientOptionsWithClientSecret } from 'auth0';
import fetch from 'node-fetch';
import { ApplicationAccessDatabase } from "../AccessService";

export enum AddOutcome {
    Created = "Created",
    Exists = "Exists",
}

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
    async add(email: string, password?: string): Promise<{outcome: AddOutcome, data?: any}> {
        console.log('Auth0Adapter.add', email);
        
        try {
            // Implement logic using the auth0 client
            const result = await this.client.users.create({
                email,
                password: password || `ps-placeholder!${Math.floor(Math.random() * 10000)}`,
                connection: 'Username-Password-Authentication'
            });
            return {outcome: AddOutcome.Created, data: result.data };
        } catch (error) {
            console.error('Auth0Adapter.add', error);
            // Handle error for existing users
            if (error.statusCode === 409 && error.errorCode === 'auth0_idp_error') {
                console.log('User already exists, will ignore it and continue', email);
                return { outcome: AddOutcome.Exists }
            }

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