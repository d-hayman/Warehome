/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ButtonGroup, Card, Col, Container, Row, ToggleButton } from "react-bootstrap"
import Paginator from "../../shared/components/Pagination"
import styles from "../../assets/styles/Dashboard.module.css"
import noImage from '../../assets/img/imagenotfound.png';
import { useEffect, useState } from "react"
import { MdGridView, MdList } from "react-icons/md";
import { fetchAllItems } from "../../shared/services/items.service";
import { ItemModel } from "../../shared/models/item.model";
import { useSearchParams } from "react-router-dom";

/**
 * Dashboard Page
 * @returns JSX.Element for the dashboard
 */
function DashboardPage(){
    const [itemDisplay, setItemDisplay] = useState("1");
    const [items, setItems] = useState<ItemModel[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const initialPageFromURL = Number(searchParams.get("page") || 1);
    const [page, setPage] = useState(initialPageFromURL);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        /**
         * Calls the items fetch API
         */
        const loadItems = async () => {
            try{
                let data = await fetchAllItems(page);
                if(data.items){
                    const items = [];
                    for(const i of data.items){
                        items.push(ItemModel.buildItemData(i));
                    }

                    setItems(items);
                    setTotalItems(data.total_count);
                    setItemsPerPage(data.per_page);
                }
            } catch(e) {
                console.error(e);
            }
        }
        loadItems();
    }, [page]);

    /**
     * Page change handler
     * @param page 
     */
    const handlePageChange = (page:number) => {
        setPage(page);

        setSearchParams({page: page} as unknown as URLSearchParams)
    }
    
    return (
        <Container className={styles.dashboard_outer}>
            <Row>
                <Col xl={10} lg={12} md={10} xs={12}>
                    <Paginator
                        currentPage={page}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                    />
                </Col>
                <Col xl={2} lg={12} md={2} className={`d-none d-md-block ${styles.dashboard_display_toggle}`}>
                    <ButtonGroup>
                        <ToggleButton
                            id="item-grid"
                            type="radio"
                            value={"1"}
                            checked={itemDisplay === "1"}
                            variant="outline-primary"
                            onChange={(e) => setItemDisplay(e.currentTarget.value)}
                        >
                            <MdGridView/>
                        </ToggleButton>
                        <ToggleButton
                            id="item-list"
                            type="radio"
                            value={"2"}
                            checked={itemDisplay === "2"}
                            variant="outline-primary"
                            onChange={(e) => setItemDisplay(e.currentTarget.value)}
                        >
                            <MdList/>
                        </ToggleButton>
                    </ButtonGroup>
                </Col>
            </Row>
            <Row>
                {items.map((item:ItemModel) => (
                    <Col xs={12} md={itemDisplay == "1" ? 4 : 12} className={styles.item_card}>
                        <Container className={styles.item_card_inner}>
                            <Row>
                                <Col xs={4} md={itemDisplay == "1" ? 12 : 4}>
                                    <img src={item.image_url ? item.image_url : noImage} style={{maxWidth:'100%'}}/>
                                </Col>
                                <Col xs={8} md={itemDisplay == "1" ? 12 : 8}>
                                    <b>{item.description}</b><br/>
                                    {item.notes}
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default DashboardPage