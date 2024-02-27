export const USERS_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_USERS_API_URL;

export const PERMISSIONS_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_PERMISSIONS_API_URL;