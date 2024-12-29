import { z } from 'zod';
import configFile from "../../config.json"

const configSchema = z.object({
    TOKEN: z.string(),
    CLIENT_ID: z.string(),
})




export default configSchema.parse(configFile);