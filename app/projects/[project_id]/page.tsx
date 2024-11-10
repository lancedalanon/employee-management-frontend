"use client";
import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import useAuthCheck from "@/app/hooks/useAuthCheck";

// Define types for task priority and structure
type Priority = "Low" | "Medium" | "High";

interface Task {
  id: number;
  title: string;
  column: string;
  priority: Priority;
}

const ProjectPage: React.FC = () => {
  // Role-based access control
  useAuthCheck(["employee", "intern", "company_admin"]);

  // Define columns and tasks
  const columns = ["Not started", "In progress", "Reviewing", "Completed", "Backlog"];

  // Define the initial tasks data
  const initialTasks: Task[] = [
    { id: 1, title: "Task 1", column: "Not started", priority: "Low" },
    { id: 2, title: "Task 2", column: "In progress", priority: "Medium" },
    { id: 3, title: "Task 3", column: "Reviewing", priority: "High" },
    { id: 4, title: "Task 4", column: "Completed", priority: "Low" },
    { id: 5, title: "Task 5", column: "Backlog", priority: "Medium" },
  ];

  // Load saved tasks from localStorage or fallback to initial tasks
  const loadSavedTasks = () => {
    const savedTasks = localStorage.getItem("kanban-tasks");
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  };

  const [tasks, setTasks] = useState<Task[]>(loadSavedTasks);
  const [hasChanges, setHasChanges] = useState<boolean>(false); // Track if changes were made

  // Handle drag start: store the task's ID in the event's dataTransfer
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  // Handle drop: update the task's column when dropped
  const handleDrop = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    
    // Update the task's column in the state
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          setHasChanges(true); // Mark as changed when a task is moved
          return { ...task, column };
        }
        return task;
      })
    );
  };

  // Prevent default behavior when dragging over to allow dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Get border color based on priority
  const getBorderColor = (priority: Priority) => {
    switch (priority) {
      case "Low":
        return "border-green-400";
      case "Medium":
        return "border-yellow-400";
      case "High":
        return "border-red-400";
      default:
        return "";
    }
  };

  // Save the current task state to localStorage
  const saveTasks = () => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
    alert("Tasks saved!");
    setHasChanges(false); // Reset change tracking
  };

  // Reset the tasks to their initial state
  const resetTasks = () => {
    setTasks(initialTasks); // Reset to initial tasks
    setHasChanges(false); // Reset change tracking
    alert("Tasks have been reset!");
  };

  return (
    <SidebarLayout>
      {/* Title now aligned left */}
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Projects</h1>

      <div className="flex flex-col justify-between h-full">
        {/* Conditionally render buttons if changes are made */}
        {hasChanges && (
          <div className="flex justify-between mb-6 px-8 py-4 bg-gray-50 rounded-md shadow-md">
            <button
              onClick={resetTasks}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
            <button
              onClick={saveTasks}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Save
            </button>
          </div>
        )}

        {/* Kanban columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-8 flex-grow bg-gray-100 rounded-md">
          {columns.map((column) => {
            // Filter tasks based on the column
            const columnTasks = tasks.filter((task) => task.column === column);

            return (
              <div
                key={column}
                className="bg-gray-200 p-6 rounded-xl flex flex-col min-h-[350px] overflow-hidden"
                onDragOver={handleDragOver} // Allow drop here
                onDrop={(e) => handleDrop(e, column)} // Update column on drop
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-6">{column}</h2>
                <div className="tasks-container flex-1 overflow-y-auto min-h-[250px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-item bg-white text-gray-800 p-4 rounded-lg mb-4 cursor-pointer border-l-8 ${getBorderColor(
                        task.priority
                      )}`}
                      draggable // Make this task draggable
                      onDragStart={(e) => handleDragStart(e, task.id)} // Set task ID for drag start
                    >
                      {task.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Conditionally render buttons if changes are made */}
        {hasChanges && (
          <div className="flex justify-between mt-6 px-8 py-4 bg-gray-50 rounded-md shadow-md">
            <button
              onClick={resetTasks}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all"
            >
              Reset
            </button>
            <button
              onClick={saveTasks}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ProjectPage;
