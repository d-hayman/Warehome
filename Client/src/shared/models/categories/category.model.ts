/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing category records
 */
class CategoryModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * category name
     */
    name:string = '';
    /**
     * category description
     */
    description:string = '';
    /**
     * 
     * @param dataset 
     * @returns 
     */
    public static buildCategoryData(dataset:any):CategoryModel {
        const category = new CategoryModel();
        category.id = dataset.id ?? '';
        category.name = dataset.name ?? '';
        category.description = dataset.description ?? '';
        return category;
    }
}

export {CategoryModel};