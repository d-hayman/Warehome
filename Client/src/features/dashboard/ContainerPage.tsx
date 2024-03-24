/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ContainerModel } from "../../shared/models/container.model";
import { Alert, Button, ButtonGroup, Col, Container, Form, Row, Tab, Tabs } from "react-bootstrap";
import styles from "../../assets/styles/ContainerPage.module.css";
import noImage from '../../assets/img/imagenotfound.png';
import { containerRemoveItem, createContainer, deleteContainer, fetchAllContainerItems, fetchAllContainers, fetchContainer, updateContainer } from "../../shared/services/containers.service";
import { listifyErrors } from "../../shared/utils/responseHelpers";
import DeletionModal from "../../shared/components/DeletionModal";
import { FaArrowUp, FaBan, FaEdit, FaHome, FaPlus, FaTrash } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import { displayModes, useDisplayModeToggle } from "../../shared/hooks/DisplayMode";
import { ContainmentModel } from "../../shared/models/containment.model";

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
    
    const {displayMode, displayToggle} = useDisplayModeToggle();
    const [items, setItems] = useState<ContainmentModel[]>([]);
    const [children, setChildren] = useState<ContainerModel[]>([]);

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

    const loadItems = async () => {
        // no need to fetch in create mode
        if(location.pathname.endsWith("/new")){
            return;
        }
        try {
            const json = await fetchAllContainerItems(id);
            const items:ContainmentModel[] = [];
            if(json.items){
                for (const item of json.items){
                    items.push(ContainmentModel.buildContainmentData(item));
                }
            }
            setItems(items);
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the containers: ", e);
        }
    }
    
    /**
     * function to fetch child containers
     * @param e eventKey
     * @returns void
     */
    const loadChildren = async () => {
        // no need to fetch in create mode
        if(location.pathname.endsWith("/new")){
            return;
        }
        try{
            let data = await fetchAllContainers(id);
            if(data.containers){
            const containers = []
            for(const c of data.containers){
                containers.push(ContainerModel.buildContainerData(c));
            }
    
            setChildren(containers);
            }
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        loadCurrentContainer();
        loadItems();
        loadChildren();
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
                            {container.parentId && 
                            <Tooltip title="Up One">
                                <Button variant="outline-primary" onClick={()=>{navigate(`/container/${container.parentId}`)}}><FaArrowUp/></Button>
                            </Tooltip>
                            }
                        
                            {!location.pathname.endsWith("/new") &&
                            <Tooltip title="Back to Dashboard">
                                <Button variant="outline-primary" onClick={()=>{navigate('/dashboard')}}><FaHome/></Button>
                            </Tooltip>
                            }
                        </ButtonGroup>
                        <ButtonGroup style={{marginLeft:"1rem"}}>
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
                            {!location.pathname.endsWith("/new") && 
                            <DeletionModal 
                                deletion={deleteContainer} 
                                title={container.name} 
                                id={container.id} 
                                buttonBody={<FaTrash/>} 
                                callback={()=>{navigate('/dashboard');navigate(0)}} 
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

            {mode == modes.display &&
            <Tabs
                defaultActiveKey="items"
                id="justify-tab-example"
                className="mb-3"
                justify
            >
                <Tab eventKey="items" title="Items">
                    <Row className={styles.tab_section}>
                        <Col xs={12}>
                            <div className={styles.container_controls}>
                                <ButtonGroup>
                                </ButtonGroup>
                                <span className={`d-none d-md-inline-block ${styles.dashboard_display_toggle}`}>{displayToggle}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {items.map((containment:ContainmentModel) => (
                            <Col key={containment.itemId} xs={12} md={displayMode == displayModes.grid ? 4 : 12} className={styles.container_card}>
                                <Container className={styles.container_card_inner}>
                                    <Link to={`/item/${containment.itemId}`}>
                                    <Row>
                                        <Col xs={4} md={displayMode == displayModes.grid ? 12 : 4} className={styles.container_image}>
                                            <img src={(containment.item?.image_url) ? containment.item.image_url : noImage} style={{maxHeight: '200px', maxWidth:'100%'}}/>
                                        </Col>
                                        <Col xs={8} md={displayMode == displayModes.grid ? 12 : 8}>
                                            <b>{containment.item?.description}</b><hr/>
                                            Quantity: {containment.quantity}<br/>
                                            Position: {containment.position}
                                        </Col>
                                    </Row>
                                    </Link>
                                    <Row className={styles.container_card_controls}>
                                        <Col xs={12} style={{textAlign:'right'}}>
                                            <ButtonGroup>
                                                <DeletionModal
                                                    deletion={containerRemoveItem}
                                                    id={containment.itemId}
                                                    title={`${containment.item?.description} from ${container.name}`}
                                                    parent={container.id}
                                                    buttonSize='sm'
                                                    buttonBody={<FaTrash/>}
                                                    callback={loadItems}
                                                />
                                            </ButtonGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        ))}
                    </Row>
                </Tab>
                <Tab eventKey="containers" title="Containers">
                    <Row className={styles.tab_section}>
                        <Col xs={12}>
                            <div className={styles.container_controls}>
                                <ButtonGroup>
                                    <Tooltip title="Create new inner container" placement="bottom">
                                        <Button variant="outline-secondary" onClick={()=>{navigate(`/container/${id}/new`)}}>
                                            <FaPlus/>
                                        </Button>
                                    </Tooltip>
                                </ButtonGroup>
                                <span className={`d-none d-md-inline-block ${styles.dashboard_display_toggle}`}>{displayToggle}</span>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {children.map((container:ContainerModel) => (
                            <Col key={container.id} xs={12} md={displayMode == displayModes.grid ? 4 : 12} className={styles.container_card}>
                                <Container className={styles.container_card_inner}>
                                    <Link to={`/container/${container.id}`}>
                                    <Row>
                                        <Col xs={4} md={displayMode == displayModes.grid ? 12 : 4} className={styles.container_image}>
                                            <img src={(container.image_url) ? container.image_url : noImage} style={{maxHeight: '200px', maxWidth:'100%'}}/>
                                        </Col>
                                        <Col xs={8} md={displayMode == displayModes.grid ? 12 : 8}>
                                            <b>{container.name}</b><br/>
                                            {container.description}
                                        </Col>
                                    </Row>
                                    </Link>
                                    <Row className={styles.container_card_controls}>
                                        <Col xs={12} style={{textAlign:'right'}}>
                                            <ButtonGroup>
                                            </ButtonGroup>
                                        </Col>
                                    </Row>
                                </Container>
                            </Col>
                        ))}
                    </Row>
                </Tab>
            </Tabs>}

        </Container>
    )
}

export default ContainerPage