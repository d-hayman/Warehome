/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { USERS_API_URL } from "../../constants";
import { hasJson } from "../utils/responseHelpers";

/**
 * Calls the users API to fetch users data
 * @param page 
 * @param perPage 
 * @returns 
 */
async function fetchAllUsers(page:number = 1, perPage:number = 5) {

    const token = localStorage.getItem("token")??'';

    const response = await fetch(`${USERS_API_URL}?page=${page}&per_page=${perPage}`, {
        headers: {
            "Authorization": token,
        },
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}

async function fetchUser(id:string|undefined) {
    if(id === undefined){
        console.error("Tried to get user without ID?");
        return;
    }

    if(id === ''){
        console.error("Tried to get user without ID?");
        return;
    }

    const token = localStorage.getItem("token")??'';

    const response = await fetch(`${USERS_API_URL}/${id}`, {
        headers: {
            "Authorization": token,
        },
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
}

/**
 * Calls the create user API
 * @param username unique username for the user
 * @param password 6 characters or longer user password
 * @param passwordConfirmation confirmation string to ensure the password wasn't typed incorrectly
 * @returns 
 */
async function createUser(username: string, password: string, passwordConfirmation: string) {
    
    const token = localStorage.getItem("token")??'';
    
    const response = await fetch(`${USERS_API_URL}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: {
                username: username,
                password: password,
                password_confirmation:passwordConfirmation
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the update user API
 * @param username unique username for the user
 * @param password 6 characters or longer user password
 * @param passwordConfirmation confirmation string to ensure the password wasn't typed incorrectly
 * @returns 
 */
async function updateUser(id:string, username: string, password: string, passwordConfirmation: string) {
    if(!id){
        console.error("Tried to update user without ID?");
        return;
    }

    const token = localStorage.getItem("token")??'';
    
    const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: {
                username: username,
                password: password,
                password_confirmation:passwordConfirmation
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to delete a user
 * @param categoryId
 * @param id 
 */
async function deleteUser(id:string|undefined) {
    if(!id) {
        console.error("Tried to delete user with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${USERS_API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    });

    if(response.status === 204) {
        return null;
    }

    throw new Error(response.statusText);
}

export {fetchAllUsers, fetchUser, createUser, updateUser, deleteUser};