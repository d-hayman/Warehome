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
import { deleteCategory, fetchAllCategories } from '../../shared/services/categories.service';
import { MdRefresh } from 'react-icons/md';
import { CategoryModel } from '../../shared/models/categories/category.model';
import { Button, ButtonGroup, Container } from 'react-bootstrap';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import DeletionModal from '../../shared/components/DeletionModal';

function AdminCategories() {
  const hasDeleteCategory = (localStorage.getItem("permissions")??'').includes("Category:destroy");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [, setLoading] = useState(true);
  const [,setError] = useState<any>(null);
  const [totalCategories, setTotalCategories] = useState(0);

  async function loadCategories() {
      try {
          //MUI paginator is 0-indexed but Kaminari is 1-indexed
          let data = await fetchAllCategories();
          if(data.categories) {
              setCategories(data.categories);
              setTotalCategories(data.total_count);
          }
          setLoading(false);
      } catch(e) {
          setError(e);
          setLoading(false);
          console.error("Failed to fetch categories: ", e);
      }
  }

  useEffect(() => {
      loadCategories();
  }, []);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - totalCategories);

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
            <TableCell><b>Category</b></TableCell>
            <TableCell><b>Description</b></TableCell>
            <TableCell align="right">
                <Tooltip title="Create new category">
                  <Button variant="outline-secondary" size='sm' href={`/admin/categories/new`}>
                      <FaPlus/>
                  </Button>
                </Tooltip>
                <Tooltip title="Refresh">
                    <IconButton onClick={() => {loadCategories()}}>
                        <MdRefresh/>
                    </IconButton>
                </Tooltip>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.slice(page * rowsPerPage, (page+1) * rowsPerPage).map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>
                {row.description}
              </TableCell>
              <TableCell align="right">
                <ButtonGroup>
                  <Tooltip title={`Edit ${row.name}`}>
                    <Button variant="outline-secondary" size='sm' href={`/admin/categories/${row.id}`}>
                        <FaEdit/>
                    </Button>
                  </Tooltip>
                  {hasDeleteCategory &&
                  <DeletionModal 
                    title={row.name} 
                    deletion={deleteCategory} 
                    id={row.id} 
                    callback={loadCategories} 
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
              count={totalCategories}
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

export default AdminCategories;