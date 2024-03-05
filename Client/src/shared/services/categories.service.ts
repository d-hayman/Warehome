/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { CATEGORIES_API_URL, SUBCATEGORIES_API_URL } from "../../constants";

/**
 * Calls the categories API to fetch all top level categories
 * @returns json response
 */
async function fetchAllCategories() {
    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CATEGORIES_API_URL}`, {
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
 * Calls the subcategories API to fetch all subcategories for a given category
 * @param categoryId the ID of the parent category
 * @returns json response
 */
async function fetchAllSubcategories(categoryId:string) {
    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${SUBCATEGORIES_API_URL}`.replace(':categoryId', categoryId), {
        headers: {
            "Authorization": token
        }
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}

export {fetchAllCategories, fetchAllSubcategories};