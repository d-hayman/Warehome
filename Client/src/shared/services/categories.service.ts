/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { CATEGORIES_API_URL, SUBCATEGORIES_API_URL } from "../../constants";
import { CategoryModel } from "../models/categories/category.model";
import { SubcategoryModel } from "../models/categories/subcategory.model";
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
async function updateCategory(id:string|undefined, category:CategoryModel) {
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
 * Calls the API to delete a category
 * @param id 
 */
async function deleteCategory(id:string|undefined) {
    if(!id) {
        console.error("Tried to delete category with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CATEGORIES_API_URL}/${id}`, {
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

/**
 * Calls the subcategories API to fetch all subcategories for a given category
 * @param categoryId the ID of the parent category
 * @returns json response
 */
async function fetchAllSubcategories(categoryId:string|undefined) {
    if(!categoryId) {
        console.error("Tried to fetch subcategories without id?");
        return;
    }

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

/**
 * Calls the API to create a new subcategory
 * @param categoryId
 * @param subcategory 
 */
async function createSubcategory(categoryId:string|undefined, subcategory:SubcategoryModel) {
    if(!categoryId) {
        console.error("Tried to submit subcategory with no category id?");
        return;
    }

    if(!subcategory) {
        console.error("Tried to submit subcategory with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${SUBCATEGORIES_API_URL}`.replace(':categoryId', categoryId), {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subcategory: {
                name: subcategory.name,
                description: subcategory.description
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to edit a subcategory
 * @param id 
 * @param subcategory 
 */
async function updateSubcategory(categoryId:string|undefined, id:string|undefined, subcategory:SubcategoryModel) {
    if(!categoryId) {
        console.error("Tried to submit subcategory with no category id?");
        return;
    }

    if(!id) {
        console.error("Tried to edit subcategory with no id?");
        return;
    }

    if(!subcategory) {
        console.error("Tried to edit subcategory with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${SUBCATEGORIES_API_URL}/${id}`.replace(':categoryId', categoryId), {
        method: "PUT",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            subcategory: {
                name: subcategory.name,
                description: subcategory.description
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to delete a subcategory
 * @param categoryId
 * @param id 
 */
async function deleteSubcategory(categoryId:string|undefined, id:string|undefined) {
    if(!categoryId) {
        console.error("Tried to delete subcategory with no category id?");
        return;
    }

    if(!id) {
        console.error("Tried to delete subcategory with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${SUBCATEGORIES_API_URL}/${id}`.replace(':categoryId', categoryId), {
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
    fetchAllCategories, 
    fetchCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory,

    fetchAllSubcategories, 
    createSubcategory, 
    updateSubcategory, 
    deleteSubcategory
};