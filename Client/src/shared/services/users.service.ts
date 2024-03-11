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

async function createUser(username: string, email: string, password: string, passwordConfirmation: string) {
    
    const response = await fetch(`${USERS_API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: {
                username: username,
                email: email,
                password: password,
                password_confirmation:passwordConfirmation
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

export {fetchAllUsers, fetchUser, createUser};