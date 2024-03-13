/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing subcategory records
 */
class SubcategoryModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * subcategory name
     */
    name:string = '';
    /**
     * subcategory description
     */
    description:string = '';

    /**
     * Used by the editor page
     */
    dirty: boolean = false;
    /**
     * 
     * @param dataset 
     * @returns 
     */
    public static buildSubcategoryData(dataset:any):SubcategoryModel {
        const subcategory = new SubcategoryModel();
        subcategory.id = dataset.id ?? '';
        subcategory.name = dataset.name ?? '';
        subcategory.description = dataset.description ?? '';
        return subcategory;
    }
}

export {SubcategoryModel};
