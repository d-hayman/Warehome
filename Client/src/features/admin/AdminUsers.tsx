/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableFooter,
    TableRow,
    TableCell, 
    TablePagination,
    Tooltip,
    IconButton
} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import { deleteUser, fetchAllUsers } from '../../shared/services/users.service';
import { ButtonGroup, Container } from 'react-bootstrap';
import { MdRefresh } from 'react-icons/md';
import { UserModel } from '../../shared/models/user.model';
import EditUserModal from './components/EditUserModal';
import DeletionModal from '../../shared/components/DeletionModal';
import { FaTrash } from 'react-icons/fa';

function AdminUsers() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState<UserModel[]>([]);
    const [, setLoading] = useState(true);
    const [,setError] = useState<any>(null);
    const [totalUsers, setTotalUsers] = useState(0);

    async function loadUsers() {
        try {
            //MUI paginator is 0-indexed but Kaminari is 1-indexed
            let data = await fetchAllUsers(page+1, rowsPerPage);
            if(data.users) {
                setUsers(data.users);
                setTotalUsers(data.total_count);
                setRowsPerPage(Number.parseInt(data.per_page));
            }
            setLoading(false);
        } catch(e) {
            setError(e);
            setLoading(false);
            console.error("Failed to fetch users: ", e);
        }
    }

    useEffect(() => {
        loadUsers();
    }, [rowsPerPage, page])

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = Math.max(0, rowsPerPage - users.length);

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">
              <EditUserModal callback={loadUsers}/>
              <Tooltip title="Refresh">
                <IconButton onClick={() => {loadUsers()}}>
                  <MdRefresh/>
                </IconButton>
              </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow key={row.username}>
              <TableCell component="th" scope="row">
                {row.username}
              </TableCell>
              <TableCell align="right">
                <ButtonGroup>
                  <EditUserModal 
                    callback={loadUsers} 
                    user={row}
                  />
                  <DeletionModal 
                    deletion={deleteUser} 
                    id={row.id} 
                    title={row.username} 
                    callback={loadUsers} 
                    buttonBody={<FaTrash/>} 
                    buttonSize='sm'
                  />
                </ButtonGroup>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 64 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={4}
              count={totalUsers}
              rowsPerPage={rowsPerPage}
              page={page}
              
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
    </Container>
  );
}

export default AdminUsers;