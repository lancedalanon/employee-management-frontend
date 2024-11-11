export enum ProjectTaskProgress {
    NotStarted = 'Not started',
    InProgress = 'In progress',
    Reviewing = 'Reviewing',
    Completed = 'Completed',
    Backlog = 'Backlog',
  }
  
  export enum ProjectTaskPriorityLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
  }
  
  export interface ProjectTask {
    project_task_id: number;
    project_task_name: string;
    project_task_description: string;
    project_id: number;
    project_task_progress: ProjectTaskProgress;
    project_task_priority_level: ProjectTaskPriorityLevel;
    user_id: number;
    created_at: string; 
    updated_at: string;
    deleted_at?: string | null; 
  }
  
  export interface PaginatedProjectTaskResponse {
    data: ProjectTask[];
    current_page: number;
    last_page: number;
    total: number;
  }
  