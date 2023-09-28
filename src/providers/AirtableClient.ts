import Airtable = require("airtable")
import { AirtableClient } from "../WaitlistAdapter";
import { WaitlistEntry } from "../WaitlistEntry";

const allowedFields = [
    'address'  ,
    'id',
    'ip',
    'points',
    'anti_points',
    'source',
    'referrer_id',
    'subscribed',
    'click_time',
    'uuid',
    'created_at',
    'blocked',
    'fraud_id',
    'shared_on',
    'custom_fields',
    'verified_at',
    'browser',
    'operating_system',
    'device',
    'access_granted_at',
    'email',
    'referedCount',
    'sharedSocialsCount'
]

export class AirtableClientAdapter implements AirtableClient {
    private base: Airtable.Base;
    private table: Airtable.Table<any>;

    constructor(
    ) { 
        this.base = Airtable.base('appi9xBQR1uB9ogrw')
        this.table = this.base('Contacts')
    }

    async add(entry: WaitlistEntry): Promise<Airtable.Record<any>> {
        const result = {} as any

        for (const key of allowedFields) {
            result[key] = (entry as any)[key];
        }

        return await this.table.create(result as WaitlistEntry)
    }

}