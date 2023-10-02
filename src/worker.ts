import { AccessService } from "./AccessService"
import { WaitlistAdapter } from "./WaitlistAdapter"
import { WaitlistManager } from "./WaitlistManager"
import { Environment, getConfig } from "./config";
import { DevTuemilioListClientAdapter, TuemilioListClientAdapter } from "./providers/TuemilioListClientAdapter";
import { MongoDbAdapter } from "./providers/MongoDbAdapter";
import { Auth0Adapter } from "./providers/Auth0Adapter";
import { DevResendEmailAdapter, ResendEmailAdapter } from "./providers/ResendEmailAdapter";

export const buildDependencies = () => {
    const {
        TUEMILIO_LIST_ID, 
        TUEMILIO_API_TOKEN, 
        
        MONGODB_URI, 

        AUTH0_DOMAIN,
        AUTH0_TOKEN,

        RESEND_API_KEY,
        ACCESS_EMAIL_DOMAIN,

        MOVE_IN_LINE_PER_REFERED_FRIEND, 
        MOVE_IN_LINE_PER_SHARED_SOCIAL, 
        ACCESS_WAVE_COUNT,
        ENVIRONMENT,
        TEST_EMAIL,
    } = getConfig()

    const tuemilio = ENVIRONMENT === Environment.Production 
        ? new TuemilioListClientAdapter(TUEMILIO_LIST_ID, TUEMILIO_API_TOKEN)
        : new DevTuemilioListClientAdapter(TUEMILIO_LIST_ID, TUEMILIO_API_TOKEN)
    const mongodb = new MongoDbAdapter(MONGODB_URI)

    const auth0 = new Auth0Adapter({
        domain: AUTH0_DOMAIN,
        token: AUTH0_TOKEN,
    })

    const emailAdapter = ENVIRONMENT === Environment.Production 
        ? new ResendEmailAdapter(RESEND_API_KEY, ACCESS_EMAIL_DOMAIN) 
        : new DevResendEmailAdapter(RESEND_API_KEY, ACCESS_EMAIL_DOMAIN, TEST_EMAIL)

    const waitlist = new WaitlistAdapter(tuemilio, mongodb, MOVE_IN_LINE_PER_REFERED_FRIEND, MOVE_IN_LINE_PER_SHARED_SOCIAL)
    const accessService = new AccessService(waitlist, auth0, emailAdapter)
    const manager = new WaitlistManager(waitlist, accessService, MOVE_IN_LINE_PER_REFERED_FRIEND, MOVE_IN_LINE_PER_SHARED_SOCIAL, ACCESS_WAVE_COUNT)

    return {
        tuemilio,
        mongodb,
        waitlist,
        accessService,
        manager
    }
}

export const work = async () => {
    const { manager } = buildDependencies()

    await manager.giveAccessToTop()
}

work()
    .then(() => {
        console.log("Work is done")
    })
    .catch((error) => {
        console.error("Work failed", error)
    })