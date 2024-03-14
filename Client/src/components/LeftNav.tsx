/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useContext, useEffect, useState } from "react";
import { Accordion, Button, Container, Navbar, Offcanvas } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import { Link, Outlet, useLocation } from "react-router-dom";
import styles from '../assets/styles/LeftNav.module.css';
import { ContainerModel } from "../shared/models/container.model";
import { CategoryModel } from "../shared/models/categories/category.model";
import ContextAwareToggle from "../shared/components/ContextAwareToggle";
import { fetchAllContainers } from "../shared/services/containers.service";
import { fetchAllCategories, fetchAllSubcategories } from "../shared/services/categories.service";
import { isAccordionKeyActive } from "../shared/utils/contextHelpers";
import { Checkbox, FormControlLabel } from "@mui/material";
import { SubcategoryModel } from "../shared/models/categories/subcategory.model";
import { SearchContext } from "./providers/SearchProvider";

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

  const {selectedCategories, emitCategories, selectedSubcategories, emitSubcategories} = useContext(SearchContext);

  const active = isAccordionKeyActive(categoryData.id);

  /**
   * 
   * @param e 
   * @returns 
   */
  const fetchSubcategories = async (_:string) => {
    // if the accordion item for this category was already active and is now closing then we don't have to refresh data
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

  /**
   * adds or removes a selected category
   * @param id category id to add or remove
   * @returns void
   */
  const categoryCheck = (id: string) => {
    if(selectedCategories.includes(id)){
      emitCategories(selectedCategories.filter((s) => s != id));
      return;
    }
    emitCategories([...selectedCategories, id]);
  }

  /**
   * adds or removes a selected subcategory
   * @param id subcategory id to add or remove
   * @returns void
   */
  const subcategoryCheck = (id: string) => {
    if(selectedSubcategories.includes(id)){
      emitSubcategories(selectedSubcategories.filter((s) => s != id));
      return;
    } 
    emitSubcategories([...selectedSubcategories, id]);
  }

  return (
    <div className={styles.leftnav_acc_item}>
      <div className={styles.leftnav_acc_header}>
        <FormControlLabel 
          className={styles.leftnav_category} 
          label={categoryData.name} 
          control={
            <Checkbox 
              id={""+categoryData.id}
              value={""+categoryData.id}
              checked={selectedCategories.includes(""+categoryData.id)}
              onClick={(e) => {e.preventDefault(); categoryCheck(""+categoryData.id)}}
            />
          }
        />
        <ContextAwareToggle eventKey={categoryData.id} callback={fetchSubcategories}/>
      </div>
      <Accordion.Collapse eventKey={categoryData.id}>
        <div className={styles.leftNav_subcategories}>
          {subcategories.map((subcategory:SubcategoryModel) => 
            (
              <div key={subcategory.id}>
                <FormControlLabel 
                  label={subcategory.name} 
                  control={
                    <Checkbox
                      id={""+subcategory.id}
                      value={""+subcategory.id}
                      checked={selectedSubcategories.includes(""+subcategory.id)}
                      onClick={(e) => {e.preventDefault(); subcategoryCheck(""+subcategory.id)}}
                    />
                  }
                />
              </div>
            )
          )}
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

      fetchContainers();
      fetchCategories();
    }, [location.pathname])

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    
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
      
      <div style={{flex:1}}>
        <Outlet/>
      </div>
    </>
  );
}

export default LeftNav