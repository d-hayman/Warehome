/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing item records
 */
class ItemModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * item description
     */
    description:string = '';
    /**
     * item notes
     */
    notes:string = '';
    /**
     * item image url from response data
     */
    image_url:string = '';

    /**
     * Selected file populated in the form data when saving the item
     */
    image:File | undefined | null = null;

    /**
     * Parse response data to create a item model object
     * @param dataset raw response data
     * @returns The item as a strongly typed object, extracted from the response data
     */
    public static buildItemData(dataset:any):ItemModel {
        const item = new ItemModel();
        item.id = dataset.id ?? '';
        item.description = dataset.description ?? '';
        item.notes = dataset.notes ?? '';
        item.image_url = dataset.image_url ?? '';
        return item;
    }

}

export {ItemModel}