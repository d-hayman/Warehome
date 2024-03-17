/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { RoleModel } from "../../shared/models/role.model";
import { useNavigate, useParams } from "react-router-dom";
import { 
    fetchRole, 
    createRole, 
    updateRole } from "../../shared/services/roles.service";
import { Alert, Button, Container, Form, Tab, Tabs } from "react-bootstrap";
import { listifyErrors } from "../../shared/utils/responseHelpers";
import { 
    Paper, 
    Table,
    TableHead, 
    TableBody, 
    TableFooter,
    TableRow,
    TableCell, 
    TablePagination,
    Checkbox
} from "@mui/material";
import styles from '../../assets/styles/Admin.module.css';
import { UserModel } from "../../shared/models/user.model";
import { PermissionModel } from "../../shared/models/permission.model";
import { fetchAllPermissions } from "../../shared/services/permissions.service";
import { fetchAllUsers } from "../../shared/services/users.service";

/**
 * Create/Edit role component
 * @returns JSX.Element
 */
function AdminRolesEdit() {
    const [role, setRole] = useState<RoleModel>(new RoleModel());
    const [users, setUsers] = useState<UserModel[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<readonly string[]>([]);
    const [permissions, setPermissions] = useState<PermissionModel[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<readonly string[]>([]);
    const { id } = useParams();

    // permission table state
    const [userPage, setUserPage] = useState(0);
    const [userRowsPerPage, setUserRowsPerPage] = useState(5);
    const [_, setTotalUsers] = useState(0);

    // permission table state
    const [permissionPage, setPermissionPage] = useState(0);
    const [permissionRowsPerPage, setPermissionRowsPerPage] = useState(5);
    const [totalPermissions, setTotalPermissions] = useState(0);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertBody, setSuccessAlertBody] = useState<any>({});

    const navigate = useNavigate();

    /**
     * Function to load permissions
     * @param callback 
     */
    async function loadPermissions(callback: any) {
        try {
            let data = await fetchAllPermissions();
            const fetchedPermissions: PermissionModel[] = []
            for(const permission of data.permissions) {
                fetchedPermissions.push(PermissionModel.buildPermissionData(permission));
            }
            setPermissions(fetchedPermissions);
            setTotalPermissions(data.total_count);
            if(typeof callback === "function") {
                callback();
            }
        } catch(e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch permissions: ", e);
        }
    }

    /**
     * function to load a page of users
     * @param callback 
     */
    async function loadUsers(callback: any) {
        try {
            let data = await fetchAllUsers(userPage+1, userRowsPerPage);
            // it seems things set in use state aren't immediately accessible on this render frame
            const fetchedUsers: UserModel[] = []
            for(const user of data.users) {
                fetchedUsers.push(UserModel.buildUserData(user));
            }
            setUsers(fetchedUsers);
            setTotalUsers(data.total_count);
            if(typeof callback === "function") {
                callback();
            }
        } catch(e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch users: ", e);
        }
    }
    
    /**
     * Calls the fetch API to populate the role data
     * @returns void
     */
    const loadCurrentRole = async () => {
        // no need to fetch in create mode
        if(id == "new"){
            return;
        }
        try {
            const json = await fetchRole(id);
            const _role = RoleModel.buildRoleData(json);
            setRole(_role);
            const permSelected = _role.permissions.map((p) => p.id);
            setSelectedPermissions(permSelected)
            const usrSelected = _role.users.map((u) => u.id);
            setSelectedUsers(usrSelected)
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the role: ", e);
        }
    };

    useEffect(() => {
        loadPermissions(loadUsers(loadCurrentRole));
    }, [id]);

    /**
     * 
     * @param e 
     */
    const submitRole = async (e:any) => {
        e.preventDefault();

        try {
            const response = await (id=="new" 
                ? createRole(role, [...selectedUsers], [...selectedPermissions]) 
                : updateRole(id, role, [...selectedUsers], [...selectedPermissions]));

            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                const json = await response.json();
                if(response.ok) {
                    if(id=="new"){
                        navigate(`/admin/roles/${json.id}`);
                        setSuccessAlertBody("Role Created!");
                    } else {
                        setSuccessAlertBody("Role Updated!");
                    }
                    setShowSuccessAlert(true);
                } else {
                    setErrorAlertBody(json);
                    setShowErrorAlert(true);
                }
            }
        } catch (e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to create role: ", e);
        }
    };

    // --- EVENT HANDLERS ---//
    /**
     * Event handler for selecting all permissions
     * @param event 
     * @returns 
     */
    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
          const newSelected = permissions.map((p) => p.id);
          setSelectedPermissions(newSelected);
          return;
        }
        setSelectedPermissions([]);
    };

    /**
     * 
     * @param event 
     * @param id 
     */
    const handleClick = (_: React.MouseEvent<unknown>, id: string, 
        [selected, setSelected]: [readonly string[], React.Dispatch<React.SetStateAction<readonly string[]>>]) => {

      const selectedIndex = selected.indexOf(id);
      let newSelected: readonly string[] = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      setSelected(newSelected);
    };

    const isPermissionSelected = (id: string) => selectedPermissions.indexOf(id) !== -1;

    const isUserSelected = (id: string) => selectedUsers.indexOf(id) !== -1;

    // --- PERMISSION TABLE CONTROL --- //
    /**
     * 
     * @param _ 
     * @param newPage 
     */
    const handleChangePermissionPage = (
      _: React.MouseEvent<HTMLButtonElement> | null,
      newPage: number,
    ) => {
      setPermissionPage(newPage);
    };
  
    /**
     * 
     * @param event 
     */
    const handleChangePermissionRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setPermissionRowsPerPage(parseInt(event.target.value, 10));
      setPermissionPage(0);
    };
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyPermissionRows = Math.max(0, (1 + permissionPage) * permissionRowsPerPage - totalPermissions);

    // --- USER TABLE CONTROL --- //
    
    useEffect(() => {
        loadUsers(undefined);
    }, [userRowsPerPage, userPage]);

    /**
     * 
     * @param _ 
     * @param newPage 
     */
    const handleChangeUserPage = (
        _: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setUserPage(newPage);
    };

    /**
     * 
     * @param event 
     */
    const handleChangeUserRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setUserRowsPerPage(parseInt(event.target.value, 10));
        setUserPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyUserRows = Math.max(0, userRowsPerPage - users.length);

    return (
    <Container>
        { showErrorAlert &&
        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
            <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
            <ul style={{textAlign:"left"}}>{listifyErrors(errorAlertBody)}</ul>
        </Alert>}
        { showSuccessAlert &&
        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
            <Alert.Heading>Great Success!</Alert.Heading>
            {successAlertBody}
        </Alert>}

        <Paper className={styles.form_box}>
            <Form onSubmit={submitRole}>
                <Form.Group className="mb-3" controlId="RoleNameInput">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={role.name} 
                        onChange={(e) => setRole({
                            ...role,
                            name: e.target.value})}
                        required 
                    />
                </Form.Group>

                <Tabs
                    defaultActiveKey="permissions"
                    id="justify-tab-example"
                    className="mb-3"
                    justify
                >
                    <Tab eventKey="permissions" title="Permissions">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selectedPermissions.length > 0 && selectedPermissions.length < permissions.length}
                                            checked={selectedPermissions.length > 0 && selectedPermissions.length == permissions.length}
                                            onChange={handleSelectAllClick}
                                            inputProps={{
                                            'aria-label': 'select all permissions',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">Model</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {(permissionRowsPerPage > 0
                                ? permissions.slice(permissionPage * permissionRowsPerPage, (permissionPage+1) * permissionRowsPerPage)
                                : permissions
                            ).map((row, index) => {
                                const isItemSelected = isPermissionSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                <TableRow 
                                    key={`${row.model}-${row.action}`}
                                    hover
                                    onClick={(event) => handleClick(event, row.id, [selectedPermissions, setSelectedPermissions])}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                            'aria-labelledby': labelId,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {row.model}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {row.action}
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                            {emptyPermissionRows > 0 && (
                                <TableRow style={{ height: 53 * emptyPermissionRows }}>
                                    <TableCell colSpan={3} />
                                </TableRow>
                            )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={3}
                                        count={permissions.length}
                                        rowsPerPage={permissionRowsPerPage}
                                        page={permissionPage}
                                        
                                        onPageChange={handleChangePermissionPage}
                                        onRowsPerPageChange={handleChangePermissionRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Tab>
                    <Tab eventKey="users" title="Users">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                    </TableCell>
                                    <TableCell align="center">User</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {(userRowsPerPage > 0
                                ? users.slice(userPage * userRowsPerPage, (userPage+1) * userRowsPerPage)
                                : users
                            ).map((row, index) => {
                                const isItemSelected = isUserSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                <TableRow 
                                    key={`${row.id}`}
                                    hover
                                    onClick={(event) => handleClick(event, row.id, [selectedUsers, setSelectedUsers])}
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    selected={isItemSelected}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            checked={isItemSelected}
                                            inputProps={{
                                            'aria-labelledby': labelId,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="center">
                                        {row.username}
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                            {emptyUserRows > 0 && (
                                <TableRow style={{ height: 53 * emptyUserRows }}>
                                    <TableCell colSpan={3} />
                                </TableRow>
                            )}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                        colSpan={3}
                                        count={users.length}
                                        rowsPerPage={userRowsPerPage}
                                        page={userPage}
                                        
                                        onPageChange={handleChangeUserPage}
                                        onRowsPerPageChange={handleChangeUserRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Tab>
                </Tabs>

                <Button type="submit" className="mt-3">Save</Button>
            </Form>
        </Paper>
    </Container>)
}

export default AdminRolesEdit