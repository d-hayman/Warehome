/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

/**
 * Converts a js object to formatted query string
 * @param obj the flat object to convert - this should contain strings, booleans, numbers, and arrays thereof
 * @returns Complete query string
 */
export function objectToQueryString(
    obj: any,
) : string {
    let queryString = '';
    for (let propertyName in obj) {
        if (isValidProperty(obj, propertyName)) {
            queryString = appendToQuery(queryString, propertyName, obj[propertyName]);
        }
    }
    return queryString;
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
 * Gets the character to prepend to the next key
 * @param queryString 
 * @returns 
 */
function getPrepend(queryString: string){
    return queryString ? "&" : "?";
}

/**
 * Insert another kvp into the query depending on the type of the value
 * @param queryString query to populate
 * @param key key to set in the query
 * @param value value to set on the specified key in the query
 */
function appendToQuery(queryString: string, key: string, value: any) {
    if(value instanceof Date){
        queryString = appendAsDate(queryString, key, value);
    } else if (Array.isArray(value)){
        for(const v of value){
            queryString = appendToQuery(queryString, key+"[]", v);
        }
    } else{
        queryString += getPrepend(queryString) + encodeURI(key) + "=" + encodeURI(value);
    }

    return queryString;
}

/**
 * Appends the query value as a formatted string if the value is a date
 * @param queryString query to populate
 * @param key key to set in the query
 * @param value value to set on the specified key in the query
 */
function appendAsDate(queryString: string, key: string, value: Date) {
    return queryString + getPrepend(queryString) + encodeURI(key) + "=" + encodeURI(value.toISOString());
}

