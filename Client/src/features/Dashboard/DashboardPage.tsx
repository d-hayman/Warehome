/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { ButtonGroup, Col, Container, Row, ToggleButton } from "react-bootstrap"
import Paginator from "../../shared/components/Pagination"
import styles from "../../assets/styles/Dashboard.module.css"
import { useState } from "react"
import { MdGridView, MdList } from "react-icons/md";

/**
 * Dashboard Page
 * @returns JSX.Element for the dashboard
 */
function DashboardPage(){
    const [itemDisplay, setItemDisplay] = useState("1");
    const [page, setPage] = useState(1);
    
    return (
        <Container className={styles.dashboard_outer}>
            <Row>
                <Col xl={10} lg={12} sm={10}>
                    <Paginator
                        currentPage={page}
                        itemsPerPage={24}
                        totalItems={2400}
                        onPageChange={setPage}
                    />
                </Col>
                <Col xl={2} lg={12} sm={2} className={styles.dashboard_display_toggle}>
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
            {itemDisplay}
        </Container>
    )
}

export default DashboardPage