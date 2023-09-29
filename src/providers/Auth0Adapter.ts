import { ManagementClient, ManagementClientOptionsWithToken } from 'auth0';
import fetch from 'node-fetch';
import { ApplicationAccessDatabase } from "../AccessService";



export class Auth0Adapter implements ApplicationAccessDatabase {
    private client: ManagementClient;

    constructor(private options: ManagementClientOptionsWithToken) {
        // Initialize the auth0 client
        this.client = new ManagementClient({
            ...this.options,
            fetch: fetch as any
        });
    }

    /** Creates new user in Auth0 database */
    async add(email: string, password?: string): Promise<any> {
        try {
            // Implement logic using the auth0 client
            return await this.client.users.create({
                email,
                password: password || `ps-${Math.floor(Math.random() * 10000)}`,
                connection: 'Username-Password-Authentication'
            });
        } catch (error) {
            console.log('Auth0Adapter.add', error);
            throw error;
        }
    }
}