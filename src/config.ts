
export const getConfig = () => {
    const config = {
        TUEMILIO_LIST_ID: process.env.TUEMILIO_LIST_ID!,
        TUEMILIO_API_TOKEN: process.env.TUEMILIO_API_TOKEN!,
        MONGODB_URI: process.env.MONGODB_URI!,
        MOVE_IN_LINE_PER_REFERED_FRIEND: +(process.env.MOVE_IN_LINE_PER_REFERED_FRIEND || 5),
        MOVE_IN_LINE_PER_SHARED_SOCIAL: +(process.env.MOVE_IN_LINE_PER_SHARED_SOCIAL || 3),
        /** Amount of entries to give access per one call */
        ACCESS_WAVE_COUNT: +(process.env.ACCESS_WAVE_COUNT || 5)
    }

    Object.entries(config).forEach(([key, value]) => {
        if (!value) {
            throw new Error(`Missing environment variable ${key}`)
        }
    })

    return config
}