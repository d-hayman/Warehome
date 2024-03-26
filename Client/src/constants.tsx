export const HASUSERS_API_URL =
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_HASUSERS_API_URL;
        
export const LOGIN_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_LOGIN_API_URL;
        
export const VALIDATE_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_VALIDATE_API_URL;

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

export const ROLES_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_ROLES_API_URL;

export const PERMISSIONS_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_PERMISSIONS_API_URL;

export const CONTAINERS_API_URL = 
    process.env.NODE_ENV === "test" 
        ? "http://mocked-api-url" 
        : import.meta.env.VITE_CONTAINERS_API_URL;

export const CONTAINER_ITEMS_API_URL = 
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_CONTAINER_ITEMS_API_URL;

export const CATEGORIES_API_URL =
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_CATEGORIES_API_URL;

export const SUBCATEGORIES_API_URL =
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_SUBCATEGORIES_API_URL;

export const ITEMS_API_URL =
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_ITEMS_API_URL;

export const ITEM_CONTAINERS_API_URL = 
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_ITEM_CONTAINERS_API_URL;

export const ITEM_SUBCATEGORIES_API_URL = 
    process.env.NODE_ENV === "test"
        ? "http://mocked-api-url"
        : import.meta.env.VITE_ITEM_SUBCATEGORIES_API_URL

export const VALIDATE_INTERVAL = 
    process.env.NODE_ENV === "test"
        ? 20
        : import.meta.env.VITE_VALIDATE_INTERVAL;