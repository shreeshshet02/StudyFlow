
import { useEffect, useState, type FormEvent } from "react";
import "./App.css";

interface Task {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  priority: string;
  due_date: string | null;
  is_completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Coding");
  const [newPriority, setNewPriority] = useState("Medium");
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/tasks"
        );

        if (!response.ok) {
          throw new Error("Unable to fetch tasks");
        }

        const data: Task[] = await response.json();
        setTasks(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchTasks();
  }, []);


const handleCreateTask = async (
  event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setSubmitting(true);
  setError(null);

  try {
    const response = await fetch("http://localhost:3000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        description: newDescription,
        category: newCategory,
        priority: newPriority,
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to create task");
    }

    const createdTask: Task = await response.json();

    setTasks((currentTasks) => [...currentTasks, createdTask]);

    setNewTitle("");
    setNewDescription("");
    setNewCategory("Coding");
    setNewPriority("Medium");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  } finally {
    setSubmitting(false);
  }
};


const handleToggleTask = async (task: Task) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/tasks/${task.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_completed: !task.is_completed,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Unable to update task");
    }

    const updatedTask: Task = await response.json();

    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === updatedTask.id
          ? updatedTask
          : currentTask
      )
    );
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong"
    );
  }
};

  return (
    <main>
      <h1>StudyFlow</h1>
      <p>Your personal productivity dashboard.</p>

<form onSubmit={handleCreateTask}>
  <h2>Add a new task</h2>

  <input
    type="text"
    placeholder="Task title"
    value={newTitle}
    onChange={(event) => setNewTitle(event.target.value)}
    required
  />

  <textarea
    placeholder="Task description"
    value={newDescription}
    onChange={(event) => setNewDescription(event.target.value)}
  />

  <select
    value={newCategory}
    onChange={(event) => setNewCategory(event.target.value)}
  >
    <option value="College">College</option>
    <option value="Coding">Coding</option>
    <option value="Personal">Personal</option>
  </select>

  <select
    value={newPriority}
    onChange={(event) => setNewPriority(event.target.value)}
  >
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  <button type="submit" disabled={submitting}>
    {submitting ? "Creating..." : "Create Task"}
  </button>
</form>

      <h2>My Tasks ({tasks.length})</h2>

      {loading && <p>Loading tasks...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <p>No tasks found. Create your first task!</p>
      )}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>
              Category: {task.category ?? "Uncategorized"} |
              Priority: {task.priority}
            </p>
            <label>
  <input
    type="checkbox"
    checked={task.is_completed}
    onChange={() => handleToggleTask(task)}
  />

  {task.is_completed ? "Completed" : "Pending"}
</label>
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;