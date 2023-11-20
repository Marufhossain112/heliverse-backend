"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// parse data
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const userSchema = new mongoose_1.default.Schema({ first_name: String, last_name: String, email: String, gender: String, avatar: String, domain: String, available: Boolean });
// Define a simple User model
const teamSchema = new mongoose_1.default.Schema({
    teamName: String,
    members: [{ type: userSchema, ref: 'User' }]
});
const User = mongoose_1.default.model('User', userSchema);
const Team = mongoose_1.default.model('Team', teamSchema);
// Create a new user
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new User(req.body);
        const savedUser = yield newUser.save();
        res.json({
            success: true,
            message: "Successfully created user",
            data: savedUser
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// get all users
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield User.find(filter).skip(skip).limit(limit);
        const total = yield User.countDocuments();
        res.json({
            success: true,
            message: "Successfully fetched all user",
            page: page,
            total,
            skip,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// get a single user
app.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const newUser = new User(req.body);
        const { id } = req.params;
        const result = yield User.find({ _id: new mongoose_1.default.Types.ObjectId(id) });
        res.json({
            success: true,
            message: "Successfully fetched a user",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// update a single user
app.put('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = { _id: new mongoose_1.default.Types.ObjectId(id) };
        const updateData = req.body;
        const result = yield User.findOneAndUpdate(query, updateData, { new: true });
        res.json({
            success: true,
            message: "Successfully updated a user",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// update a single user
app.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const query = { _id: new mongoose_1.default.Types.ObjectId(id) };
        const result = yield User.findOneAndDelete(query);
        res.json({
            success: true,
            message: "Successfully deleted a user",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// Create a team
app.post('/team', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newTeam = new Team(req.body);
        const createdTeam = yield newTeam.save();
        res.json({
            success: true,
            message: "Successfully created team",
            data: createdTeam
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
// get a single team
// get a single user
app.get('/team/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const newUser = new User(req.body);
        const { id } = req.params;
        const result = yield Team.find({ _id: new mongoose_1.default.Types.ObjectId(id) });
        res.json({
            success: true,
            message: "Successfully fetched a team",
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
exports.default = app;
