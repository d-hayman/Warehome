/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ROLES_API_URL } from "../../constants";
import { RoleModel } from "../models/role.model";
import { hasJson } from "../utils/responseHelpers";

/**
 * Calls the roles API to fetch all roles
 * @returns json response
 */
async function fetchAllRoles() {
    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ROLES_API_URL}`, {
        headers: {
            "Authorization": token
        }
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}

/**
 * Calls the roles API to fetch the requested role
 * @param id ID of the role to fetch
 * @returns json response
 */
async function fetchRole(id:string|undefined){
    if(!id) {
        console.error("Tried to fetch role without id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ROLES_API_URL}/${id}`, {
        headers: {
            "Authorization": token
        }
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}

/**
 * Calls the API to create a new role
 * @param role 
 */
async function createRole(role:RoleModel, userIds:string[], permissionIds:string[]) {
    if(!role) {
        console.error("Tried to submit role with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ROLES_API_URL}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role: {
                name: role.name,
                user_ids: userIds,
                permission_ids: permissionIds
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to edit a role
 * @param id 
 * @param role 
 */
async function updateRole(id:string|undefined, role:RoleModel, userIds:string[], permissionIds:string[]) {
    if(!id) {
        console.error("Tried to edit role with no id?");
        return;
    }

    if(!role) {
        console.error("Tried to edit role with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ROLES_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            role: {
                name: role.name,
                user_ids: userIds,
                permission_ids: permissionIds
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to delete a role
 * @param id 
 */
async function deleteRole(id:string|undefined) {
    if(!id) {
        console.error("Tried to delete role with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ROLES_API_URL}/${id}`, {
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

export {
    fetchAllRoles, 
    fetchRole, 
    createRole, 
    updateRole, 
    deleteRole
};