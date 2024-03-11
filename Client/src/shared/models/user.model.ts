/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
/**
 * Class for representing user records
 */
class UserModel {
    /**
     * ID, a number, but we treat it as a string since we do no math with it but plenty of concatenation in routing
     */
    id:string = '';
    /**
     * username
     */
    username:string = '';

    /**
     * Parse response data to create a user model object
     * @param dataset raw response data
     * @returns The user as a strongly typed object, extracted from the response data
     */
    public static buildUserData(dataset:any):UserModel {
        const user = new UserModel();
        user.id = dataset.id ?? '';
        user.username = dataset.username ?? '';
        return user;
    }

}

export {UserModel}