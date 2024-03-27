/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { Button, Col, Container, Form, Row } from "react-bootstrap"
import Paginator from "../../shared/components/Pagination"
import styles from "../../assets/styles/Dashboard.module.css"
import noImage from '../../assets/img/imagenotfound.png';
import { useContext, useEffect, useState } from "react";
import { fetchAllItems } from "../../shared/services/items.service";
import { ItemModel } from "../../shared/models/item.model";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SearchContext } from "../../components/providers/SearchProvider";
import { Tooltip } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { displayModes, useDisplayModeToggle } from "../../shared/hooks/DisplayMode";
import { ObjectToValidParams } from "../../shared/utils/queryStringHelper";


/**
 * Dashboard Page
 * @returns JSX.Element for the dashboard
 */
function DashboardPage(){
    const [items, setItems] = useState<ItemModel[]>([]);

    const {displayMode, displayToggle} = useDisplayModeToggle();

    const [searchParams, setSearchParams] = useSearchParams();

    const initialPageFromURL = Number(searchParams.get("p") || 1);
    const [page, setPage] = useState(initialPageFromURL);
    const [itemsPerPage, setItemsPerPage] = useState(24);
    const [totalItems, setTotalItems] = useState(0);
    const [hasLoaded, setHasLoaded] = useState(false);

    const [orderBy, setOrderBy] = useState(searchParams.get("b")||"Created");

    const {searchQuery, selectedCategories, selectedSubcategories} = useContext(SearchContext);

    const navigate = useNavigate();

    /**
     * Calls the items fetch API
     */
    const loadItems = async () => {
        try{
            let data = await fetchAllItems(page, searchQuery, selectedCategories, selectedSubcategories, orderBy);
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

                setHasLoaded(true);
            }
        
        } catch(e) {
            console.error(e);
        }
    }

    // effect for item fetching - refetch on params change
    useEffect(() => {
        loadItems();
    }, [searchParams]);

    // 
    useEffect(() => {
        setSearchParams(
            ObjectToValidParams({
                p: page, 
                q: searchQuery,
                c: selectedCategories,
                s: selectedSubcategories,
                b: orderBy
            }) as unknown as URLSearchParams);
    }, [page])

    // effect for item fetching - refetch when search is submitted, on category selection
    useEffect(() => {
        if(page > 1 && hasLoaded){
            setPage(1); //loadItems called by page change effect
        } else {
            setSearchParams(
                ObjectToValidParams({
                    p: page, 
                    q: searchQuery,
                    c: selectedCategories,
                    s: selectedSubcategories,
                    b: orderBy
                }) as unknown as URLSearchParams);
        }
    }, [searchQuery, selectedCategories, selectedSubcategories, orderBy]);

    /**
     * Page change handler
     * @param page 
     */
    const handlePageChange = (page:number) => {
        setPage(page);
    }
    
    return (
        <Container className={styles.dashboard_outer}>
            <Row className={styles.dashboard_controls}>
                <Form.Group as={Col}></Form.Group>
                <Form.Group as={Col} className={`d-none d-xl-inline-block`}></Form.Group>
                <Form.Group as={Col} controlId="formGridState" style={{display:"inline-block"}}>
                    <Form.Select defaultValue="Created" onChange={(e) => setOrderBy(e.target.value)}>
                        <option>Created</option>
                        <option>Description</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} style={{paddingRight:'1rem'}}>
                    <Tooltip title="Create new item" style={{marginLeft:"1rem"}}>
                        <Button variant="outline-secondary" onClick={()=>{navigate(`/item/new`)}}>
                            <FaPlus/>
                        </Button>
                    </Tooltip>
                    <span className={`d-none d-md-inline-block`} style={{marginLeft:"1rem"}}>
                        {displayToggle}
                    </span>
                </Form.Group>
            </Row>
            <Row className="align-items-center">
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
                    <Col key={item.id} xs={12} md={displayMode == displayModes.grid ? 4 : 12} className={styles.item_card}>
                        <Container className={styles.item_card_inner}>
                        <Link to={`/item/${item.id}`}>
                            <Row>
                                <Col xs={4} md={displayMode == displayModes.grid ? 12 : 4} className={styles.item_image}>
                                    <img src={item.image_url ? item.image_url : noImage} style={{maxHeight: '200px', maxWidth:'100%'}}/>
                                </Col>
                                <Col xs={8} md={displayMode == displayModes.grid ? 12 : 8}>
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