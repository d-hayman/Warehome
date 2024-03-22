/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ContainerModel } from "./container.model";
import { ItemModel } from "./item.model";

/**
 * Class for representing containment records
 */
class ContainmentModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    itemId:string = '';
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    containerId:string = '';
    /**
     * quantity of item in container
     */
    quantity:number = 0;
    /**
     * position of item in container
     */
    position:string = '';
    /**
     * Item (populated if fetched relative to container)
     */
    item:ItemModel|undefined = undefined;
    /**
     * Container (populated if fetched relative to item)
     */
    container:ContainerModel|undefined = undefined;

    /**
     * Parse response data to create a containment model object
     * @param dataset raw response data
     * @returns The containment as a strongly typed object, extracted from the response data
     */
    public static buildContainmentData(dataset:any):ContainmentModel {
        const cont = new ContainmentModel();
        cont.itemId = dataset.item_id ?? '';
        cont.containerId = dataset.container_id ?? '';

        if(dataset.item !== undefined && typeof dataset.item === 'object'){
            cont.item = ItemModel.buildItemData(dataset.item);
        }

        if(dataset.container !== undefined && typeof dataset.container === 'object'){
            cont.container = ContainerModel.buildContainerData(dataset.container);
        }

        return cont;
    }

}

export {ContainmentModel}