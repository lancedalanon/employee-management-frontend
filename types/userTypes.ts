/**
 * User interface representing user data structure.
 */
export interface User {
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    place_of_birth: string;
    date_of_birth: string;
    gender: string;
    username: string;
    email: string;
    recovery_email: string | null;
    phone_number: string;
    emergency_contact_name: string | null;
    emergency_contact_number: string | null;
    full_name: string;
}