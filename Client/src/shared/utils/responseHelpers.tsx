/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { isValidProperty } from "./formDataHelper";

/**
 * Determine if a response contains json in the body
 * @param response response to test
 * @returns true if json is detected
 */
export function hasJson(response: Response) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return true;
    }
    return false;
}

/**
 * Convert json to nested uls for displaying in an error alert - place inside of a ul
 * @param json 
 */
export function listifyErrors(json: any) {
    return (
        <>
        { 
            (Object.keys(json)).map((key) =>{
                if (!isValidProperty(json, key))
                    return (<></>);
                return(appendMarkup(key, json[key]))
            })
        }
        </>
    )
}

/**
 * 
 * @param formData 
 * @param formKey 
 * @param value 
 */
function appendMarkup(propertyName: string, value: any) {
    if(Array.isArray(value)){
        return appendAsArray(propertyName, value);
    } else if (typeof value === 'object'){
        return(
            <li>
                {listifyErrors(value)}
            </li>
        )
    } else{
        return (
            <li>
                {propertyName? propertyName + ': ' : ''}{value}
            </li>
        )
    }
}

/**
 * 
 * @param propertyName 
 * @param value 
 * @returns 
 */
function appendAsArray(propertyName: string, value: any){
    return (
        <li>
        {propertyName}
        <ul>
        {
            value.map((v: any) => {
                return(appendMarkup('', v));
            })
        }
        </ul>
        </li>
    )
}