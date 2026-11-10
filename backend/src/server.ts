import cors from "cors";
import { testDatabaseConnection } from "./config/database.js";
import taskRoutes from "./routes/taskRoutes.js";
import express from "express";

const app = express();

app.use(cors({
    origin: "http://localhost:5173"
}));

app.use(express.json());

app.use("/api/tasks", taskRoutes);

const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Welcome to StudyFlow API!");
});

app.listen(PORT, () => {
const startServer = async () => {
    await testDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`StudyFlow server running at http://localhost:${PORT}`);
    });
};

startServer();
});