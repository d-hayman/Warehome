/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { CategoryModel } from "../../shared/models/categories/category.model";
import { useNavigate, useParams } from "react-router-dom";
import { 
    fetchCategory, 
    createCategory, 
    updateCategory, 
    fetchAllSubcategories, 
    createSubcategory, 
    updateSubcategory, 
    deleteSubcategory } from "../../shared/services/categories.service";
import { Alert, Button, ButtonGroup, Container, Form } from "react-bootstrap";
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
    Tooltip,
    IconButton,
    TableContainer
} from "@mui/material";
import styles from '../../assets/styles/Admin.module.css';
import { FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { SubcategoryModel } from "../../shared/models/categories/subcategory.model";
import DeletionModal from "../../shared/components/DeletionModal";

/**
 * Create/Edit category component
 * @returns JSX.Element
 */
function AdminCategoriesEdit() {
    const [category, setCategory] = useState<CategoryModel>(new CategoryModel());
    const [subcategories, setSubcategories] = useState<SubcategoryModel[]>([]);
    const [nextNew, setNextNew] = useState(1);
    const { id } = useParams();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalSubcategories, setTotalSubcategories] = useState(0);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertBody, setSuccessAlertBody] = useState<any>({});

    const navigate = useNavigate();

    /**
     * Calls the fetch API to populate the subcategory data
     */
    const loadSubcategories = async () => {
        try {
            const data = await fetchAllSubcategories(id);
            if(data.subcategories){
              const subcategories = [];
              for(const s of data.subcategories){
                subcategories.push(SubcategoryModel.buildSubcategoryData(s));
              }
      
              setSubcategories(subcategories);
              setTotalSubcategories(data.total_count);
            }
          } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the subcategories: ", e);
          }
    };

    useEffect(() => {
        /**
         * Calls the fetch API to populate the category data
         * @returns void
         */
        const loadCurrentCategory = async () => {
            // no need to fetch in create mode
            if(id == "new"){
                return;
            }
            try {
                const json = await fetchCategory(id);
                setCategory(CategoryModel.buildCategoryData(json));
                loadSubcategories();
            } catch(e:any) {
                setErrorAlertBody({error: `${e}`});
                setShowErrorAlert(true);
                console.error("Failed to fetch the category: ", e);
            }
        };

        loadCurrentCategory();
    }, [id]);

    /**
     * 
     * @param e 
     */
    const submitCategory = async (e:any) => {
        e.preventDefault();

        try {
            const response = await (id=="new" ? createCategory(category) : updateCategory(id,category));
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                const json = await response.json();
                if(response.ok) {
                    if(id=="new"){
                        navigate(`/admin/categories/${json.id}`);
                        setSuccessAlertBody("Category Created!");
                    } else {
                        setSuccessAlertBody("Category Updated!");
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
            console.error("Failed to create category: ", e);
        }
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = Math.max(0, (1 + page) * rowsPerPage - totalSubcategories);

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

    /**
     * Add a blank subcategory to the subcategories array
     */
    const addSubcategory = () => {
        let sub = SubcategoryModel.buildSubcategoryData({id:"new"+nextNew});

        setSubcategories([...subcategories, sub]);
        setTotalSubcategories(totalSubcategories+1);

        setNextNew(nextNew+1);
    };

    /**
     * Updates the subcategory data by id
     * @param id Original id of the subcategory to update
     * @param subcategory Subcategory whose data is to be updated
     */
    const editSubcategory = (id:string, subcategory: SubcategoryModel, setDirty:boolean = true) => {
        subcategory.dirty = setDirty;
        setSubcategories(
            subcategories => subcategories.map(
                (sub) => sub.id === id 
                    ? subcategory
                    : sub
            )
        );
    };

    /**
     * 
     * @param subcategory 
     */
    const submitSubcategory = async (subcategory: SubcategoryModel) => {
        try {
            const response = await ((""+subcategory.id).startsWith("new") 
                ? createSubcategory(id, subcategory) 
                : updateSubcategory(id,subcategory.id,subcategory)
            );
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                const json = await response.json();
                if(response.ok) {
                    if((""+subcategory.id).startsWith("new")){
                        // update the id for the new record
                        editSubcategory(subcategory.id, {...subcategory,id: json.id}, false);
                        setSuccessAlertBody("Subcategory Created!");
                    } else {
                        editSubcategory(subcategory.id, subcategory, false);
                        setSuccessAlertBody("Subcategory Updated!");
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
            console.error("Failed to create subcategory: ", e);
        }
    };

    /**
     * Remove a subcategory from the subcategories array
     */
    const removeSubcategory = async (subcategoryId:string) => {
        if((""+subcategoryId).startsWith("new")){
            setSubcategories(subcategories.filter(sub => sub.id !== subcategoryId));
            setTotalSubcategories(totalSubcategories-1);
        } else {
            try {
                await deleteSubcategory(id, subcategoryId);
                setSubcategories(subcategories.filter(sub => sub.id !== subcategoryId));
                setTotalSubcategories(totalSubcategories-1);
            } catch (e) {
                setErrorAlertBody({error: `${e}`});
                setShowErrorAlert(true);
                console.error("Failed to delete subcategory: ", e);
            }
        }
    };

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
            <Form onSubmit={submitCategory}>
                <Form.Group className="mb-3" controlId="CategoryNameInput">
                    <Form.Label>Name:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={category.name} 
                        onChange={(e) => setCategory({
                            ...category,
                            name: e.target.value})}
                        required 
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="CategoryDescriptionInput">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={category.description} 
                        onChange={(e) => setCategory({
                            ...category,
                            description: e.target.value})}
                        required 
                    />
                </Form.Group>

                <Button type="submit">Save</Button>
            </Form>
        </Paper>

        {id!="new" && 
        <TableContainer component={Paper} className="mt-3">
            <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Subcategory</b></TableCell>
                <TableCell><b>Description</b></TableCell>
                <TableCell align="right">
                    <Tooltip title="Create new category">
                      <Button variant="outline-secondary" size='sm' onClick={addSubcategory}>
                          <FaPlus/>
                      </Button>
                    </Tooltip>
                    <Tooltip title="Refresh">
                        <IconButton onClick={() => {loadSubcategories()}}>
                            <MdRefresh/>
                        </IconButton>
                    </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subcategories.slice(page * rowsPerPage, (page+1) * rowsPerPage).map((row) => (
                <TableRow >
                    <TableCell component="th" scope="row">
                        <Form.Control 
                            type="text" 
                            value={row.name} 
                            onChange={(e) => editSubcategory(row.id,{
                                ...row,
                                name: e.target.value})}
                            required 
                        />
                    </TableCell>
                    <TableCell>
                        <Form.Control 
                            type="text" 
                            value={row.description} 
                            onChange={(e) => editSubcategory(row.id,{
                                ...row,
                                description: e.target.value})}
                            required 
                        />
                    </TableCell>
                    <TableCell align="right">
                        <ButtonGroup>
                            <Button size="sm" variant="outline-primary" disabled={!row.dirty} onClick={()=>submitSubcategory(row)}>
                                <FaSave/>
                            </Button>
                            <DeletionModal 
                                title={row.name} 
                                deletion={removeSubcategory} 
                                id={row.id} 
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
                  count={totalSubcategories}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>}
    </Container>)
}

export default AdminCategoriesEdit