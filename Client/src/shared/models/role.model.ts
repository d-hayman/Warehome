/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing role records
 */
class RoleModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * role name
     */
    name:string = '';

    /**
     * Parse response data to create a role model object
     * @param dataset raw response data
     * @returns The role as a strongly typed object, extracted from the response data
     */
    public static buildRoleData(dataset:any):RoleModel {
        const role = new RoleModel();
        role.id = dataset.id ?? '';
        role.name = dataset.name ?? '';
        return role;
    }

}

export {RoleModel}