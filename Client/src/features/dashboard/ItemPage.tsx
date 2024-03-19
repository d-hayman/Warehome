/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ItemModel } from "../../shared/models/item.model";
import { Alert, Col, Container, Row } from "react-bootstrap";
import styles from "../../assets/styles/ItemPage.module.css";
import noImage from '../../assets/img/imagenotfound.png';
import { fetchItem } from "../../shared/services/items.service";
import { listifyErrors } from "../../shared/utils/responseHelpers";

function ItemPage () {
    const { id } = useParams();
    const [item, setItem] = useState<ItemModel>(new ItemModel());
    const [editItem, setEditItem] = useState(item);

    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorAlertBody, setErrorAlertBody] = useState<any>({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successAlertBody, setSuccessAlertBody] = useState<any>({});

    useEffect(() => {
        /**
         * Calls the fetch API to populate the category data
         * @returns void
         */
        const loadCurrentItem = async () => {
            // no need to fetch in create mode
            if(id == "new"){
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

        loadCurrentItem();
    }, [id]);
    
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
                <Col xs={4}>
                    <Link to={item.image_url ? item.image_url : noImage} target="_blank" rel="noopener noreferrer">
                        <img src={item.image_url ? item.image_url : noImage} className={styles.item_image}/>
                    </Link>
                </Col>
                <Col xs={8} className={styles.item_attributes}>
                    <b>Description:</b> {item.description}<br/>
                    <b>Notes:</b> {item.notes}
                </Col>
            </Row>

        </Container>
    )
}

export default ItemPage