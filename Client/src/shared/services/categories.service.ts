/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { CATEGORIES_API_URL, SUBCATEGORIES_API_URL } from "../../constants";
import { CategoryModel } from "../models/categories/category.model";
import { hasJson } from "../utils/responseHelpers";

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
 * Calls the categories API to fetch the requested category
 * @param id ID of the category to fetch
 * @returns json response
 */
async function fetchCategory(id:string|undefined){
    if(!id) {
        console.error("Tried to fetch category without id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
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
 * Calls the API to create a new category
 * @param category 
 */
async function createCategory(category:CategoryModel) {
    if(!category) {
        console.error("Tried to submit category with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CATEGORIES_API_URL}`, {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            category: {
                name: category.name,
                description: category.description
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to edit a category
 * @param id 
 * @param category 
 */
async function editCategory(id:string|undefined, category:CategoryModel) {
    if(!id) {
        console.error("Tried to edit category with no id?");
        return;
    }

    if(!category) {
        console.error("Tried to edit category with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            category: {
                name: category.name,
                description: category.description
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
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

export {fetchAllCategories, fetchCategory, createCategory, editCategory, fetchAllSubcategories};