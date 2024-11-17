"use client";
import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import { useParams } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { fetchProjectTasks, createProjectTask } from "@/store/projectTaskSlice";
import {
  ProjectTask,
  ProjectTaskPriorityLevel,
  ProjectTaskProgress,
  PaginatedProjectTaskResponse,
} from "@/types/projectTaskTypes";
import { AppDispatch } from "@/store/store";
import Button from "@/components/Button";
import { useForm, Controller } from "react-hook-form";
import Dialog from "@/components/Dialog";
import InputField from "@/components/InputField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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

  // Fetch tasks based on the current pagination and sorting parameters
  const fetchData = async (params: Record<string, unknown>) => {
    try {
      const response = await dispatch(fetchProjectTasks({ params })).unwrap() as PaginatedProjectTaskResponse;
      if (response?.data) {
        const newTasks = response.data;

        // Check if fetched tasks are already in the current state
        const isSameAsCurrent = newTasks.every((newTask) =>
          tasks.some((currentTask) => currentTask.project_task_id === newTask.project_task_id)
        );

        // Update task list and manage pagination state
        if (!isSameAsCurrent) {
          setTasks([...tasks, ...newTasks]);
        } else {
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

  // Header Component
  const Header: React.FC = () => (
    <div className="mb-8">
      <Link href="/projects" className="flex items-center hover:underline">
        <IoIosArrowRoundBack size={32} />
        <span className="text-xl">Back to Projects page</span>
      </Link>
    </div>
  );

  // Form validation schema using Yup
  const validationSchema = yup.object({
    project_task_name: yup.string().required("Task name is required").max(255, "Maximum length is 255 characters"),
    project_task_description: yup.string().required("Task description is required").max(500, "Maximum length is 500 characters"),
    project_task_progress: yup.string().oneOf(["Not started", "In progress", "Reviewing", "Completed", "Backlog"], "Invalid progress option"),
    project_task_priority_level: yup.string().oneOf(["Low", "Medium", "High"], "Invalid priority level"),
  });

  interface TaskFormValues {
    project_task_name: string;
    project_task_description: string;
    project_task_progress: string;
    project_task_priority_level: string;
  }

  const AddTaskButton: React.FC = () => {
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state for API call
  
    // React Hook Form setup
    const { handleSubmit, control, reset, formState: { errors } } = useForm<TaskFormValues>({
      defaultValues: {
        project_task_name: "",
        project_task_description: "",
        project_task_progress: "Not started",
        project_task_priority_level: "Medium",
      },
      resolver: yupResolver(validationSchema),
    });
  
    // Handle form submission
    const onSubmit = async (data: TaskFormValues) => {
      setIsLoading(true); // Show loading spinner while API request is in progress
  
      try {
        await dispatch(createProjectTask({ projectId: project_id, data }));
        setIsDialogOpen(false);
        setTasks([]);
        await fetchData({ projectId: project_id, page: 1, perPage: itemsPerPage, sort, order, search: searchTerm });
        reset(); // Reset form after submission
      } catch (error) {
        // Handle error case (you can set some error state or show a notification)
        console.error("Error creating task:", error);
      } finally {
        setIsLoading(false); // Stop loading spinner
      }
    };
  
    return (
      <>
        <Button
          type="button"
          label="Add Task"
          onClick={() => setIsDialogOpen(true)}
          size="lg"
          variant="primary"
          className="mb-8"
        />
  
        <Dialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          title="Add New Task"
          className="w-1/2"
          showCloseButton
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Task Name Field */}
            <Controller
              name="project_task_name"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Task Name"
                  id="project_task_name"
                  placeholder="Enter task name"
                  {...field}
                  error={errors.project_task_name?.message}
                />
              )}
            />
  
            {/* Task Description Field */}
            <Controller
              name="project_task_description"
              control={control}
              render={({ field }) => (
                <InputField
                  label="Task Description"
                  id="project_task_description"
                  placeholder="Enter task description"
                  {...field}
                  error={errors.project_task_description?.message}
                />
              )}
            />
  
            {/* Task Progress Dropdown */}
            <div>
              <label htmlFor="project_task_progress">
                Task Progress
              </label>
              <Controller
                name="project_task_progress"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="project_task_progress"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Not started">Not started</option>
                    <option value="In progress">In progress</option>
                    <option value="Reviewing">Reviewing</option>
                    <option value="Completed">Completed</option>
                    <option value="Backlog">Backlog</option>
                  </select>
                )}
              />
              <p className="text-red-500 text-sm mt-1">{errors.project_task_progress?.message}</p>
            </div>
  
            {/* Task Priority Level Dropdown */}
            <div>
              <label htmlFor="project_task_priority_level">
                Priority Level
              </label>
              <Controller
                name="project_task_priority_level"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="project_task_priority_level"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                )}
              />
              <p className="text-red-500 text-sm mt-1">{errors.project_task_priority_level?.message}</p>
            </div>
  
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                label="Cancel"
                onClick={() => setIsDialogOpen(false)}
                variant="secondary"
              />
              <Button
                type="submit"
                label={isLoading ? "Creating..." : "Create Task"}
                variant="primary"
                disabled={isLoading}
              />
            </div>
          </form>
        </Dialog>
      </>
    );
  };

  // Task Column Component
  const TaskColumn: React.FC<{ progress: ProjectTaskProgress }> = ({
    progress,
  }) => {
    const columnTasks = tasks.filter(
      (task) => task.project_task_progress === progress
    );

    return (
      <div
        className="bg-gray-200 p-6 rounded-xl flex flex-col min-h-[350px] overflow-hidden"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, progress)}
      >
        <h2 className="text-xl font-semibold text-gray-700 mb-6">{progress}</h2>
        <div className="tasks-container flex-1 overflow-y-auto min-h-[250px]">
          {columnTasks.map((task) => (
            <div
              key={task.project_task_id}
              className={`task-item bg-white text-gray-800 p-4 rounded-lg mb-4 cursor-pointer border-l-8 ${getBorderColor(
                task.project_task_priority_level
              )}`}
              draggable
              onDragStart={(e) => handleDragStart(e, task.project_task_id)}
            >
              {task.project_task_name}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Kanban Board with Save/Reset
  const KanbanBoard: React.FC = () => (
    <div className="bg-gray-100 p-6 rounded-lg">
      {hasChanges && (
        <div className="flex justify-end mb-4 gap-4">
          <button
            onClick={resetTasks}
            className="bg-gray-600 text-white px-8 py-2 rounded-lg text-lg font-semibold hover:bg-gray-700"
          >
            Reset
          </button>
          <button
            onClick={saveTasks}
            className="bg-blue-600 text-white px-8 py-2 rounded-lg text-lg font-semibold hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.values(ProjectTaskProgress).map((progress) => (
          <TaskColumn key={progress} progress={progress} />
        ))}
      </div>
    </div>
  );

  return (
    <SidebarLayout>
      <div className="flex justify-between">
        <Header />
        <AddTaskButton />
      </div>
      <KanbanBoard />
    </SidebarLayout>
  );
};

export default ProjectPage;
