/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Accordion, Button, Container, Navbar, Offcanvas } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import styles from '../assets/styles/LeftNav.module.css';
import { ContainerModel } from "../shared/models/container.model";
import { CategoryModel } from "../shared/models/categories/category.model";
import ContextAwareToggle from "../shared/components/ContextAwareToggle";
import { fetchAllContainers } from "../shared/services/containers.service";
import { fetchAllCategories, fetchAllSubcategories } from "../shared/services/categories.service";
import { isAccordionKeyActive } from "../shared/utils/contextHelpers";
import { Checkbox, FormControlLabel } from "@mui/material";
import { SubcategoryModel } from "../shared/models/categories/subcategory.model";

const excludeRoutes = ["/", "/signup"];

/**
 * LeftNav component for nested container accordions
 * @param containerData the container represented by this component
 * @returns JSX.Element for the container
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
 * LeftNav component for the Category accordion item
 * @param categoryData the category represented by this component 
 * @returns JSX.Element for the category
 */
function CategoryNav({categoryData}:{categoryData:CategoryModel}) {
  const [subcategories, setSubcategories] = useState<SubcategoryModel[]>([]);

  const active = isAccordionKeyActive(categoryData.id);

  const fetchSubcategories = async (e:string) => {
    // if the accordion item for this container was already active and is now closing then we don't have to refresh data
    if(active) return; 

    try {
      let data = await fetchAllSubcategories(categoryData.id);
      if(data.subcategories){
        const subcategories = [];
        for(const s of data.subcategories){
          subcategories.push(SubcategoryModel.buildSubcategoryData(s));
        }

        setSubcategories(subcategories);
      }
    } catch(e) {
      console.error(e);
    }

  };

  return (
    <div className={styles.leftnav_acc_item}>
      <div className={styles.leftnav_acc_header}>
        <FormControlLabel className={styles.leftnav_category} label={categoryData.name} control={<Checkbox/>}/>
        <ContextAwareToggle eventKey={categoryData.id} callback={fetchSubcategories}/>
      </div>
      <Accordion.Collapse eventKey={categoryData.id}>
        <div className={styles.leftNav_subcategories}>
          {subcategories.map((subcategory:SubcategoryModel) => (<div><FormControlLabel label={subcategory.name} control={<Checkbox/>}/></div>))}
        </div>
      </Accordion.Collapse>
    </div>
  )
}

/**
 * LeftNav component
 * @returns JSX.Element for the nav bar
 */
function LeftNav() {
    const [show, setShow] = useState(false);
    const [containers, setContainers] = useState<ContainerModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    let location = useLocation();

    useEffect(() => {
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
       * Function to fetch categories
       */
      const fetchCategories = async () => {
        let data = await fetchAllCategories();
        if(data.categories){
          const categories = [];
          for(const c of data.categories){
            categories.push(CategoryModel.buildCategoryData(c));
          }

          setCategories(categories);
        }
      };

      if(excludeRoutes.indexOf(location.pathname) == -1){
        fetchContainers();
        fetchCategories();
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
          
        </Offcanvas.Header>
        <Offcanvas.Body className={styles.leftnav_body}>
          <div>
            <Offcanvas.Title>Containers</Offcanvas.Title>
            <Accordion alwaysOpen>
              {containers.map((container:ContainerModel) => (<ContainerNav key={container.id} containerData={container}/>))}
            </Accordion>
            <hr/>
            <Offcanvas.Title>Categories</Offcanvas.Title>
            <Accordion alwaysOpen>
              {categories.map((category:CategoryModel) => (<CategoryNav key={category.id} categoryData={category}/>))}
            </Accordion>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
        </>
    );
}

export default LeftNav