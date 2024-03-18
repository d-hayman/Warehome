/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { LOGIN_API_URL, SIGNUP_API_URL, LOGOUT_API_URL, VALIDATE_API_URL } from "../../constants";
import { hasJson } from "../utils/responseHelpers";

/**
 * Calls the login API
 * @param username 
 * @param password 
 * @returns success or failure
 */
async function login(username: string, password: string) {
    const response = await fetch(`${LOGIN_API_URL}`, {
       method:  "POST",
       headers: {
        "Content-Type": "application/json",
       },
       body : JSON.stringify({user:{username: username, password: password}}),
    });

    if (!response.ok) {
        return false;
    }

    const res = await response.json();
    localStorage.setItem("userId", res.status.data.user.id);
    localStorage.setItem("token", response.headers.get("Authorization")??'');
    localStorage.setItem("permissions", res.status.data.user.permissions);
    localStorage.setItem("loggedInAs", username);

    return true;
}

/**
 * Calls the validate API
 */
async function validate() {
    const token = localStorage.getItem("token")??'';
    const response = await fetch(`${VALIDATE_API_URL}`, {
        headers: {
            "Authorization": token
        }
    });

    if (!response.ok) {
        return false;
    }

    // update the auth token
    localStorage.setItem("token", response.headers.get("Authorization")??'');

    return true;
}

/**
 * Calls the signup API
 * @param username 
 * @param password 
 * @returns response if the status is ok or there is a JSON error to display
 */
async function signup(username: string, password: string, confirmPassword: string) {
    const response = await fetch(`${SIGNUP_API_URL}`, {
       method:  "POST",
       headers: {
        "Content-Type": "application/json",
       },
       body : JSON.stringify({user:{username: username, password: password, password_confirmation:confirmPassword}}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the logout API
 */
async function logout() {
    const token = localStorage.getItem("token")??'';
    const response = await fetch(`${LOGOUT_API_URL}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    });

    localStorage.clear();

    if (!response.ok) {
        return false;
    }

    return true;
}

export { login, validate, signup, logout };