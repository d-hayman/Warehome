/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { Accordion, Alert, Button, Col, Container, Modal, Row } from 'react-bootstrap';
import { useState } from 'react';
import { listifyErrors } from '../../../shared/utils/responseHelpers';
import { isAccordionKeyActive } from '../../../shared/utils/contextHelpers';
import ContextAwareToggle from '../../../shared/components/ContextAwareToggle';
import styles from '../../../assets/styles/AddItem.module.css';
import { fetchItem, itemAddSubcategory, itemRemoveSubcategory } from '../../../shared/services/items.service';
import { FaListCheck } from 'react-icons/fa6';
import { CategoryModel } from '../../../shared/models/categories/category.model';
import { SubcategoryModel } from '../../../shared/models/categories/subcategory.model';
import { fetchAllCategories, fetchAllSubcategories } from '../../../shared/services/categories.service';
import { Checkbox, FormControlLabel } from '@mui/material';

/**
 * LeftNav component for the Category accordion item
 * @param categoryData the category represented by this component 
 * @returns JSX.Element for the category
 */
function CategoryNav({categoryData, selectedSubcategories, callback}
    :{categoryData:CategoryModel, selectedSubcategories:string[], callback:Function}) {
    const [subcategories, setSubcategories] = useState<SubcategoryModel[]>([]);
  
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
     * adds or removes a selected subcategory
     * @param id category id to add or remove
     * @returns void
     */
    const subcategoryCheck = (id: string) => {
      callback(id);
    }
  
    return (
      <div className={styles.leftnav_acc_item}>
        <div className={styles.leftnav_acc_header}>
          {categoryData.name}
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
 * User creation modal
 * @param param0 
 * @returns 
 */
function SelectItemCategoriesModal({callback, itemId}: {callback: Function, itemId:string}) {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

    const [visible, setVisible] = useState(false);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    
    /**
     * Calls the fetch API to populate the item data
     * @returns void
     */
    const loadCurrentItem = async () => {
        try {
            const json = await fetchItem(itemId);
            if(json.subcategories && Array.isArray(json.subcategories)) {
                setSelectedSubcategories(json.subcategories.map((s:any) => ""+s.id));
            }
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to fetch the item: ", e);
        }
    };

    /**
     * Function to fetch the top level categories
     */
    const loadCategories = async () => {
        try{
          let data = await fetchAllCategories();
          if(data.categories){
            const categories = [];
            for(const c of data.categories){
                categories.push(CategoryModel.buildCategoryData(c));
            }

            setCategories(categories);
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
        setSelectedSubcategories([]);
        setShowErrorAlert(false);
        loadCategories();
        loadCurrentItem();
        setVisible(true);
    };

    const handleCheck = async (subcategoryId:string) => {
        try{
            const response = await (selectedSubcategories.includes(""+subcategoryId) 
                ? itemRemoveSubcategory(itemId, subcategoryId)
                : itemAddSubcategory(itemId, subcategoryId));
            if(response === undefined) {
                setErrorAlertBody({error: "Malformed Data?"});
                setShowErrorAlert(true);
            } else {
                const json = await response.json();
                if(response.ok) {
                    setSelectedSubcategories(json.map((s:any) => ""+s.id));
                } else {
                    setErrorAlertBody(json);
                    setShowErrorAlert(true);
                }
            }
            
        } catch(e:any) {
            setErrorAlertBody({error: `${e}`});
            setShowErrorAlert(true);
            console.error("Failed to update the subcategory: ", e);
        }
    }

    /**
     * Handler to dismiss the modal
     */
    const handleCancel = () => {
        setVisible(false);
        callback();
    };

    return (
        <>
        <Button variant="outline-secondary" onClick={handleShow}><FaListCheck/></Button>

        <Modal
            show={visible}
            onHide={handleCancel}
            backdrop="static"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Select Item Categories</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                { showErrorAlert &&
                <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <ul>{listifyErrors(errorAlertBody)}</ul>
                </Alert>}
                <Container>
                    <Row>
                        <Col xs={12} className={styles.leftnav_body}>
                            <Accordion alwaysOpen>
                                {categories.map((category:CategoryModel) => (
                                    <CategoryNav 
                                        key={category.id} 
                                        categoryData={category}
                                        selectedSubcategories={selectedSubcategories}
                                        callback={handleCheck}
                                    />
                                ))}
                            </Accordion>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancel}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    )
}

export default SelectItemCategoriesModal;