import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({ first_name: String, last_name: String, email: String, gender: String, avatar: String, domain: String, available: Boolean });
// Define a simple User model
const teamSchema = new mongoose.Schema({
    teamName: String,
    members: [{ type: userSchema, ref: 'User' }]
});
const User = mongoose.model('User', userSchema);
const Team = mongoose.model('Team', teamSchema);


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
        // const { page } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;
        const searchTerm = req.query.searchTerm;
        // Extract filters from the request query
        const { domain, gender, available } = req.query;
        console.log(domain, gender, available);
        // Build the filter object based on the provided criteria
        const filter = {
            $or: [
                { first_name: new RegExp(searchTerm, 'i') },
                { last_name: new RegExp(searchTerm, 'i') }
            ]
        };
        if (domain) {
            filter.domain = domain;
        }

        if (gender) {
            filter.gender = gender;
        }

        if (available) {
            filter.available = available;
        }
        const result = await User.find(filter).skip(skip).limit(limit);
        const total = await User.countDocuments();
        res.json({
            success: true,
            message: "Successfully fetched all user",
            page: page,
            total,
            skip,
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
// Create a team
app.post('/team', async (req, res) => {
    try {
        const newTeam = new Team(req.body);
        const createdTeam = await newTeam.save();
        res.json({
            success: true,
            message: "Successfully created team",
            data: createdTeam
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get a single team
// get a single user
app.get('/team/:id', async (req, res) => {
    try {
        // const newUser = new User(req.body);
        const { id } = req.params;
        const result = await Team.find({ _id: new mongoose.Types.ObjectId(id) });
        res.json({
            success: true,
            message: "Successfully fetched a team",
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