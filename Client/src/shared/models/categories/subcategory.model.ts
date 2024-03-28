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
     * Used by left nav selection and dashboard chips
     */
    categoryName: string = "";
    /**
     * 
     * @param dataset 
     * @returns 
     */
    public static buildSubcategoryData(dataset:any, categoryName:string = ""):SubcategoryModel {
        const subcategory = new SubcategoryModel();
        subcategory.id = dataset.id ?? '';
        subcategory.name = dataset.name ?? '';
        subcategory.description = dataset.description ?? '';

        if(categoryName){
            subcategory.categoryName = categoryName;
        }
        return subcategory;
    }

    /**
     * Condense the subcategory array data to an object for the URL
     * @param subcategories 
     * @returns compressed object for base64 encoding
     */
    public static getSubcategoriesMapping (subcategories:SubcategoryModel[]) {
        if(subcategories.length == 0)
            return undefined;
        const mapping:any = {};
        subcategories.forEach((subcategory) => {
          mapping[subcategory.id] = subcategory.name;
        });
        return btoa(JSON.stringify(mapping));
    };

    /**
     * Gets IDs from the URL for the benefit of leftnav and labels for the benefit of dashboard
     * @returns 
     */
    public static getSubcategoriesFromMapping (encodedParams:string|null):SubcategoryModel[] {
        // check the encoded parameter
        if(!encodedParams){
        return [];
        }
    
        // parse the parameter and get selected subcategory data
        // Category name doesn't need to be set because it should already be baked in to the subcategory name
        // this is done for the dashboard chips and the selection logic in leftnav goes by ID
        const subcategoriesMapping = JSON.parse(atob(encodedParams));
        const subs:SubcategoryModel[] = [];
        for (let key in subcategoriesMapping) {
        subs.push(SubcategoryModel.buildSubcategoryData({id:key, name:subcategoriesMapping[key]}));
        }
        return subs;
    };
}

export {SubcategoryModel};
