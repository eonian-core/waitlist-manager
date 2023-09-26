import { WaitlistManager, WaitlistEntry, WaitlistDatabase, ApplicationAccessDatabase, EmailService } from '../WaitlistManager';

describe('WaitlistManager', () => {
  let waitlistManager: WaitlistManager;
  let waitlistDatabase: WaitlistDatabase;
  let applicationAccessDatabase: ApplicationAccessDatabase;
  let emailService: EmailService;

  beforeEach(() => {
    waitlistDatabase = {
      getLatest: jest.fn().mockResolvedValue([]),
      markAsGivenAccess: jest.fn().mockResolvedValue(undefined),
    };

    applicationAccessDatabase = {
      add: jest.fn().mockResolvedValue(undefined),
    };

    emailService = {
      sendAccessGivenEmail: jest.fn().mockResolvedValue(undefined),
    };

    waitlistManager = new WaitlistManager(
      waitlistDatabase,
      applicationAccessDatabase,
      emailService
    );
  });

  it('should give access to the first 5 records', async () => {
    waitlistDatabase.getLatest = jest.fn().mockResolvedValue([
      { email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'b@g.com', referedCount: 2, sharedSocialsCount: 0 },
      { email: 'c@g.com', referedCount: 3, sharedSocialsCount: 0 },
      { email: 'd@g.com', referedCount: 5, sharedSocialsCount: 0 },
      { email: 'e@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'f@g.com', referedCount: 1, sharedSocialsCount: 0 },
      { email: 'g@g.com', referedCount: 0, sharedSocialsCount: 2 },
      { email: 'h@g.com', referedCount: 0, sharedSocialsCount: 3 },
      { email: 'i@g.com', referedCount: 4, sharedSocialsCount: 1 },
      { email: 'j@g.com', referedCount: 0, sharedSocialsCount: 0 },
    ]);

    await waitlistManager.giveAccess();

    expect(applicationAccessDatabase.add).toHaveBeenCalledTimes(5);
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('d@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('i@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('c@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('b@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('h@g.com');
  });

  it('should give access to entries with shared socials', async () => {
    waitlistDatabase.getLatest = jest.fn().mockResolvedValue([
      { email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'b@g.com', referedCount: 0, sharedSocialsCount: 5 },
      { email: 'c@g.com', referedCount: 0, sharedSocialsCount: 3 },
      { email: 'd@g.com', referedCount: 0, sharedSocialsCount: 2 },
      { email: 'e@g.com', referedCount: 0, sharedSocialsCount: 1 },
      { email: 'f@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'g@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'h@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'i@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'j@g.com', referedCount: 0, sharedSocialsCount: 0 },
    ]);

    await waitlistManager.giveAccess();

    expect(applicationAccessDatabase.add).toHaveBeenCalledTimes(5);
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('b@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('c@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('d@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('a@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('e@g.com');
  });

  it('should give access to entries with referred friends', async () => {
    waitlistDatabase.getLatest = jest.fn().mockResolvedValue([
      { email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'b@g.com', referedCount: 2, sharedSocialsCount: 0 },
      { email: 'c@g.com', referedCount: 3, sharedSocialsCount: 0 },
      { email: 'd@g.com', referedCount: 4, sharedSocialsCount: 0 },
      { email: 'e@g.com', referedCount: 5, sharedSocialsCount: 0 },
      { email: 'f@g.com', referedCount: 1, sharedSocialsCount: 0 },
      { email: 'g@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'h@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'g@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'h@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'i@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'j@g.com', referedCount: 0, sharedSocialsCount: 0 },
    ]);

    await waitlistManager.giveAccess();

    expect(applicationAccessDatabase.add).toHaveBeenCalledTimes(5);
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('e@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('d@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('c@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('b@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('a@g.com');
  });

  it('should give access to entries with negative points', async () => {
    waitlistDatabase.getLatest = jest.fn().mockResolvedValue([
      { email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'b@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'c@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'd@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'e@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'f@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'g@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'h@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'i@g.com', referedCount: 0, sharedSocialsCount: 0 },
      { email: 'j@g.com', referedCount: 0, sharedSocialsCount: 0 },
    ]);

    await waitlistManager.giveAccess();

    expect(applicationAccessDatabase.add).toHaveBeenCalledTimes(5);
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('a@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('b@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('c@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('d@g.com');
    expect(applicationAccessDatabase.add).toHaveBeenCalledWith('e@g.com');
  });

});