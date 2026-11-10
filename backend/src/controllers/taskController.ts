import type { Request, Response } from "express";
import { pool } from "../config/database.js";

export const getAllTasks = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const createTask = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { title, description, category, priority, due_date } =
        req.body as {
            title?: unknown;
            description?: unknown;
            category?: unknown;
            priority?: unknown;
            due_date?: unknown;
        };

    if (typeof title !== "string" || title.trim() === "") {
        res.status(400).json({ message: "Task title is required" });
        return;
    }

    try {
        const result = await pool.query(
            `INSERT INTO tasks (title, description, category, priority, due_date)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                title.trim(),
                typeof description === "string" ? description : null,
                typeof category === "string" ? category : null,
                typeof priority === "string" ? priority : "Medium",
                typeof due_date === "string" ? due_date : null
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const updateTaskStatus = async (
    req: Request,
    res: Response
): Promise<void> => {
    const taskId = Number(req.params.id);
    const { is_completed } = req.body as {
        is_completed?: unknown;
    };

    if (!Number.isInteger(taskId) || taskId <= 0) {
        res.status(400).json({ message: "Invalid task ID" });
        return;
    }

    if (typeof is_completed !== "boolean") {
        res.status(400).json({ message: "Invalid completion status" });
        return;
    }

    try {
        const result = await pool.query(
            `UPDATE tasks
             SET is_completed = $1
             WHERE id = $2
             RETURNING *`,
            [is_completed, taskId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ message: "Task not found" });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
