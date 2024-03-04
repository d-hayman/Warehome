/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Accordion, Button, Card, Col, Container, Navbar, Offcanvas } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import styles from '../assets/styles/LeftNav.module.css';
import { ContainerModel } from "../shared/models/container.model";
import ContextAwareToggle from "../shared/components/ContextAwareToggle";

const excludeRoutes = ["/", "/signup"];

/**
 * NavBar component for nested container accordions
 * @returns JSX.Element for the nav bar container
 */
function ContainerNav({data}:{data:ContainerModel}) {
  const [children, setChildren] = useState<ContainerModel[]>([]);
  
  useEffect(() => {
    let iId = parseInt( data.id);
    let conts = [ContainerModel.buildContainerData({id:''+(iId*3+1),name:'Closet'}),
                  ContainerModel.buildContainerData({id:''+(iId*3+2),name:'Cookie Jar'}),
                  ContainerModel.buildContainerData({id:''+(iId*3+3),name:'Test'})]

    setChildren(conts);

  }, [])

  if(parseInt( data.id) > 24)
  return (<>Nothing</>)
  
  return (
    <div className={styles.leftnav_acc_item}>
      <div className={styles.leftnav_acc_header}>
        <Link to={`/container/${data.id}`}>{data.name}</Link>
        <ContextAwareToggle eventKey={data.id}></ContextAwareToggle>
      </div>
      <Accordion.Collapse eventKey={data.id}>

          <Accordion alwaysOpen>
              {children.map((container:ContainerModel) => (<ContainerNav key={container.id} data={container}/>))}
            </Accordion>
      </Accordion.Collapse>
    </div>
  )
}

/**
 * NavBar component
 * @returns JSX.Element for the nav bar
 */
function LeftNav() {
    const [show, setShow] = useState(false);
    const [containers, setContainers] = useState<ContainerModel[]>([]);

    useEffect(() => {
      let conts = [ContainerModel.buildContainerData({id:'1',name:'Closet'}),
                    ContainerModel.buildContainerData({id:'2',name:'Cookie Jar'}),
                    ContainerModel.buildContainerData({id:'3',name:'Test'})]

      setContainers(conts);

    }, [])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let location = useLocation();

  if(excludeRoutes.indexOf(location.pathname) != -1){
    return (<>
    </>);
    }
    
    return (
        <>
        <Navbar bg="light" data-bs-theme="dark" className={`d-lg-none ${styles.leftnav_navbar}`}>
            <Container>
                <Button variant="secondary" onClick={handleShow}>
                    <MdMenu/>
                </Button>
            </Container>
        </Navbar>

      <Offcanvas show={show} onHide={handleClose} responsive="lg" className={styles.leftnav_top}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.leftnav_body}>
          <div>
            <Accordion alwaysOpen>
              {containers.map((container:ContainerModel) => (<ContainerNav key={container.id} data={container}/>))}
            </Accordion>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
        </>
    );
}

export default LeftNav