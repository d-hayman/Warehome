/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing permission records
 */
class PermissionModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * permission affected model
     */
    model:string = '';
    /**
     * permission action
     */
    action:string = '';

    /**
     * Parse response data to create a permission model object
     * @param dataset raw response data
     * @returns The permission as a strongly typed object, extracted from the response data
     */
    public static buildPermissionData(dataset:any):PermissionModel {
        const permission = new PermissionModel();
        permission.id = dataset.id ?? '';
        permission.model = dataset.model ?? '';
        permission.action = dataset.action ?? '';
        return permission;
    }
}

export {PermissionModel}