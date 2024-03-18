/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import PropTypes, {InferProps} from "prop-types";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { VALIDATE_INTERVAL } from "../constants";
import { logout, validate } from "../shared/services/auth.service";

/**
 * @param routeTo the path to route back to
 */
const permissionCheckPropTypes = {
    routeTo: PropTypes.string
};

type permissionCheckTypes = InferProps<typeof permissionCheckPropTypes>;

/**
 * Route element wrapper to check if a user is logged in for any applicable routes and periodically refresh the auth token
 * @param param0 
 * @returns 
 */
function ValidateRoute ({routeTo="/"}:permissionCheckTypes) {
    const navigate = useNavigate();

    const MINUTE_MS = 60000;

    useEffect(() => {
      const interval = setInterval(async () => {
        try {
            const success = await validate();
            if(!success) {
                await logout();
                navigate(routeTo??'/');
            }
        } catch(e) {
            console.error("Failed to validate: ", e);
            localStorage.clear();
            navigate(routeTo??'/');
        }
      }, MINUTE_MS * VALIDATE_INTERVAL);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return(<Outlet/>)
}

export default ValidateRoute