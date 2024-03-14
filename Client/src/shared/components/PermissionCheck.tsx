/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import PropTypes, {InferProps} from "prop-types";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * @param permission Permission model:action required to proceed
 * @param routeTo the path to route back to
 */
const permissionCheckPropTypes = {
    permission: PropTypes.string.isRequired,
    routeTo: PropTypes.string
};

type permissionCheckTypes = InferProps<typeof permissionCheckPropTypes>;

/**
 * Route element wrapper to protect a set of routes behind a permission check
 * @param param0 
 * @returns 
 */
function PermissionCheck ({permission, routeTo="/"}:permissionCheckTypes) {
    const hasPermission = (localStorage.getItem("permissions")??'').includes(permission);

    const navigate = useNavigate();

    useEffect(()=>{
        if(!hasPermission)
            navigate(routeTo??'/');
    },[]);

    return(<Outlet/>)
}

export default PermissionCheck