
const express = require('express');
const mongoose = require('mongoose');
import 'dotenv/config';
const app = express();
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
app.get('/', (req, res) => {
    res.send('Hello World!');
});
