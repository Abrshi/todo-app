"use client";

import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface Task {
  id: number;
  text: string;
  completed: boolean;
  dateTime: Date; // Added dateTime property
}

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && task.trim() && time) {
      addTask(task, new Date(time));
      setTask("");
      setTime("");
    }
  };

  const addTask = (taskText: string, timeDattime: Date) => {
    if (taskText.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: taskText,
          completed: false,
          dateTime: timeDattime,
        },
      ]);
    }
  };

  const toggleComplete = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>

      <div className="flex flex-col gap-2 mb-4 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Enter task..."
          className="border p-2 w-full"
          value={task}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <input
          type="datetime-local"
          className="border p-2 w-full"
          value={time}
          onChange={handleTimeChange}
        />
        <button
          onClick={() => {
            if (task.trim() && time) {
              addTask(task, new Date(time));
              setTask("");
              setTime("");
            }
          }}
          className="px-5 py-2 rounded bg-green-500 text-white"
        >
          Add Task
        </button>
      </div>

      {tasks.length > 0 ? (
        <h2 className="text-xl font-bold mb-4">Tasks</h2>
      ) : (
        <h2 className="text-xl font-bold mb-4">You have no tasks for now</h2>
      )}
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="flex justify-between items-center p-2 border-b">
            <div>
              <span className={task.completed ? "line-through text-gray-500" : ""}>
                {task.text}
              </span>
              <div className="text-sm text-gray-500">
                {new Date(task.dateTime).toLocaleString()} {/* Display formatted date */}
              </div>
            </div>
            <div className="space-x-2">
              <span onClick={() => toggleComplete(task.id)}>
                {task.completed ? (
                  <span className="text-green-500">Completed</span>
                ) : (
                  <span className="text-yellow-500">Pending</span>
                )}
              </span>
              <button onClick={() => deleteTask(task.id)} className="text-red-500">
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
