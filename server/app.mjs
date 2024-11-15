import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from "multer";

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb+srv://cs23b057:cs23b057@testforrender.6nt0d.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: String,
    artForm: String,
    isArtist: Boolean,
    contribute: Boolean
});

const User = mongoose.model("User", userSchema);

app.post("/signup", async (req, res) => {
    const { name, email, username, password, artForm, isArtist, contribute } = req.body;
    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const existingUserName = await User.findOne({ username });
        if (existingUserName) {
            return res.status(400).json({ message: "Username already taken." });
        }

        const newUser = new User({ name, email, username, password, artForm, isArtist, contribute });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

//for models


const modelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    fileData: { type: Buffer, required: true },
    fileType: { type: String, default: "model/gltf-binary" },
    uploadedAt: { type: Date, default: Date.now },
});

const Model = mongoose.model("Model", modelSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/uploadmodel", upload.single("modelfile"), async (req, res) => {
    const { name, description } = req.body;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
    }
    try {
        const mimeType = file.mimetype === "application/octet-stream"
            ? (file.originalname.endsWith(".glb") ? "model/gltf-binary" : "model/gltf+json")
            : file.mimetype;

        const newModel = new Model({
            name,
            description,
            fileData: file.buffer,
            fileType: mimeType,
        });
        await newModel.save();
        res.status(201).json({ message: "3D model uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to upload 3D models properly. The error is:", error });
    }
});


app.get("/models", async (req, res) => {
    const modelName = req.query.name;

    try {
        let query = modelName ? { name: modelName } : {};
        const models = await Model.find(query);
        res.status(200).json(models);
    } catch (error) {
        console.error("Error in retrieving models:", error);
        res.status(500).json({ message: "Error in retrieving models", error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
