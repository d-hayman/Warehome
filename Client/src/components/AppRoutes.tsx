/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import {Route, Routes} from 'react-router-dom';
import LoginPage from '../features/login/LoginPage';
import SignupPage from '../features/login/SignupPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import AdminRoot from '../features/admin/AdminRoot';
import AdminUsers from '../features/admin/AdminUsers';
import AdminCategories from '../features/admin/AdminCategories';
import AdminCategoriesEdit from '../features/admin/AdminCategoriesEdit';
import Breadcrumbs from '../shared/components/Breadcrumbs';
import NavBar from './NavBar';
import LeftNav from './LeftNav';

/**
 * Returns the appropriate "page" based on the path in the addressbar
 * @returns JSX.Element based on the path in the addressbar
 */
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route element={<NavBar/>}>
                <Route element={<LeftNav/>}>
                    <Route path="/dashboard" element={<DashboardPage/>}/>
                </Route>

                <Route element={<Breadcrumbs/>}>
                    <Route path="/admin" element={<AdminRoot/>}/>
                    <Route path="/admin/users" element={<AdminUsers/>}/>
                    <Route path="/admin/categories" element={<AdminCategories/>}/>
                    <Route path="/admin/categories/:id" element={<AdminCategoriesEdit/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;