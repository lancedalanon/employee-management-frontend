"use client";
import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchProjectTasks } from "@/store/projectTaskSlice";
import {
  ProjectTask,
  ProjectTaskProgress,
  ProjectTaskPriorityLevel,
  PaginatedProjectTaskResponse,
} from "@/types/projectTaskTypes";
import { useParams } from "next/navigation"; // Import useParams from next/navigation

const ProjectPage: React.FC = () => {
  // Use useParams to get the project_id from the URL
  const { project_id } = useParams();

  useAuthCheck(["employee", "intern", "company_admin"]);

  const dispatch = useDispatch<AppDispatch>();

  // State definitions for pagination, sorting, and tasks
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);
  const [sort, setSort] = useState<string>("project_id");
  const [order, setOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch tasks based on the current pagination and sorting parameters
  const fetchData = async (params: Record<string, unknown>) => {
    try {
      const response = await dispatch(fetchProjectTasks({ params })).unwrap() as PaginatedProjectTaskResponse;
      if (response?.data) {
        const newTasks = response.data;
        console.log(newTasks);

        // Check if fetched tasks are already in the current state
        const isSameAsCurrent = newTasks.every((newTask) =>
          tasks.some((currentTask) => currentTask.project_task_id === newTask.project_task_id)
        );

        // Update task list and manage pagination state
        if (!isSameAsCurrent) {
          setTasks([...tasks, ...newTasks]);
          setHasMore(newTasks.length > 0);
        } else {
          setHasMore(false);
        }
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setTasks([]);
    }
  };

  useEffect(() => {
    // Early exit if project_id is not available
    if (!project_id) {
      return;
    }

    const loadData = async () => {
      await fetchData({
        projectId: project_id,
        page: currentPage,
        perPage: itemsPerPage,
        sort,
        order,
        search: searchTerm,
      });
    };

    loadData();
  }, [currentPage, itemsPerPage, sort, order, searchTerm, project_id]);

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData("taskId", taskId.toString());
  };

  // Handle drop and update the task's progress
  const handleDrop = (e: React.DragEvent, newProgress: ProjectTaskProgress) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData("taskId"));
    
    // Update task progress
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.project_task_id === taskId) {
          setHasChanges(true);
          return { ...task, project_task_progress: newProgress };
        }
        return task;
      })
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getBorderColor = (priority: ProjectTaskPriorityLevel) => {
    switch (priority) {
      case ProjectTaskPriorityLevel.Low:
        return "border-green-400";
      case ProjectTaskPriorityLevel.Medium:
        return "border-yellow-400";
      case ProjectTaskPriorityLevel.High:
        return "border-red-400";
      default:
        return "";
    }
  };

  const saveTasks = () => {
    localStorage.setItem("kanban-tasks", JSON.stringify(tasks));
    alert("Tasks saved!");
    setHasChanges(false);
  };

  const resetTasks = async () => {
    setTasks([]);
    await fetchData({ projectId: project_id, page: 1, perPage: itemsPerPage, sort, order, search: searchTerm });
    setHasChanges(false);
    alert("Tasks have been reset to the latest fetched data!");
  };

  return (
    <SidebarLayout>
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Projects</h1>

      <div className="flex flex-col justify-between h-full">
        {hasChanges && (
          <div className="flex justify-between mb-6 px-8 py-4 bg-gray-50 rounded-md shadow-md">
            <button onClick={resetTasks} className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all">
              Reset
            </button>
            <button onClick={saveTasks} className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all">
              Save
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 py-8 flex-grow bg-gray-100 rounded-md">
          {Object.values(ProjectTaskProgress).map((progress) => {
            const columnTasks = tasks.filter((task) => task.project_task_progress === progress);

            return (
              <div key={progress} className="bg-gray-200 p-6 rounded-xl flex flex-col min-h-[350px] overflow-hidden" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, progress)}>
                <h2 className="text-xl font-semibold text-gray-700 mb-6">{progress}</h2>
                <div className="tasks-container flex-1 overflow-y-auto min-h-[250px]">
                  {columnTasks.map((task) => (
                    <div key={task.project_task_id} className={`task-item bg-white text-gray-800 p-4 rounded-lg mb-4 cursor-pointer border-l-8 ${getBorderColor(task.project_task_priority_level)}`} draggable onDragStart={(e) => handleDragStart(e, task.project_task_id)}>
                      {task.project_task_name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {hasChanges && (
          <div className="flex justify-between mt-6 px-8 py-4 bg-gray-50 rounded-md shadow-md">
            <button onClick={resetTasks} className="bg-gray-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all">
              Reset
            </button>
            <button onClick={saveTasks} className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all">
              Save
            </button>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};

export default ProjectPage;
