import { AccessService, WaitlistDatabase, ApplicationAccessDatabase, EmailService } from '../AccessService';
import { WaitlistEntry } from '../WaitlistEntry';

describe('AccessService', () => {
  let waitlistMock: WaitlistDatabase;
  let accessesMock: ApplicationAccessDatabase;
  let emailsMock: EmailService;
  let accessService: AccessService;

  beforeEach(() => {
    waitlistMock = {
      markAsGivenAccess: jest.fn(),
    };

    accessesMock = {
      add: jest.fn(),
    };

    emailsMock = {
      sendAccessGivenEmail: jest.fn(),
    };

    accessService = new AccessService(waitlistMock, accessesMock, emailsMock);
  });

  test('giveAccess should call the necessary methods with the correct arguments', async () => {
    // Arrange
    const waitlistEntry: WaitlistEntry = { email: 'test@example.com' } as any;

    // Act
    await accessService.giveAccess(waitlistEntry);

    // Assert
    expect(accessesMock.add).toHaveBeenCalledWith(waitlistEntry.email);
    expect(emailsMock.sendAccessGivenEmail).toHaveBeenCalledWith(waitlistEntry.email);
    expect(waitlistMock.markAsGivenAccess).toHaveBeenCalledWith(waitlistEntry);
  });

});