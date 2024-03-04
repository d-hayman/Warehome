/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Accordion, Button, Container, Navbar, Offcanvas } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import styles from '../assets/styles/LeftNav.module.css';
import { ContainerModel } from "../shared/models/container.model";
import ContextAwareToggle from "../shared/components/ContextAwareToggle";
import { fetchAllContainers } from "../shared/services/containers.service";
import { isAccordionKeyActive } from "../shared/utils/contextHelpers";

const excludeRoutes = ["/", "/signup"];

/**
 * NavBar component for nested container accordions
 * @returns JSX.Element for the nav bar container
 */
function ContainerNav({containerData}:{containerData:ContainerModel}) {
  const [children, setChildren] = useState<ContainerModel[]>([]);

  const active = isAccordionKeyActive(containerData.id);
  
  /**
   * function to fetch child containers
   * @param e eventKey
   * @returns void
   */
  const fetchChildren = async (e:string) => {
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
        <Link to={`/container/${containerData.id}`}>{containerData.name}</Link>
        {containerData.children > 0 && <ContextAwareToggle eventKey={containerData.id} callback={fetchChildren}></ContextAwareToggle>}
      </div>
      <Accordion.Collapse eventKey={containerData.id}>

          <Accordion alwaysOpen>
              {children.map((container:ContainerModel) => (<ContainerNav key={container.id} containerData={container}/>))}
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

    let location = useLocation();

    useEffect(() => {
      /**
       * Function to fetch the top level containers
       */
      const fetchContainers = async () => {
        try{
          let data = await fetchAllContainers();
          if(data.containers){
            const containers = []
            for(const c of data.containers){
              containers.push(ContainerModel.buildContainerData(c));
            }

            setContainers(containers);
          }
        } catch (e) {
          console.error(e);
        }
      }

      if(excludeRoutes.indexOf(location.pathname) == -1){
        fetchContainers();
      }
    }, [location.pathname])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              {containers.map((container:ContainerModel) => (<ContainerNav key={container.id} containerData={container}/>))}
            </Accordion>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
        </>
    );
}

export default LeftNav