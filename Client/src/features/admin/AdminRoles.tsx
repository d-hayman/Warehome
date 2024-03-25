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
import { deleteRole, fetchAllRoles } from '../../shared/services/roles.service';
import { MdRefresh } from 'react-icons/md';
import { RoleModel } from '../../shared/models/role.model';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import DeletionModal from '../../shared/components/DeletionModal';

function AdminRoles() {
  const hasDeleteRole = (localStorage.getItem("permissions")??'').includes("Role:destroy");
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [roles, setRoles] = useState<RoleModel[]>([]);
  const [, setLoading] = useState(true);
  const [,setError] = useState<any>(null);
  const [totalRoles, setTotalRoles] = useState(0);

  async function loadRoles() {
      try {
          //MUI paginator is 0-indexed but Kaminari is 1-indexed
          let data = await fetchAllRoles();
          if(data.roles) {
              setRoles(data.roles);
              setTotalRoles(data.total_count);
          }
          setLoading(false);
      } catch(e) {
          setError(e);
          setLoading(false);
          console.error("Failed to fetch roles: ", e);
      }
  }

  useEffect(() => {
      loadRoles();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - totalRoles);

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
            <TableCell><b>Role</b></TableCell>
            <TableCell align="right">
                <Tooltip title="Create new role">
                  <Button variant="outline-secondary" size='sm' href={`/admin/roles/new`}>
                      <FaPlus/>
                  </Button>
                </Tooltip>
                <Tooltip title="Refresh">
                    <IconButton onClick={() => {loadRoles()}}>
                        <MdRefresh/>
                    </IconButton>
                </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.slice(page * rowsPerPage, (page+1) * rowsPerPage).map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">
                <ButtonGroup>
                  <Tooltip title={`Edit ${row.name}`}>
                    <Button variant="outline-secondary" size='sm' href={`/admin/roles/${row.id}`}>
                        <FaEdit/>
                    </Button>
                  </Tooltip>
                  {hasDeleteRole &&
                  <DeletionModal 
                    title={row.name} 
                    deletion={deleteRole} 
                    id={row.id} 
                    callback={loadRoles} 
                    buttonBody={<FaTrash/>} 
                    buttonSize='sm'
                  />}
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
              count={totalRoles}
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

export default AdminRoles;