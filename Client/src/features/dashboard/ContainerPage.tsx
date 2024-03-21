/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ContainerModel } from "../../shared/models/container.model";
import { Alert, Button, ButtonGroup, Col, Container, Form, Row } from "react-bootstrap";
import styles from "../../assets/styles/ContainerPage.module.css";
import noImage from '../../assets/img/imagenotfound.png';
import { createContainer, deleteContainer, fetchContainer, updateContainer } from "../../shared/services/containers.service";
import { listifyErrors } from "../../shared/utils/responseHelpers";
import DeletionModal from "../../shared/components/DeletionModal";
import { FaArrowLeft, FaBan, FaEdit, FaTrash } from "react-icons/fa";
import { Tooltip } from "@mui/material";

enum modes { 
    display,
    edit
}

/**
 * Container page component function
 * @returns JSX.Element for the container page component
 */
function ContainerPage () {
    const { id, parentId } = useParams();
    const [container, setContainer] = useState<ContainerModel>(new ContainerModel());
    const [editContainer, setEditContainer] = useState(container);
    const [mode, setMode] = useState(modes.display);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertBody, setSuccessAlertBody] = useState<any>({});

    const navigate = useNavigate();

    let location = useLocation();
    
    /**
     * Calls the fetch API to populate the category data
     * @returns void
     */
    const loadCurrentContainer = async () => {
        // no need to fetch in create mode
        if(location.pathname.endsWith("/new")){
            let empty = new ContainerModel();
            setContainer(empty);
            setEditContainer(empty);
            setMode(modes.edit);
            // check for /containers/:parentId/new route
            if(parentId){
                setEditContainer({...empty, parentId: parentId??''});
            }
            return;
        }

        try {
            const json = await fetchContainer(id);
            setContainer(ContainerModel.buildContainerData(json));
            setMode(modes.display);
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the container: ", e);
        }
    };

    useEffect(() => {
        loadCurrentContainer();
    }, [id, location.pathname]);

    /**
     * Edit button click event
     */
    const handleEdit = () => {
        setEditContainer(container); 
        setMode(modes.edit)
    };

    /**
     * Cancel button click event
     */
    const handleCancel = () => {
        if (location.pathname.endsWith("/new")){
            navigate('/dashboard');
        } else {
            setMode(modes.display);
        }
    };

    /**
     * Handle submission of the container data
     * @param e event
     */
    const handleSubmit = async (e:any) => {
        e.preventDefault();

        try {
            const response = await (location.pathname.endsWith("/new") 
                ? createContainer(editContainer) 
                : updateContainer(id,editContainer));
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                const json = await response.json();
                if(response.ok) {
                    if(location.pathname.endsWith("/new")){
                        navigate(`/container/${json.id}`);
                        setSuccessAlertBody("Container Created!");
                    } else {
                        loadCurrentContainer();
                        setSuccessAlertBody("Container Updated!");
                    }
                    setMode(modes.display);
                    setShowSuccessAlert(true);
                } else {
                    setErrorAlertBody(json);
                    setShowErrorAlert(true);
                }
            }
        } catch (e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to create container: ", e);
        }
    };

    // hijack pasting when the clipboard is raster data and pop it in the form field
    window.addEventListener('paste', e => {
        const fileInput = (document.getElementById("image") as HTMLInputElement);
        if(e.clipboardData !== null && e.clipboardData.files.length > 0){
            fileInput.files = e.clipboardData.files;
            setEditContainer({
                ...editContainer,
                image: (e.target as HTMLInputElement).files?.[0]
            });
        }
      });
    
    return(
        <Container className={styles.page_outer}>
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
            <Row className={styles.container_details}>
                <Col md={12} lg={4}>
                    <Link to={container.image_url ? container.image_url : noImage} target="_blank" rel="noopener noreferrer">
                        <img src={container.image_url ? container.image_url : noImage} className={styles.container_image}/>
                    </Link>
                    {mode === modes.edit && <>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image:</Form.Label>
                        <Form.Control  
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setEditContainer({
                                    ...editContainer,
                                    image: (e.target as HTMLInputElement).files?.[0]
                                });
                                console.log((e.target as HTMLInputElement).files?.[0]);
                            }}
                        />
                    </Form.Group>
                    </>}
                </Col>
                <Col md={12} lg={8} className={styles.container_attributes}>
                    <div className={styles.container_controls}>
                        <ButtonGroup>
                            {id != "new" &&
                            <Tooltip title="Back to Dashboard">
                                <Button variant="outline-primary" onClick={()=>{navigate('/dashboard')}}><FaArrowLeft/></Button>
                            </Tooltip>
                            }
                            {mode === modes.display && 
                            <Tooltip title="Edit Container">
                                <Button variant="outline-secondary" onClick={handleEdit}><FaEdit/></Button>
                            </Tooltip>
                            }
                            {mode === modes.edit && 
                            <Tooltip title="Cancel">
                                <Button variant="outline-secondary" onClick={handleCancel}><FaBan/></Button>
                            </Tooltip>
                            }
                            {id != "new" && 
                            <DeletionModal 
                                deletion={deleteContainer} 
                                title={container.name} 
                                id={container.id} 
                                buttonBody={<FaTrash/>} 
                                callback={()=>{navigate('/dashboard')}} 
                            />
                            }
                        </ButtonGroup>
                    </div>
                    {mode === modes.display && <>
                    <b>Name:</b> {container.name}<br/>
                    <b>Description:</b> {container.description}<br/>
                    <b>Notes:</b> {container.notes}
                    </>}
                    {mode === modes.edit && <>
                    <Form className={styles.form_outer} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="nameInput">
                            <Form.Label>Name:</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editContainer.name} 
                                onChange={(e) => setEditContainer({
                                    ...editContainer, 
                                    name:e.target.value
                                })} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="descriptionInput">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editContainer.description} 
                                onChange={(e) => setEditContainer({
                                    ...editContainer, 
                                    description:e.target.value
                                })} 
                                required 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="notesInput">
                            <Form.Label>Notes:</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={1} 
                                value={editContainer.notes} 
                                onChange={(e) => setEditContainer({
                                    ...editContainer, 
                                    notes:e.target.value
                                })} 
                            />
                        </Form.Group>
                        <Button type="submit" className={styles.submit_button}>
                            Save
                        </Button>
                    </Form>
                    </>}
                </Col>
            </Row>

        </Container>
    )
}

export default ContainerPage