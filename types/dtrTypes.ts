/**
 * Dtr interface representing the DTR data structure.
 */
export interface Dtr {
    dtr_id: string;
    dtr_time_in: string;
    dtr_time_out: string;
    dtr_end_of_the_day_report: string | null;
    dtr_is_overtime: number;
}

/**
 * Interface representing the paginated DTR data structure.
 */
export interface PaginatedDtrResponse {
    current_page: number;
    data: Dtr[];
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
