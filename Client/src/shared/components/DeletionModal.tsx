/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { useState } from 'react';
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes, {InferProps} from "prop-types";

/**
 * @param title: name of the thing to be deleted
 * @param parent: id of the parent model record where applicable (e.g. DELETE /api/articles/:parentId/comments/:id)
 * @param id: id of the thing to be deleted
 * @param deletion: API service function which makes the delete request
 * @param callback: function to be called after deletion
 */
const deleteModalPropTypes = {
    title: PropTypes.string.isRequired, 
    parent: PropTypes.string, 
    id: PropTypes.string.isRequired, 
    deletion: PropTypes.func.isRequired, 
    callback:PropTypes.func
};

type deleteModalTypes = InferProps<typeof deleteModalPropTypes>;

/**
 * A modal for confirming if a user would like to delete a record handled by a prepackaged button
 * @param param0: object of type derived from deleteModalPropTypes
 *  @param title: name of the thing to be deleted
 *  @param parent: id of the parent model record where applicable (e.g. DELETE /api/articles/:parentId/comments/:id)
 *  @param id: id of the thing to be deleted
 *  @param deletion: API service function which makes the delete request
 *  @param callback: function to be called after deletion
 * @returns JSX.Element containing a delete button and a confirmation prompt modal
 */
function DeletionModal({ title, parent, id, deletion, callback }: deleteModalTypes) {
    const [visible, setVisible] = useState(false);

    /**
     * Display the deletion modal when the button is clicked
     * @param e event
     */
    const handleShow = (e: any) => {
        e.preventDefault();
        setVisible(true);
    };

    /**
     * Call the deletion function and hide the modal when the Confirm button is clicked
     */
    const handleConfirm = () => {
        doDelete();
        setVisible(false);
    };

    /**
     * Hide the modal when the cancel button is clicked
     */
    const handleCancel = () => {
        setVisible(false);
    };

    /**
     * Call the deletion function with the id of the record to be deleted and, where applicable, the parent id. 
     * Then execute the callback if one is defined
     */
    const doDelete = async () => {
        try {
            if(parent !== undefined)
                await deletion(parent, id);
            else
                await deletion(id);
            if(typeof callback === "function") {
                callback();
            }
        } catch (e) {
            console.error("Failed to delete: ", e);
        }
    };

    return (
        <>
            <Button variant="outline-danger" onClick={handleShow}>Delete</Button>

            <Modal
                show={visible}
                onHide={handleCancel}
                backdrop="static"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you really want to Delete?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
;

export default DeletionModal;
