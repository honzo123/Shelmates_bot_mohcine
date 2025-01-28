import { MongoClient, ServerApiVersion } from "mongodb";


let DB : any = null;

async function initDB() {
    if(DB != null) return DB;
    const client = new MongoClient(process.env.URI || "", {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    

    try {
        DB =  (await client.connect()).db("ChillMatesDB").collection("DB");
        console.log("[INFO] DB loaded.");
        return DB;
    } catch(e) {
        console.error("Failed to init db");
        await client.close();
    }
}





export default initDB;