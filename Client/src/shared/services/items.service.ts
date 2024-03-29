/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ITEMS_API_URL, ITEM_CONTAINERS_API_URL, ITEM_SUBCATEGORIES_API_URL } from "../../constants";
import { ItemModel } from "../models/item.model";
import { objectToFormData } from "../utils/formDataHelper";
import { objectToQueryString } from "../utils/queryStringHelper";
import { hasJson } from "../utils/responseHelpers";

/**
 * Calls the items API to fetch the specified page of items
 * @param page 
 * @returns 
 */
async function fetchAllItems(page:number = 1, query: string = '', categories: string[] = [], subcategories: string[] = [], orderBy: string = '') {
    const queryString = objectToQueryString({
        page: page,
        q: query,
        category_ids: categories,
        subcategory_ids: subcategories,
        order_by: orderBy
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

/**
 * Calls the API to fetch item containers
 * @param itemId 
 * @returns 
 */
async function fetchAllItemContainers(itemId:string|undefined) {
    if(!itemId) {
        console.error("Tried to fetch containers with no item id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEM_CONTAINERS_API_URL}`.replace(':itemId', itemId), {
        headers: {
            "Authorization": token,
        },
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}

/**
 * Calls the API to fetch an item container
 * @param itemId 
 * @param containerId
 * @returns 
 */
async function fetchItemContainer(itemId:string|undefined,containerId:string|undefined) {
    if(!itemId) {
        console.error("Tried to fetch container with no item id?");
        return;
    }

    if(!containerId) {
        console.error("Tried to fetch container with no container id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEM_CONTAINERS_API_URL}/${containerId}`.replace(':itemId', itemId), {
        headers: {
            "Authorization": token,
        },
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}

/**
 * Calls the API to add a subcategory to an item
 * @param itemId 
 * @param id 
 * @returns 
 */
async function itemAddSubcategory(itemId:string|undefined, id:string|undefined) {
    if(!itemId) {
        console.error("Tried to add subcategory with no item id?");
        return;
    }

    if(!id) {
        console.error("Tried to add subcategory with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEM_SUBCATEGORIES_API_URL}/${id}`.replace(':itemId', itemId), {
        method: "PUT",
        headers: {
            "Authorization": token
        },
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

/**
 * Calls the API to remove a subcategory from an item
 * @param itemId 
 * @param id 
 * @returns 
 */
async function itemRemoveSubcategory(itemId:string|undefined, id:string|undefined) {
    if(!itemId) {
        console.error("Tried to remove subcategory with no item id?");
        return;
    }

    if(!id) {
        console.error("Tried to remove subcategory with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${ITEM_SUBCATEGORIES_API_URL}/${id}`.replace(':itemId', itemId), {
        method: "DELETE",
        headers: {
            "Authorization": token,
        },
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

export {
    fetchAllItems, 
    fetchItem, 
    createItem, 
    updateItem, 
    deleteItem, 
    
    fetchAllItemContainers, 
    fetchItemContainer,

    itemAddSubcategory,
    itemRemoveSubcategory
};