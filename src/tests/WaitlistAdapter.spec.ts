import { WaitlistAdapter, TuemilioEmail, TuemilioListClient } from "../WaitlistAdapter";
import { WaitlistEntry } from "../WaitlistEntry";



describe("WaitlistAdapter", () => {
    // Mock implementation for TuemilioListClient
    let tuemilioMock: TuemilioListClient;

    let waitlistAdapter: WaitlistAdapter;

    beforeEach(() => {
        tuemilioMock = {
            getAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            grantAccess: jest.fn(),
        }
        waitlistAdapter = new WaitlistAdapter(tuemilioMock, 5, 3);
    });

    describe("markAsGivenAccess", () => {
        it("should add the entry to Airtable and delete it from Tuemilio", async () => {
            const entry: WaitlistEntry = { id: "1", name: "John Doe" } as any;

            await waitlistAdapter.markAsGivenAccess(entry);

            expect(tuemilioMock.grantAccess).toHaveBeenCalledWith(entry.id);
        });
    });

    describe("getLatest", () => {
        it("should return the latest waitlist entries with additional properties", async () => {
            const records: TuemilioEmail[] = [
                {
                    id: 2,
                    address: "jane@example.com",
                    created_at: "2023-07-28T10:30:15.000000Z",
                    points: 16,
                    position: 2,
                    people_ahead: 1,
                    shared_on: { twitter: true, facebook: true },
                },
                {
                    id: 1,
                    address: "john@example.com",
                    created_at: "2023-07-27T12:45:29.000000Z",
                    points: 8,
                    position: 1,
                    people_ahead: 0,
                    shared_on: { telegram: true },
                },
                {
                    id: 3,
                    address: "jane2@example.com",
                    created_at: "2023-07-26T10:30:15.000000Z",
                    points: 20,
                    position: 3,
                    access_granted_at: null,
                    people_ahead: 2,
                    shared_on: { },
                },
                {
                    id: 4,
                    address: "jane3@example.com",
                    created_at: "2023-07-26T10:30:15.000000Z",
                    points: 20,
                    position: 3,
                    people_ahead: 2,
                    access_granted_at: "2023-07-26T10:30:15.000000Z",
                    shared_on: { },
                },
            ];

            tuemilioMock.getAll = jest.fn().mockResolvedValue(records);

            const result = await waitlistAdapter.getLatest();

            expect(result).toHaveLength(3);
            expect(result[0]).toHaveProperty("email", 'jane2@example.com');
            expect(result[0]).toHaveProperty("referedCount", 4);
            expect(result[0]).toHaveProperty("sharedSocialsCount", 0);
            
            expect(result[1]).toHaveProperty("email", "john@example.com");
            expect(result[1]).toHaveProperty("referedCount", 1);
            expect(result[1]).toHaveProperty("sharedSocialsCount", 1);

            expect(result[2]).toHaveProperty("email", "jane@example.com");
            expect(result[2]).toHaveProperty("referedCount", 2);
            expect(result[2]).toHaveProperty("sharedSocialsCount", 2);


        });

        it("should handle empty records array", async () => {
            tuemilioMock.getAll = jest.fn().mockResolvedValue([]);

            const result = await waitlistAdapter.getLatest();

            expect(result).toHaveLength(0);
        });

        it("should handle empty shared_on object", async () => {
            const records: TuemilioEmail[] = [
                {
                    id: 1,
                    address: "john@example.com",
                    created_at: "2023-07-27T12:45:29.000000Z",
                    points: 10,
                    position: 1,
                    people_ahead: 0,
                    shared_on: {},
                },
            ];

            tuemilioMock.getAll = jest.fn().mockResolvedValue(records);

            const result = await waitlistAdapter.getLatest();

            expect(result).toHaveLength(records.length);
            expect(result[0]).toHaveProperty("email", records[0].address);
            expect(result[0]).toHaveProperty("referedCount", 2);
            expect(result[0]).toHaveProperty("sharedSocialsCount", 0);
        });
    });
});