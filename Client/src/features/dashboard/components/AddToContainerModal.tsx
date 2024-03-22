/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { FaPlus } from 'react-icons/fa';
import { containerAddItem, fetchAllContainers } from '../../../shared/services/containers.service';
import { Accordion, Alert, Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useState } from 'react';
import { listifyErrors } from '../../../shared/utils/responseHelpers';
import { ContainmentModel } from '../../../shared/models/containment.model';
import { ContainerModel } from '../../../shared/models/container.model';
import { isAccordionKeyActive } from '../../../shared/utils/contextHelpers';
import ContextAwareToggle from '../../../shared/components/ContextAwareToggle';
import styles from '../../../assets/styles/AddItem.module.css';
import noImage from '../../../assets/img/imagenotfound.png';

/**
 * LeftNav component for nested container accordions
 * @param containerData the container represented by this component
 * @returns JSX.Element for the container
 */
function ContainerNav({containerData, selectedContainer, setSelectedContainer}
    :{containerData:ContainerModel, selectedContainer: string, setSelectedContainer:Function}) {
    const [children, setChildren] = useState<ContainerModel[]>([]);
  
    const active = isAccordionKeyActive(containerData.id);
    
    /**
     * function to fetch child containers
     * @param e eventKey
     * @returns void
     */
    const fetchChildren = async (_:string) => {
      // if the accordion item for this container was already active and is now closing then we don't have to refresh data
      if(active) return; 
  
      try{
        let data = await fetchAllContainers(containerData.id);
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
    
    return (
      <div className={styles.leftnav_acc_item}>
        <div className={styles.leftnav_acc_header}>
            <span onClick={()=>{setSelectedContainer(containerData.id)}} style={{cursor: 'pointer', textDecoration:selectedContainer == containerData.id ? 'underline' : 'unset'}}>
                <img src={containerData.image_url ? containerData.image_url : noImage} className={styles.container_image}/>
                {containerData.name}
            </span>
          {containerData.children > 0 && <ContextAwareToggle eventKey={containerData.id} callback={fetchChildren}></ContextAwareToggle>}
        </div>
        <Accordion.Collapse eventKey={containerData.id}>
  
            <Accordion alwaysOpen>
                {children.map((container:ContainerModel) => (
                    <ContainerNav 
                        key={container.id} 
                        containerData={container} 
                        selectedContainer={selectedContainer}
                        setSelectedContainer={setSelectedContainer}
                    />
                ))}
              </Accordion>
        </Accordion.Collapse>
      </div>
    )
  }

/**
 * User creation modal
 * @param param0 
 * @returns 
 */
function AddToContainerModal({callback, itemId}: {callback: Function, itemId:string}) {
    const [containment, setContainment] = useState(new ContainmentModel());
    
    const [containers, setContainers] = useState<ContainerModel[]>([]);
    const [selectedContainer, setSelectedContainer] = useState('');

    const [visible, setVisible] = useState(false);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});

    /**
     * Function to fetch the top level containers
     */
    const fetchContainers = async () => {
        try{
          let data = await fetchAllContainers();
          if(data.containers){
            const containers = [];
            for(const c of data.containers){
              containers.push(ContainerModel.buildContainerData(c));
            }

            setContainers(containers);
          }
        } catch (e) {
          console.error(e);
        }
      };

    /**
     * Handler to display the modal
     * @param e 
     */
    const handleShow = (e: any) => {
        e.preventDefault();
        setContainment(new ContainmentModel());
        setSelectedContainer('');
        setShowErrorAlert(false);
        fetchContainers();
        setVisible(true);
    };

    /**
     * Handler to dismiss the modal
     */
    const handleCancel = () => {
        setVisible(false);
    };

    /**
     * Handler to save the user
     * @returns 
     */
    const handleConfirm = async () => {
        if (containment.quantity < 1 || !selectedContainer)
            return;
        try {
            const response = await (containerAddItem(selectedContainer, itemId, containment));
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                if (response.ok) {
                    setVisible(false);
                    callback();
                } else {
                    const json = await response.json();
                    setErrorAlertBody(json);
                    setShowErrorAlert(true);
                }
            }
        } catch (e) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error(`Failed to add item: `, e);
        }
    };

    return (
        <>
        <Button variant="outline-secondary" onClick={handleShow}><FaPlus/></Button>

        <Modal
            show={visible}
            onHide={handleCancel}
            backdrop="static"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Item to Container</Modal.Title>
            </Modal.Header>
            <Modal.Body 
                onKeyDown={(e) => {
                    if (e.code === "Enter") {
                    e.preventDefault();
                    handleConfirm();
                    }
                }}>
                { showErrorAlert &&
                <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <ul>{listifyErrors(errorAlertBody)}</ul>
                </Alert>}
                <Container>
                    <Row>
                        <Col xs={12}>
                            <Form>
                                <Form.Group className="mb-3" controlId="quantityInput">
                                    <Form.Label>Quantity:</Form.Label>
                                    <Form.Control 
                                        type="number" 
                                        value={containment.quantity} 
                                        onChange={(e) => setContainment({
                                            ...containment, quantity:parseInt(e.target.value)
                                        })} 
                                        required 
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="positionInput">
                                    <Form.Label>Position:</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        value={containment.position} 
                                        onChange={(e) => setContainment({
                                            ...containment, position:e.target.value
                                        })} 
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={12} className={styles.leftnav_body}>
                            <Accordion alwaysOpen>
                                {containers.map((container:ContainerModel) => (
                                    <ContainerNav 
                                        key={container.id} 
                                        containerData={container}
                                        selectedContainer={selectedContainer}
                                        setSelectedContainer={setSelectedContainer}
                                    />
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default AddToContainerModal;