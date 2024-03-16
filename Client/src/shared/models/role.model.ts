/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { PermissionModel } from "./permission.model";
import { UserModel } from "./user.model";

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
     * Permission List
     */
    permissions:PermissionModel[] = [];
    /**
     * User List
     */
    users:UserModel[] = [];

    /**
     * Parse response data to create a role model object
     * @param dataset raw response data
     * @returns The role as a strongly typed object, extracted from the response data
     */
    public static buildRoleData(dataset:any):RoleModel {
        const role = new RoleModel();
        role.id = dataset.id ?? '';
        role.name = dataset.name ?? '';

        if(dataset.permissions !== undefined && Array.isArray(dataset.permissions)){
            for(const permission of dataset.permissions){
                role.permissions.push(PermissionModel.buildPermissionData(permission));
            }
        }

        if(dataset.users !== undefined && Array.isArray(dataset.users)){
            for(const user of dataset.users){
                role.users.push(UserModel.buildUserData(user));
            }
        }

        return role;
    }

}

export {RoleModel}