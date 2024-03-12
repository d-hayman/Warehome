/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { CategoryModel } from "../../shared/models/categories/category.model";
import { useNavigate, useParams } from "react-router-dom";
import { createCategory, editCategory, fetchCategory } from "../../shared/services/categories.service";
import { Alert, Button, Container, Form } from "react-bootstrap";
import { listifyErrors } from "../../shared/utils/responseHelpers";
import { Paper } from "@mui/material";
import styles from '../../assets/styles/Admin.module.css';

/**
 * Create/Edit category component
 * @returns JSX.Element
 */
function AdminCategoriesEdit() {
    const [category, setCategory] = useState<CategoryModel>(new CategoryModel());
    const { id } = useParams();

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertBody, setSuccessAlertBody] = useState<any>({});

    const navigate = useNavigate();

    useEffect(() => {
        /**
         * Calls the fetch API to populate the category data
         * @returns void
         */
        const fetchCurrentCategory = async () => {
            // no need to fetch in create mode
            if(id == "new"){
                return;
            }
            try {
                const json = await fetchCategory(id);
                setCategory(CategoryModel.buildCategoryData(json));
            } catch(e:any) {
                setErrorAlertBody({error: `${e}`});
                setShowErrorAlert(true);
                console.error("Failed to fetch the article: ", e);
            }
        };

        fetchCurrentCategory();
    }, [id]);

    /**
     * 
     * @param e 
     */
    const submitCategory = async (e:any) => {
        e.preventDefault();

        try {
            const response = await (id=="new" ? createCategory(category) : editCategory(id,category));
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
    }

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

            {id!="new" && <>Subcategories Table goes here</>}
        </Paper>
    </Container>)
}

export default AdminCategoriesEdit