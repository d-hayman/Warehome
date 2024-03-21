/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { Button, ButtonGroup, Col, Container, Form, Row, ToggleButton } from "react-bootstrap"
import Paginator from "../../shared/components/Pagination"
import styles from "../../assets/styles/Dashboard.module.css"
import noImage from '../../assets/img/imagenotfound.png';
import { useContext, useEffect, useState } from "react"
import { MdGridView, MdList } from "react-icons/md";
import { fetchAllItems } from "../../shared/services/items.service";
import { ItemModel } from "../../shared/models/item.model";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SearchContext } from "../../components/providers/SearchProvider";
import { Tooltip } from "@mui/material";
import { FaPlus } from "react-icons/fa";

enum modes {
    grid,
    list
}

/**
 * Dashboard Page
 * @returns JSX.Element for the dashboard
 */
function DashboardPage(){
    const [itemDisplay, setItemDisplay] = useState(modes.grid);
    const [items, setItems] = useState<ItemModel[]>([]);

    const [searchParams, setSearchParams] = useSearchParams();

    const initialPageFromURL = Number(searchParams.get("page") || 1);
    const [page, setPage] = useState(initialPageFromURL);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [totalItems, setTotalItems] = useState(0);

    const {searchQuery, selectedCategories, selectedSubcategories} = useContext(SearchContext);

    const navigate = useNavigate();

    /**
     * Calls the items fetch API
     */
    const loadItems = async () => {
        try{
            setSearchParams({page: page, q: searchQuery} as unknown as URLSearchParams);
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
            <Row className="align-items-center">
                <Col md={10} xs={12} className={styles.dashboard_display_toggle}>
                    <Form.Group controlId="formGridState" style={{display:"inline-block"}}>
                        <Form.Select defaultValue="Created">
                            <option>Created</option>
                            <option>Description</option>
                        </Form.Select>
                    </Form.Group>
                    <Tooltip title="Create new item" style={{marginTop:"-5px", marginLeft:"1rem"}}>
                        <Button variant="outline-secondary" onClick={()=>{navigate(`/item/new`)}}>
                            <FaPlus/>
                        </Button>
                    </Tooltip>
                </Col>
                <Col md={2} className={`d-none d-md-block ${styles.dashboard_display_toggle}`}>
                    <ButtonGroup>
                        <ToggleButton
                            id="item-grid"
                            type="radio"
                            value={modes.grid}
                            checked={itemDisplay === modes.grid}
                            variant="outline-primary"
                            onChange={(_) => setItemDisplay(modes.grid)}
                        >
                            <MdGridView/>
                        </ToggleButton>
                        <ToggleButton
                            id="item-list"
                            type="radio"
                            value={modes.list}
                            checked={itemDisplay === modes.list}
                            variant="outline-primary"
                            onChange={(_) => setItemDisplay(modes.list)}
                        >
                            <MdList/>
                        </ToggleButton>
                    </ButtonGroup>
                </Col>
                <Col xs={12} className={styles.dashboard_pagination}>
                    <Paginator
                        currentPage={page}
                        itemsPerPage={itemsPerPage}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                    />
                </Col>
            </Row>
            <Row>
                {items.map((item:ItemModel) => (
                    <Col key={item.id} xs={12} md={itemDisplay == modes.grid ? 4 : 12} className={styles.item_card}>
                        <Container className={styles.item_card_inner}>
                        <Link to={`/item/${item.id}`}>
                            <Row>
                                <Col xs={4} md={itemDisplay == modes.grid ? 12 : 4} className={styles.item_image}>
                                    <img src={item.image_url ? item.image_url : noImage} style={{maxHeight: '200px', maxWidth:'100%'}}/>
                                </Col>
                                <Col xs={8} md={itemDisplay == modes.grid ? 12 : 8}>
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