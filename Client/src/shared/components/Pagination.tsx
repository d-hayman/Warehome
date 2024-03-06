/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import PropTypes, {InferProps} from "prop-types";
import { Pagination } from "react-bootstrap";
import styles from "./Pagination.module.css"

/**
 * @param currentPage the current page, of course
 * @param totalItems the number of records applicable to the request if page number and count per page were not factors
 * @param itemsPerPage the max number of records to request at a time
 * @param onPageChange the function to call for requesting the next set of records whenever a page change occurs
 */
const paginationPropTypes = {
    currentPage: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired
};

type paginationTypes = InferProps<typeof paginationPropTypes>;

/**
 * Creates a series of buttons for pages based on data returned from a paginated request
 * @param param0 object of the type derived from paginationPropTypes
 *  @param currentPage the current page, of course
 *  @param totalItems the number of records applicable to the request if page number and count per page were not factors
 *  @param itemsPerPage the max number of records to request at a time
 *  @param onPageChange the function to call for requesting the next set of records whenever a page change occurs
 * @returns 
 */
function Paginator({ currentPage, totalItems, itemsPerPage, onPageChange }: paginationTypes) {
    const totalPages = Math.ceil(totalItems/itemsPerPage);

    /**
     * First page button event
     */
    const handleFirst = () => {
        if(currentPage > 1) {
            onPageChange(1);
        }
    }

    /**
     * Previous page button event
     */
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    }

    /**
     * Next page button event
     */
    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    }

    /**
     * Last page button event
     */
    const handleLast = () => {
        if ( currentPage < totalPages) {
            onPageChange(totalPages);
        }
    }

    /**
     * Based on the calculated total number of pages 
     * @returns An array of numbers and ellipses to be used to render the relevant buttons
     */
    const getVisiblePageNumbers = () => {
        const lastPageBeforeEllipsis = 8;

        if(totalPages <= 10) {
            return createRange(1, totalPages);
        }

        if(currentPage <= 6){
            return [...createRange(1, lastPageBeforeEllipsis), "...", totalPages];
        }

        if(currentPage >= totalPages - 5){
            return [1, "...", ...createRange(totalPages - lastPageBeforeEllipsis, totalPages)];
        }

        return [1, "...", ...createMiddlePages(), "...", totalPages];
    }

    /**
     * generates a range of numbers from start to end
     * @param start 
     * @param end 
     * @returns 
     */
    const createRange = (start:number, end:number) => {
        return Array.from({ length: end - start + 1 }, (_, i) => i + start);
    }

    /**
     * Calculate the start and end of the middle group of pages for larger paginators
     * @returns middle array of pages
     */
    const createMiddlePages = () => {
        const middlePagesStart = Math.max(2, currentPage - 3);
        const middlePagesEnd = Math.min(currentPage + 3, totalPages - 1);

        return createRange(middlePagesStart, middlePagesEnd);
    }

    /**
     * Makes the page number button
     * @param page page number of ellipsis to render
     * @param index index in the array of page numbers and ellipses
     * @returns JSX.Element
     */
    const makeButton = (page: any, index: number) => {
        return (
            typeof page === "number" ? (
                <Pagination.Item className={styles.middle_item}
                    key={page}
                    onClick={() => onPageChange(page)}
                    active={currentPage === page}
                >
                    {page}
                </Pagination.Item>
            ) : (
                <Pagination.Ellipsis key={"ellipsis"+index}/>
            )
        )
    }

    return (
        <span className={styles.pagination_outer}>
            <Pagination className={styles.pagination_segment}>
                <Pagination.First onClick={handleFirst} disabled={currentPage === 1}/>
                <Pagination.Prev onClick={handlePrevious} disabled={currentPage === 1} />
                {getVisiblePageNumbers().slice(0, 6).map((page: any, index: number) => 
                    makeButton(page, index)
                )}
            </Pagination>
            
            <Pagination className={styles.pagination_segment}>
            {getVisiblePageNumbers().slice(6).map((page: any, index: number) => 
                    makeButton(page, index)
                )}

                <Pagination.Next onClick={handleNext} disabled={currentPage === totalPages || totalItems === 0} />
                <Pagination.Last onClick={handleLast} disabled={currentPage === totalPages || totalItems === 0} />
            </Pagination>
        </span>
    );
}

export default Paginator;