import express from "express";
import {
    getAllTasks,
    createTask,
    updateTaskStatus
} from "../controllers/taskController.js";
const router = express.Router();

router.get("/", getAllTasks);
router.post("/", createTask);
router.patch("/:id", updateTaskStatus);

export default router;