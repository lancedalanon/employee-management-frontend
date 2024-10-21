/**
 * Utility for managing cookies in a web application.
 */
class CookieUtils {
    /**
     * Sets a cookie with the specified name, value, and options.
     * @param name - The name of the cookie.
     * @param value - The value of the cookie.
     * @param options - Additional options for the cookie (e.g., expires, path, domain, secure).
     */
    static setCookie<T>(name: string, value: string | T[], options?: CookieOptions): void {
        // Convert array to JSON string if value is an array
        const valueString = Array.isArray(value) ? JSON.stringify(value) : String(value);
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(valueString)}`;

        if (options) {
            if (options.expires) {
                cookieString += `; expires=${options.expires.toUTCString()}`;
            }
            if (options.path) {
                cookieString += `; path=${options.path}`;
            }
            if (options.domain) {
                cookieString += `; domain=${options.domain}`;
            }
            if (options.secure) {
                cookieString += '; secure';
            }
            if (options.sameSite) {
                cookieString += `; SameSite=${options.sameSite}`;
            }
        }

        document.cookie = cookieString;
    }

    /**
     * Gets the value of a cookie by its name.
     * @param name - The name of the cookie to retrieve.
     * @returns The value of the cookie, or null if not found.
     */
    static getCookie(name: string): string | null {
        const cookieArr = document.cookie.split(';');

        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].trim().split('=');
            if (cookiePair[0] === encodeURIComponent(name)) {
                return decodeURIComponent(cookiePair[1]);
            }
        }

        return null; // Return null if the cookie is not found
    }

    /**
     * Deletes a cookie by its name.
     * @param name - The name of the cookie to delete.
     * @param options - Options for deleting the cookie (e.g., path, domain).
     */
    static deleteCookie(name: string, options?: CookieOptions): void {
        this.setCookie(name, '', {
            ...options,
            expires: new Date(0), // Set the expiry date to the past
        });
    }
}

/**
 * Options for setting/deleting cookies.
 */
interface CookieOptions {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
}

export default CookieUtils;
