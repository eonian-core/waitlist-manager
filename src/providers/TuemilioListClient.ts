import fetch from 'node-fetch';
import { TuemilioEmail, TuemilioListClient } from "../WaitlistAdapter";

export const TUEMILIO_LIST_ID = process.env.TUEMILIO_LIST_ID;
export const TUEMILIO_API_TOKEN = process.env.TUEMILIO_API_TOKEN;

export class TuemilioListClientAdapter implements TuemilioListClient {
    constructor(
        private listId: string,
        private apiToken: string,
        private baseUrl: string = "https://tuemilio.com/api/v1/lists"
    ) {}

    /**
     * GET https://tuemilio.com/api/v1/lists/{LIST_ID}/emails?api_token=XXXXXXXX
     * https://docs.tuemilio.com/api/#get-an-email
     */
    async getAll(): Promise<TuemilioEmail[]> {
        const response = await fetch(`${this.baseUrl}/${this.listId}/emails?api_token=${this.apiToken}`);
        return await response.json() as any;
    }

    async update(emailId: string, data: TuemilioEmail): Promise<TuemilioEmail> {
        throw new Error("Method not implemented.");
    }
    async delete(emailId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}