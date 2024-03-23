/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ItemModel } from "../../shared/models/item.model";
import { Alert, Button, ButtonGroup, Col, Container, Form, Row } from "react-bootstrap";
import styles from "../../assets/styles/ItemPage.module.css";
import noImage from '../../assets/img/imagenotfound.png';
import { createItem, deleteItem, fetchAllItemContainers, fetchItem, updateItem } from "../../shared/services/items.service";
import { listifyErrors } from "../../shared/utils/responseHelpers";
import DeletionModal from "../../shared/components/DeletionModal";
import { FaArrowLeft, FaBan, FaEdit, FaTrash } from "react-icons/fa";
import { Tooltip } from "@mui/material";
import AddToContainerModal from "./components/AddToContainerModal";
import { ContainmentModel } from "../../shared/models/containment.model";
import { displayModes, useDisplayModeToggle } from "../../shared/hooks/DisplayMode";
import { containerRemoveItem } from "../../shared/services/containers.service";

enum modes { 
    display,
    edit
}

/**
 * Item page component function
 * @returns JSX.Element for the item page component
 */
function ItemPage () {
    const { id } = useParams();
    const [item, setItem] = useState<ItemModel>(new ItemModel());
    const [editItem, setEditItem] = useState(item);
    const [mode, setMode] = useState(modes.display);

    const {displayMode, displayToggle} = useDisplayModeToggle();
    const [containers, setContainers] = useState<ContainmentModel[]>([]);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertBody, setSuccessAlertBody] = useState<any>({});

    const navigate = useNavigate();
    
    /**
     * Calls the fetch API to populate the category data
     * @returns void
     */
    const loadCurrentItem = async () => {
        // no need to fetch in create mode
        if(id == "new"){
            setMode(modes.edit);
            return;
        }
        try {
            const json = await fetchItem(id);
            setItem(ItemModel.buildItemData(json));
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the item: ", e);
        }
    };

    const loadContainers = async () => {
        // no need to fetch in create mode
        if(id == "new"){
            return;
        }
        try {
            const json = await fetchAllItemContainers(id);
            const containers:ContainmentModel[] = [];
            if(json.containers){
                for (const cont of json.containers){
                    containers.push(ContainmentModel.buildContainmentData(cont));
                }
            }
            setContainers(containers);
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the containers: ", e);
        }
    }

    useEffect(() => {
        loadCurrentItem();
        loadContainers();
    }, [id]);

    /**
     * Edit button click event
     */
    const handleEdit = () => {
        setEditItem(item); 
        setMode(modes.edit)
    };

    /**
     * Cancel button click event
     */
    const handleCancel = () => {
        if (id == "new"){
            navigate('/dashboard');
        } else {
            setMode(modes.display);
        }
    };

    /**
     * Handle submission of the item data
     * @param e event
     */
    const handleSubmit = async (e:any) => {
        e.preventDefault();

        try {
            const response = await (id=="new" ? createItem(editItem) : updateItem(id,editItem));
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                const json = await response.json();
                if(response.ok) {
                    if(id=="new"){
                        navigate(`/item/${json.id}`);
                        setSuccessAlertBody("Item Created!");
                    } else {
                        loadCurrentItem();
                        setSuccessAlertBody("Item Updated!");
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
            console.error("Failed to create item: ", e);
        }
    };

    // hijack pasting when the clipboard is raster data and pop it in the form field
    window.addEventListener('paste', e => {
        const fileInput = (document.getElementById("image") as HTMLInputElement);
        if(e.clipboardData !== null && e.clipboardData.files.length > 0){
            fileInput.files = e.clipboardData.files;
            setEditItem({
                ...editItem,
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
            <Row className={styles.item_details}>
                <Col md={12} lg={4}>
                    <Link to={item.image_url ? item.image_url : noImage} target="_blank" rel="noopener noreferrer">
                        <img src={item.image_url ? item.image_url : noImage} className={styles.item_image}/>
                    </Link>
                    {mode === modes.edit && <>
                    <Form.Group className="mb-3" controlId="image">
                        <Form.Label>Image:</Form.Label>
                        <Form.Control  
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                setEditItem({
                                    ...editItem,
                                    image: (e.target as HTMLInputElement).files?.[0]
                                });
                                console.log((e.target as HTMLInputElement).files?.[0]);
                            }}
                        />
                    </Form.Group>
                    </>}
                </Col>
                <Col md={12} lg={8} className={styles.item_attributes}>
                    <div className={styles.item_controls}>
                        <ButtonGroup>
                            {id != "new" &&
                            <Tooltip title="Back to Dashboard">
                                <Button variant="outline-primary" onClick={()=>{navigate('/dashboard')}}><FaArrowLeft/></Button>
                            </Tooltip>
                            }
                            {mode === modes.display && 
                            <Tooltip title="Edit Item">
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
                                deletion={deleteItem} 
                                title={item.description} 
                                id={item.id} 
                                buttonBody={<FaTrash/>} 
                                callback={()=>{navigate('/dashboard')}} 
                            /> 
                            }
                        </ButtonGroup>
                    </div>
                    {mode === modes.display && <>
                    <b>Description:</b> {item.description}<br/>
                    <b>Notes:</b> {item.notes}
                    </>}
                    {mode === modes.edit && <>
                    <Form className={styles.form_outer} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="descriptionInput">
                            <Form.Label>Description:</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={editItem.description} 
                                onChange={(e) => setEditItem({
                                    ...editItem, 
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
                                value={editItem.notes} 
                                onChange={(e) => setEditItem({
                                    ...editItem, 
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

            <Row className={styles.item_containers}>
                <h3>Containers</h3>
                <Col xs={12}>
                    <div className={styles.item_controls}>
                        <ButtonGroup>
                            <AddToContainerModal callback={loadContainers} itemId={id??'0'}/>
                        </ButtonGroup>
                        <span className={`d-none d-md-inline-block ${styles.dashboard_display_toggle}`}>{displayToggle}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                {containers.map((container:ContainmentModel) => (
                    <Col key={container.containerId} xs={12} md={displayMode == displayModes.grid ? 4 : 12} className={styles.container_card}>
                        <Container className={styles.container_card_inner}>
                            <Link to={`/container/${container.containerId}`}>
                            <Row>
                                <Col xs={4} md={displayMode == displayModes.grid ? 12 : 4} className={styles.container_image}>
                                    <img src={(container.container?.image_url) ? container.container.image_url : noImage} style={{maxHeight: '200px', maxWidth:'100%'}}/>
                                </Col>
                                <Col xs={8} md={displayMode == displayModes.grid ? 12 : 8}>
                                    <b>{container.container?.name}</b><hr/>
                                    Quantity: {container.quantity}<br/>
                                    Position: {container.position}
                                </Col>
                            </Row>
                            </Link>
                            <Row className={styles.container_card_controls}>
                                <Col xs={12} style={{textAlign:'right'}}>
                                    <ButtonGroup>
                                        <DeletionModal
                                            deletion={containerRemoveItem}
                                            id={item.id}
                                            title={`${item.description} from ${container.container?.name}`}
                                            parent={container.containerId}
                                            buttonSize='sm'
                                            buttonBody={<FaTrash/>}
                                            callback={loadContainers}
                                        />
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                ))}
            </Row>

        </Container>
    )
}

export default ItemPage