import { AccessService } from '../AccessService';
import { WaitlistDatabase } from '../WaitlistAdapter';
import { WaitlistManager } from '../WaitlistManager';

describe('WaitlistManager', () => {
  let waitlistManager: WaitlistManager;

  let waitlistDatabase: WaitlistDatabase;
  let accesses: AccessService;

  beforeEach(() => {
    waitlistDatabase = {
      getLatest: jest.fn().mockResolvedValue([]),
    } as any;

    accesses = {
      giveAccess: jest.fn().mockResolvedValue(undefined),
    } as any as AccessService;

    waitlistManager = new WaitlistManager(
      waitlistDatabase,
      accesses
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

    await waitlistManager.giveAccessToTop();

    expect(accesses.giveAccess).toHaveBeenCalledTimes(5);
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'd@g.com', referedCount: 5, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'i@g.com', referedCount: 4, sharedSocialsCount: 1 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'c@g.com', referedCount: 3, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'b@g.com', referedCount: 2, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'h@g.com', referedCount: 0, sharedSocialsCount: 3 });
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

    await waitlistManager.giveAccessToTop();

    expect(accesses.giveAccess).toHaveBeenCalledTimes(5);
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'b@g.com', referedCount: 0, sharedSocialsCount: 5 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'c@g.com', referedCount: 0, sharedSocialsCount: 3 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'd@g.com', referedCount: 0, sharedSocialsCount: 2 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'e@g.com', referedCount: 0, sharedSocialsCount: 1 });
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

    await waitlistManager.giveAccessToTop();

    expect(accesses.giveAccess).toHaveBeenCalledTimes(5);
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'e@g.com', referedCount: 5, sharedSocialsCount: 0 },);
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'd@g.com', referedCount: 4, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'c@g.com', referedCount: 3, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'b@g.com', referedCount: 2, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 });
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

    await waitlistManager.giveAccessToTop();

    expect(accesses.giveAccess).toHaveBeenCalledTimes(5);
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'a@g.com', referedCount: 0, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'b@g.com', referedCount: 0, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'c@g.com', referedCount: 0, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'd@g.com', referedCount: 0, sharedSocialsCount: 0 });
    expect(accesses.giveAccess).toHaveBeenCalledWith({ email: 'e@g.com', referedCount: 0, sharedSocialsCount: 0 });
  });

});