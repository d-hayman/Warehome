/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { Tooltip } from '@mui/material';
import { Alert, Button, Container, Form, InputGroup, Nav, Navbar } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiSaucepan } from 'react-icons/gi';
import { MdLogout, MdSettings } from 'react-icons/md';
import { useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from '../assets/styles/NavBar.module.css'
import { logout } from '../shared/services/auth.service';

const excludeRoutes = ["/", "/signup"];

/**
 * NavBar component
 * @returns JSX.Element for the nav bar
 */
function NavBar() {
    const hasAdminPanel = (localStorage.getItem("permissions")??'').includes("AdminPanel:view") || true;

    const [search, setSearch] = useState('');

    const [logoutError, setLogoutError] = useState(false);

    let location = useLocation();
    const navigate = useNavigate();

    /**
     * Calls the logout api from auth service
     */
    const doLogout = async () => {
        try {
            const success = await logout();
            if(!success) {
                setLogoutError(true);
            }
            navigate('/');
        } catch(e) {
            console.error("Failed to logout: ", e);
            localStorage.clear();
            setLogoutError(true);
            navigate('/');
        }
    }

    if(excludeRoutes.indexOf(location.pathname) != -1){
        return (<>
            { logoutError &&
                <Alert variant="danger" onClose={() => setLogoutError(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    An error occurred while logging out
                </Alert>}
        </>);
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
                <Nav className='me-auto'>
                    <InputGroup className='ms-3'>
                        <Form.Control data-bs-theme="light"
                            className={styles.search_bar}
                            type="search" 
                            placeholder="Search"
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                        />
                        <Button variant='light' onClick={() => {}}>
                            <FaMagnifyingGlass/>
                        </Button>
                    </InputGroup>
                </Nav>
                { hasAdminPanel &&
                    <Tooltip title="Admin">
                        <Button href="/admin">
                            <MdSettings/>
                        </Button>
                    </Tooltip>
                }
                <Tooltip title="Logout">
                    <Button variant='outline-light' onClick={doLogout}>
                        <MdLogout/>
                    </Button>
                </Tooltip>
            </Container>
        </Navbar>
    );
}

export default NavBar