"use client";
import React, { useState, useEffect } from "react";
import SidebarLayout from "@/components/SidebarLayout";
import useAuthCheck from "@/app/hooks/useAuthCheck";
import { fetchProjects } from "@/store/projectSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Project } from "@/types/projectTypes";
import Link from "next/link"; // Import Link from Next.js

// Project card component for displaying individual projects
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow bg-white">
    <h3 className="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-colors">
      {/* Wrap the title in a Link to make it clickable */}
      <Link href={`/projects/${project.project_id}`}>
        {project.project_name}
      </Link>
    </h3>
    <p className="text-gray-600 mt-2" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
      {project.project_description}
    </p>
    <p className="text-sm text-gray-500 mt-4">
      Created on: {new Date(project.created_at).toLocaleDateString()}
    </p>
  </div>
);

const ProjectPage: React.FC = () => {
  useAuthCheck(["employee", "intern", "company_admin"]);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.project);

  // State for managing projects, pagination, and comparison flag
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [sort, setSort] = useState<string>("project_id");
  const [order, setOrder] = useState<string>("desc");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [hasMore, setHasMore] = useState<boolean>(true); // State to track if there are more projects to load

  // Fetch data function
  const fetchData = async (params: Record<string, unknown>) => {
    try {
      const response = await dispatch(fetchProjects(params)).unwrap();
      if (response && Array.isArray(response.data)) {
        // Compare current projects with the new data
        const newProjects = response.data;

        // Check if the new data has any project already in the current list
        const isSameAsCurrent = newProjects.every((newProject) =>
          projects.some((currentProject) => currentProject.project_id === newProject.project_id)
        );

        if (isSameAsCurrent) {
          setHasMore(false); // No more projects to load
        } else {
          setProjects([...projects, ...newProjects]);
        }
      } else {
        setProjects([]); // In case the response is not in the expected format
      }
      return response;
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]); // Fallback to empty array on error
      throw error;
    }
  };

  // UseEffect to load projects on mount and whenever parameters change
  useEffect(() => {
    const loadData = async () => {
      await fetchData({
        page: currentPage,
        perPage: itemsPerPage,
        sort,
        order,
        search: searchTerm,
      });
    };
    loadData();
  }, [currentPage, itemsPerPage, sort, order, searchTerm]);

  // Load next set of projects
  const handleNextPage = () => {
    if (hasMore && !loading) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <SidebarLayout>
      <h1 className="text-4xl font-semibold text-gray-800 mb-8">Projects</h1>

      {/* Loading, Empty, and Error States */}
      <div className="text-center">
        {loading && <p className="text-gray-600">Loading projects...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {projects.length === 0 && !loading && !error && (
          <p className="text-xl text-gray-500">No projects available.</p>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {projects.map((project) => (
          <ProjectCard key={project.project_id} project={project} />
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center items-center mt-8">
        <button
          onClick={handleNextPage}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading || !hasMore} // Disable the button while loading or when there are no more projects
        >
          {loading ? "Loading more..." : "Load More"}
        </button>
      </div>
    </SidebarLayout>
  );
};

export default ProjectPage;
