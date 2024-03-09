/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ITEMS_API_URL } from "../../constants";
import { objectToQueryString } from "../utils/queryStringHelper";

/**
 * Calls the items API to fetch the specified page of items
 * @param page 
 * @returns 
 */
async function fetchAllItems(page:number = 1, query: string = '', categories: string[] = [], subcategories: string[] = []) {
    const queryString = objectToQueryString({
        page: page,
        q: query,
        category_ids: categories,
        subcategory_ids: subcategories
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

export {fetchAllItems};