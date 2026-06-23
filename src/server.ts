
import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port;

async function main() {
    try {
        await prisma.$connect();
        console.log("connected succesfully");
        
        app.listen(PORT,()=>{
            console.log(`server is running on ${PORT}`);
            
        })
    } catch (error) {
        console.log(`starting error `,error);
        await prisma.$disconnect();
        process.exit(1);
        
    }
}
main();