import fetch from 'node-fetch';
import { TuemilioEmail, TuemilioListClient } from "../WaitlistAdapter";



export class TuemilioListClientAdapter implements TuemilioListClient {
    private apiUrl: string;

    constructor(
        private listId: string,
        private apiToken: string,
        private baseUrl: string = "https://tuemilio.com/api/v1/lists"
    ) { 
        this.apiUrl = `${this.baseUrl}/${this.listId}/emails`
    }

    /**
     * GET https://tuemilio.com/api/v1/lists/{LIST_ID}/emails?api_token=XXXXXXXX
     * https://docs.tuemilio.com/api/#get-an-email
     */
    async getAll(): Promise<TuemilioEmail[]> {
        const response = await fetch(`${this.apiUrl}?api_token=${this.apiToken}`);
        return await response.json() as any;
    }

    /**
     * PUT https://tuemilio.com/api/v1/lists/{LIST_ID}/emails/{EMAIL_ID}?api_token=XXXXXXXX
     * https://docs.tuemilio.com/api/#update-an-email
     */
    async update(emailId: string, data: TuemilioEmail): Promise<TuemilioEmail> {
        console.log('TuemilioListClientAdapter.update', emailId, 'will update it with', data);
        const response = await fetch(`${this.apiUrl}/${emailId}?api_token=${this.apiToken}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        return await response.json() as TuemilioEmail;
    }

    /**
     * DELETE https://tuemilio.com/api/v1/lists/{LIST_ID}/emails/{EMAIL_ID}?api_token=XXXXXXXX
     * https://docs.tuemilio.com/api/#delete-an-email 
     */
    async delete(emailId: string): Promise<void> {
        console.log('TuemilioListClientAdapter.delete: will delete', emailId);
        const response = await fetch(`${this.apiUrl}/${emailId}?api_token=${this.apiToken}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.status !== 200) {
            throw new Error("Failed to delete email");
        }
    }
}

/** Adapter for development environment */
export class DevTuemilioListClientAdapter extends TuemilioListClientAdapter {

    async update(emailId: string, data: TuemilioEmail): Promise<TuemilioEmail> {
        console.log('DevTuemilioListClientAdapter.update', emailId, 'will not update it with', data);
        return data;
    }

    async delete(emailId: string): Promise<void> {
        console.log('DevTuemilioListClientAdapter.delete', emailId, 'will not delete it');
    }
}