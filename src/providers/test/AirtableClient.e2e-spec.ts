import { AirtableClientAdapter } from "../AirtableClient"

describe('AirtableClientAdapter', () => {
    let client: AirtableClientAdapter

    beforeEach(() => {
        client = new AirtableClientAdapter()
    })

    it('should add a record to the table', async () => {
        const entry = {
            id: 1084660,
            address: 'test@gmail.com',
            ip: '111.125.40.97',
            points: 8,
            anti_points: 0,
            source: 'email-form',
            referrer_id: 1078820,
            referrer_url: null,
            subscribed: 1,
            click_time: 133,
            cookie_uuid: '11228015-d9a6-4c95-a1e0-7ac43a2aa56f',
            uuid: '3435b150-cda2-4240-b4ce-a4125acad0ee',
            created_at: '2023-09-22T22:46:38.000000Z',
            blocked: 0,
            fraud_id: null,
            custom_fields: null,
            shared_on: { telegram: true },
            verified_at: null,
            browser: 'Edge',
            operating_system: 'Windows',
            device: 'desktop',
            access_granted_at: null,
            consents: [],
            dashboard_link: 'https://eonian.finance?email=test@gmail.com',
            dashboard_link_uuid: 'https://eonian.finance?uuid=3435b150-cda2-4240-b4ce-a4125acad0ee',
            referral_link: 'https://eonian.finance?r=BQWRX',
            unsubscribe_link: 'https://tuemilio.com/email/1084660/unsubscribe?signature=dcda2153bbe66d30de101dc91a604662706f3ce845ae1c5f26c57dc583aaa68e'
        }

        const result = await client.add(entry as any)

        console.log('record created', result)

        expect(result).not.toBeUndefined()
    })
})