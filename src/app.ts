import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const app = express();
app.use(cors());
// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({ first_name: { type: String, required: true }, last_name: { type: String, required: true }, email: { type: String, required: true }, gender: { type: String, required: true }, avatar: { type: String, required: true }, domain: { type: String, required: true }, available: { type: Boolean, required: true }, team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, });
// Define a simple User model

const User = mongoose.model('User', userSchema);

const teamSchema = new mongoose.Schema({
    // Define your Team schema fields here

    // ... other fields
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Assuming a reference to the User model
});

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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
// get all users
app.get('/users', async (req, res) => {
    try {
        // const { page } = req.query;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;
        // const limit = 20;
        const skip = (page - 1) * limit;
        const searchTerm: any = req.query.searchTerm;
        // Extract filters from the request query
        const { domain, gender, available } = req.query;
        console.log(domain, gender, available);
        // Build the filter object based on the provided criteria
        const filter: any = {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
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
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
// Create a team
// Create a team
app.post('/team', async (req, res) => {
    try {
        const newTeam = new Team(req.body);
        // Save the team document to the database
        const createdTeam = await newTeam.save();
        console.log(createdTeam);
        // Update user documents to reference the created team
        const userIds = req.body.members;
        await User.updateMany({ _id: { $in: userIds } }, { $set: { team: createdTeam._id } });
        // Populate the team information with user details
        const populatedTeam = await Team.findByIdAndUpdate(
            createdTeam._id,
            { $set: { members: userIds } }, // You can set other fields as needed
            { new: true } // Returns the modified document
        ).populate('members', 'first_name last_name email gender domain available avatar');

        res.json({
            success: true,
            message: "Successfully created and saved team",
            data: populatedTeam
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// get a single team
app.get('/team/:id', async (req, res) => {
    try {
        // const newUser = new User(req.body);
        const { id } = req.params;
        const result = await User.find({ team: new mongoose.Types.ObjectId(id) });
        res.json({
            success: true,
            message: "Successfully fetched a team",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
// get all team
app.get('/team', async (req, res) => {
    try {
        const teams = await Team.find({}).populate({
            path: 'members',
            select: 'first_name last_name email gender domain available avatar', // Specify the fields you want to retrieve
        });
        // Modify and save each team individually
        const updatedTeams = await Promise.all(teams.map(async (team) => {
            // Make modifications to the team if needed
            // For example, updating a field in each member
            team.members.forEach((member) => {
                // Modify member as needed
                // member.someField = 'someValue';
            });

            // Save the modified team to the database
            return team.save();
        }));

        res.json({
            success: true,
            message: "Successfully fetched teams",
            data: updatedTeams
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});
export default app;