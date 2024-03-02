/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useState } from "react";
import { Button, Col, Container, Navbar, Offcanvas } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import { useLocation } from "react-router-dom";
import styles from '../assets/styles/LeftNav.module.css';

const excludeRoutes = ["/", "/signup"];

/**
 * NavBar component
 * @returns JSX.Element for the nav bar
 */
function LeftNav() {
    const [show, setShow] = useState(false);

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
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
            This is content within an <code>.offcanvas-lg</code>.<br/>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
        </>
    );
}

export default LeftNav