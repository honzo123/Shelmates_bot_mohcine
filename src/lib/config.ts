// import { z } from 'zod';
// import configFile from "../../config.json"

// const configSchema = z.object({
//     TOKEN: z.string(),
//     CLIENT_ID: z.string(),
// })
// configSchema.parse(configFile)

const config = {
    TOKEN: process.env.TOKEN!,
    CLIENT_ID: process.env.CLIENT_ID!,
} 


export default config