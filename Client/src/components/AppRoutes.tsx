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
import PermissionCheck from '../shared/components/PermissionCheck';
import AdminRoles from '../features/admin/AdminRoles';
import AdminRolesEdit from '../features/admin/AdminRolesEdit';
import ValidateRoute from './ValidateRoute';
import ItemPage from '../features/dashboard/ItemPage';
import ContainerPage from '../features/dashboard/ContainerPage';
import { SearchProvider } from './providers/SearchProvider';

/**
 * Returns the appropriate "page" based on the path in the addressbar
 * @returns JSX.Element based on the path in the addressbar
 */
function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>

            <Route element={<ValidateRoute/>}>
            <Route element={<SearchProvider/>}>
            <Route element={<NavBar/>}>
                <Route element={<LeftNav/>}>
                    <Route path="/dashboard" element={<DashboardPage/>}/>
                    <Route path="/item/:id" element={<ItemPage/>}/>
                    <Route path="/container/:id" element={<ContainerPage/>}/>
                    <Route path="/container/:parentId/new" element={<ContainerPage/>}/>
                </Route>

                <Route element={<PermissionCheck permission='AdminPanel:view'/>}>
                <Route element={<Breadcrumbs/>}>
                    <Route path="/admin" element={<AdminRoot/>}/>
                    <Route path="/admin/users" element={<AdminUsers/>}/>
                    <Route path="/admin/categories" element={<AdminCategories/>}/>
                    <Route path="/admin/categories/:id" element={<AdminCategoriesEdit/>}/>
                    <Route path="/admin/roles" element={<AdminRoles/>}/>
                    <Route path="/admin/roles/:id" element={<AdminRolesEdit/>}/>
                </Route>
                </Route>
            </Route>
            </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes;