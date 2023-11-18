import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({ first_name: String, last_name: String, email: String, gender: String, avatar: String, domain: String, available: String });
// Define a simple User model
const User = mongoose.model('User', userSchema);

// Create a new user
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.json({
            success: true,
            message: "Successfully created user",
            data: savedUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// get all users
app.get('/users', async (req, res) => {
    try {
        // const newUser = new User(req.body);
        const result = await User.find();
        res.json({
            success: true,
            message: "Successfully fetched all user",
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// get a single user
app.get('/users/:id', async (req, res) => {
    try {
        // const newUser = new User(req.body);
        const { id } = req.params;
        const result = await User.find({ _id: new mongoose.Types.ObjectId(id) });
        res.json({
            success: true,
            message: "Successfully fetched a user",
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// update a single user
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: new mongoose.Types.ObjectId(id) };
        const updateData = req.body;
        const result = await User.findOneAndUpdate(query, updateData, { new: true });
        res.json({
            success: true,
            message: "Successfully updated a user",
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// update a single user
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = { _id: new mongoose.Types.ObjectId(id) };
        const result = await User.findOneAndDelete(query);
        res.json({
            success: true,
            message: "Successfully deleted a user",
            data: result
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/', (req, res) => {
    res.send('Hello World!');
});
export default app;