/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { Tooltip } from '@mui/material';
import { Button, Container, Form, InputGroup, Nav, Navbar } from 'react-bootstrap';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { GiSaucepan } from 'react-icons/gi';
import { MdLogout, MdSettings } from 'react-icons/md';
import { useContext, useState } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import styles from '../assets/styles/NavBar.module.css'
import { logout } from '../shared/services/auth.service';
import { SearchContext } from './providers/SearchProvider';

/**
 * NavBar component
 * @returns JSX.Element for the nav bar
 */
function NavBar() {
    const hasAdminPanel = (localStorage.getItem("permissions")??'').includes("AdminPanel:view");

    const {searchQuery, emitSearch} = useContext(SearchContext);
    const [search, setSearch] = useState(searchQuery);

    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Calls the logout api from auth service
     */
    const doLogout = async () => {
        try {
            const success = await logout();
            if(!success) {
                console.error("Bad response while logging out?");
            }
            navigate('/');
        } catch(e) {
            console.error("Failed to logout: ", e);
            localStorage.clear();
            navigate('/');
        }
    }

    /**
     * Conditionally navigates to the destination
     * @param destination 
     */
    const conditionalNavigate = (destination:string) => {
        if(!location.pathname.startsWith(destination))
            navigate(destination);
    }
    
    return (
    <div className='app'>
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/dashboard">Warehome</Navbar.Brand>
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
                            onKeyDown={(e) => {
                                if (e.code === "Enter") {
                                e.preventDefault();
                                conditionalNavigate('/dashboard');
                                emitSearch(search);
                                }
                            }}
                        />
                        <Button variant='light' onClick={() => {conditionalNavigate('/dashboard'); emitSearch(search)}}>
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
        
        <div className='app_body'>
            <Outlet/>
        </div>
    </div>
    );
}

export default NavBar