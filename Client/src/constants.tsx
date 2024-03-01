export const HASUSERS_API_URL =
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_HASUSERS_API_URL;
        
export const LOGIN_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_LOGIN_API_URL;

export const SIGNUP_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_SIGNUP_API_URL;

export const LOGOUT_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_LOGOUT_API_URL;

export const USERS_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_USERS_API_URL;

export const PERMISSIONS_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_PERMISSIONS_API_URL;