export interface Project {
    project_id: number;
    project_name: string;
    project_description: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface PaginatedProjectResponse {
    data: Project[];
    current_page: number;
    last_page: number;
    total: number;
}
