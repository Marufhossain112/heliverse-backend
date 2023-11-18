
import mongoose from 'mongoose';

import 'dotenv/config';
import app from './app';
const port = 5000;

async function main() {
    try {
        await mongoose.connect(process.env.database_url);
        console.log("Database successfully connected");
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
        
    } catch (error) {
        console.log("Database not connected", error);
    }
}
main();

