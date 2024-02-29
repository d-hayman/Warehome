/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { HASUSERS_API_URL } from "../../constants";

/**
 * Calls the hasUsers util API to determine if we need to redirect to initial user setup
 * @returns 
 */
async function hasUsers() {
    const response = await fetch(`${HASUSERS_API_URL}`);

    if(!response.ok){
        throw new Error(response.statusText);
    }

    const result = await response.json();

    return result.hasUsers as boolean;
}

export { hasUsers }