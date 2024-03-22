/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { CONTAINERS_API_URL, CONTAINER_ITEMS_API_URL } from "../../constants";
import { ContainerModel } from "../models/container.model";
import { ContainmentModel } from "../models/containment.model";
import { objectToFormData } from "../utils/formDataHelper";
import { hasJson } from "../utils/responseHelpers";

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

/**
 * Calls the containers API to fetch the specified container
 * @param id ID of the container to fetch 
 * @returns json response
 */
async function fetchContainer(id:string|undefined) {
    if(!id) {
        console.error("Tried to fetch container without ID?");
        return;
    }

    const token = localStorage.getItem("token") ?? '';
    const response = await fetch(`${CONTAINERS_API_URL}/${id}`, {
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
 * Calls the API to create a new container
 * @param container 
 */
async function createContainer(container:ContainerModel) {
    if(!container) {
        console.error("Tried to submit container with no data?");
        return;
    }

    // convert the container to formdata for all revelevant fields
    const formData = objectToFormData({
        container: {
            name: container.name,
            description: container.description,
            notes: container.notes,
            parent_id: container.parentId,
            image: container.image
        }
    });

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CONTAINERS_API_URL}`, {
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
 * Calls the API to edit a container
 * @param id 
 * @param container 
 */
async function updateContainer(id:string|undefined, container:ContainerModel) {
    if(!id) {
        console.error("Tried to edit container with no id?");
        return;
    }

    if(!container) {
        console.error("Tried to edit container with no data?");
        return;
    }

    // convert the container to formdata for all revelevant fields
    const formData = objectToFormData({
        container: {
            name: container.name,
            description: container.description,
            notes: container.notes,
            parent_id: container.parentId,
            image: container.image
        }
    });

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CONTAINERS_API_URL}/${id}`, {
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
 * Calls the API to delete a container
 * @param id 
 */
async function deleteContainer(id:string|undefined) {
    if(!id) {
        console.error("Tried to delete container with no id?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CONTAINERS_API_URL}/${id}`, {
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
 * Calls the API to add an item to a container
 * @param containerId 
 * @param id 
 * @param containment 
 * @returns 
 */
async function containerAddItem(containerId:string|undefined, id:string|undefined, containment:ContainmentModel) {
    if(!containerId) {
        console.error("Tried to add item with no container id?");
        return;
    }

    if(!id) {
        console.error("Tried to add item with no id?");
        return;
    }

    if(!containment) {
        console.error("Tried to add item with no data?");
        return;
    }

    const token = localStorage.getItem('token') ?? '';
    const response = await fetch(`${CONTAINER_ITEMS_API_URL}/${id}`.replace(':containerId', containerId), {
        method: "POST",
        headers: {
            "Authorization": token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            containment: {
                quantity: containment.quantity,
                position: containment.position
        }}),
    });

    if (!response.ok && !hasJson(response)) {
        throw new Error(response.statusText);
    }

    return response;
}

export {fetchAllContainers, fetchContainer, createContainer, updateContainer, deleteContainer, containerAddItem}