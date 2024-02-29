/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { Tooltip } from '@mui/material';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { GiSaucepan } from 'react-icons/gi';
import { MdSettings } from 'react-icons/md';

const excludeRoutes = ["/", "/signup"];
function NavBar() {
    const hasAdminPanel = (localStorage.getItem("permissions")??'').includes("AdminPanel:view");

    let location = useLocation();

    if(excludeRoutes.indexOf(location.pathname) != -1){
        return (<></>);
    }
    
    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Warehome</Navbar.Brand>
                <Tooltip title="Sauce">
                    <Link 
                        to="https://github.com/d-hayman/Warehome"
                        target="_blank" 
                        rel="noopener noreferrer"
                    >
                        <GiSaucepan/>
                    </Link>
                </Tooltip>
                { hasAdminPanel &&
                    <Tooltip title="Admin">
                        <Link to="/admin">
                            <MdSettings/>
                        </Link>
                    </Tooltip>
                }
            </Container>
        </Navbar>
    );
}

export default NavBar