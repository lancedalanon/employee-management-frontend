/**
 * Dtr interface representing the Leave Request data structure.
 */
export interface LeaveRequest {
    dtr_id: string; 
    dtr_absence_date: string; 
    dtr_absence_reason: string; 
    dtr_absence_approved_at: string;
}

/**
 * Interface representing the paginated Leave Request data structure.
 */
export interface PaginatedLeaveRequestResponse {
    current_page: number;
    data: LeaveRequest[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
