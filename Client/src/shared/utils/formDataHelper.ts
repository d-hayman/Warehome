/**
 * Copyright Deanin 2023 https://www.youtube.com/watch?v=CfcF8Sd6inA
 */

/**
 * Converts a js object to formatted formdata
 * @param obj the object to convert
 * @param namespace parent object in form data where applicable
 * @param formData formdata object to populate
 * @returns Complete form data
 */
export function objectToFormData(
    obj: any,
    namespace: string = '',
    formData: FormData = new FormData()
) : FormData {
    for (let propertyName in obj) {
        if (isValidProperty(obj, propertyName)) {
            const formKey = getFormKey(namespace, propertyName);
            appendToFormData(formData, formKey, obj[propertyName]);
        }
    }
    return formData;
}

/**
 * Parses form data and returns a plain js object
 * @param formData form data to convert
 * @returns the object extracted from the data
 */
export function formDataToObject(formData: FormData): any {
    const obj:any = {};
    for (let key of formData.keys()) {
        obj[key] = formData.get(key);
    }
    return obj;
}

/**
 * Ensures that the object property being included in the data is worth mentioning
 * @param obj object whose property must be checked
 * @param propertyName name of the property to check
 * @returns true if the property is valid, otherwise false
 */
export function isValidProperty(obj: any, propertyName: string) {
    return (
        Object.prototype.hasOwnProperty.call(obj, propertyName) &&
        obj[propertyName] !== undefined && 
        obj[propertyName] !== null &&
        obj[propertyName] !== ''
    );
}

/**
 * get the formdata key string based on property name and namespace
 * @param namespace where applicable
 * @param propertyName property name for the form data key
 * @returns a properly formatted key for form data
 */
function getFormKey(namespace: string, propertyName: string){
    return namespace ? `${namespace}[${propertyName}]` : propertyName;
}

/**
 * Insert another kvp into the form data depending on the type of the value
 * @param formData form data to populate
 * @param formKey key to set in the form data
 * @param value value to set on the specified key in the form data
 */
function appendToFormData(formData: FormData, formKey: string, value: any) {
    if(value instanceof Date){
        appendAsDate(formData, formKey, value);
    } else if (isObjectButNotFile(value)){
        objectToFormData(value, formKey, formData);
    } else{
        formData.append(formKey, value);
    }
}

/**
 * Appends the form data value as a formatted string if the value is a date
 * @param formData form data to populate
 * @param formKey key to set on the form data
 * @param value date to set on the specified key within the form data
 */
function appendAsDate(formData: FormData, formKey: string, value: Date) {
    formData.append(formKey, value.toISOString());
}

/**
 * Tests if a variable is an object, but not a file object
 * @param value variable to test
 * @returns true if this should be handled as an object, false if it should be appended to the form data as-is
 */
function isObjectButNotFile(value: any) {
    return typeof value === 'object' && !(value instanceof File);
}

