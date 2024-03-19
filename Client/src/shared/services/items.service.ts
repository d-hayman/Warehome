/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ITEMS_API_URL } from "../../constants";
import { ItemModel } from "../models/item.model";
import { objectToFormData } from "../utils/formDataHelper";
import { objectToQueryString } from "../utils/queryStringHelper";
import { hasJson } from "../utils/responseHelpers";

/**
 * Calls the items API to fetch the specified page of items
 * @param page 
 * @returns 
 */
async function fetchAllItems(page:number = 1, query: string = '', categories: string[] = [], subcategories: string[] = []) {
    const queryString = objectToQueryString({
        page: page,
        q: query,
        item_ids: categories,
        subitem_ids: subcategories
    })
    const token = localStorage.getItem("token") ?? '';
    const response = await fetch(`${ITEMS_API_URL}${queryString}`, {
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
 * Calls the items API to fetch the specified item
 * @param id ID of the item to fetch 
 * @returns json response
 */
async function fetchItem(id:string|undefined) {
    if(!id) {
        console.error("Tried to fetch item without ID?");
        return;
    }

    const token = localStorage.getItem("token") ?? '';
    const response = await fetch(`${ITEMS_API_URL}/${id}`, {
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
 * Calls the API to create a new item
 * @param item 
 */
async function createItem(item:ItemModel) {
    if(!item) {
        console.error("Tried to submit item with no data?");
        return;
    }

    // convert the item to formdata for all revelevant fields
    const formData = objectToFormData({
        item: {
            description: item.description,
            notes: item.notes,
            image: item.image
        }
    });

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEMS_API_URL}`, {
        method: "POST",
        headers: {
            "Authorization": token,
        },
        body: formData,
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to edit a item
 * @param id 
 * @param item 
 */
async function updateItem(id:string|undefined, item:ItemModel) {
    if(!id) {
        console.error("Tried to edit item with no id?");
        return;
    }

    if(!item) {
        console.error("Tried to edit item with no data?");
        return;
    }

    // convert the item to formdata for all revelevant fields
    const formData = objectToFormData({
        item: {
            description: item.description,
            notes: item.notes,
            image: item.image
        }
    });

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEMS_API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": token,
        },
        body: formData,
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to delete a item
 * @param id 
 */
async function deleteItem(id:string|undefined) {
    if(!id) {
        console.error("Tried to delete item with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEMS_API_URL}/${id}`, {
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

export {fetchAllItems, fetchItem, createItem, updateItem, deleteItem};