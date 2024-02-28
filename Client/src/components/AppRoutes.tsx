/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import {Route, Routes} from 'react-router-dom';
import LoginPage from '../features/login/LoginPage';
import SignupPage from '../features/login/SignupPage';
import DashboardPage from '../features/Dashboard/DashboardPage';

/**
 * Returns the appropriate "page" based on the path in the addressbar
 * @returns JSX.Element based on the path in the addressbar
 */
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
        </Routes>
    )
}

export default AppRoutes;