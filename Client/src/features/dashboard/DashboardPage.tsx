/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ButtonGroup, Col, Container, Row, ToggleButton } from "react-bootstrap"
import Paginator from "../../shared/components/Pagination"
import styles from "../../assets/styles/Dashboard.module.css"
import noImage from '../../assets/img/imagenotfound.png';
import { useContext, useEffect, useState } from "react"
import { MdGridView, MdList } from "react-icons/md";
import { fetchAllItems } from "../../shared/services/items.service";
import { ItemModel } from "../../shared/models/item.model";
import { Link, useSearchParams } from "react-router-dom";
import { SearchContext } from "../../components/providers/SearchProvider";

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

    const {searchQuery, selectedCategories, selectedSubcategories} = useContext(SearchContext);

    /**
     * Calls the items fetch API
     */
    const loadItems = async () => {
        try{
            let data = await fetchAllItems(page, searchQuery, selectedCategories, selectedSubcategories);
            if(data.items){
                const items = [];
                for(const i of data.items){
                    items.push(ItemModel.buildItemData(i));
                }

                setItems(items);
                setTotalItems(data.total_count);
                setItemsPerPage(data.per_page);

                if(page > 1 && items.length == 0){
                    setPage(1);
                }
            }
        
            setSearchParams({page: page, q: searchQuery} as unknown as URLSearchParams);
        } catch(e) {
            console.error(e);
        }
    }

    // effect for item fetching - refetch on page change
    useEffect(() => {
        loadItems();
    }, [page]);

    // effect for item fetching - refetch when search is submitted, on category selection
    useEffect(() => {
        if(page > 1){
            setPage(1); //loadItems called by page change effect
        } else {
            loadItems();
        }
    }, [searchQuery, selectedCategories, selectedSubcategories]);

    /**
     * Page change handler
     * @param page 
     */
    const handlePageChange = (page:number) => {
        setPage(page);
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
                    <Col key={item.id} xs={12} md={itemDisplay == "1" ? 4 : 12} className={styles.item_card}>
                        <Container className={styles.item_card_inner}>
                        <Link to={`/item/${item.id}`}>
                            <Row>
                                <Col xs={4} md={itemDisplay == "1" ? 12 : 4}>
                                    <img src={item.image_url ? item.image_url : noImage} style={{maxHeight: '200px', maxWidth:'100%'}}/>
                                </Col>
                                <Col xs={8} md={itemDisplay == "1" ? 12 : 8}>
                                    <b>{item.description}</b><br/>
                                    {item.notes}
                                </Col>
                            </Row>
                        </Link>
                        </Container>
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default DashboardPage