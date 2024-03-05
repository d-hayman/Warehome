/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { CONTAINERS_API_URL } from "../../constants";

/**
 * Calls the containers API to fetch either all top level containers or all containers within a specified parent container
 * @param parent id of parent container
 * @returns json response
 */
async function fetchAllContainers(parent: string = '') {
    const token = localStorage.getItem("token")??'';
    const response = await fetch(`${CONTAINERS_API_URL}${parent&&`?parent=${parent}`}`, {
        headers: {
            "Authorization": token
        }
    });

    if(!response.ok){
        throw new Error(response.statusText);
    }

    return response.json();
}

export {fetchAllContainers}