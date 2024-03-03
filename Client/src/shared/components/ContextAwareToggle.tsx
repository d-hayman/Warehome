/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { AccordionContext, useAccordionButton } from "react-bootstrap";
import PropTypes, {InferProps} from "prop-types";
import { useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

/**
 * @param title: name of the thing to be deleted
 * @param parent: id of the parent model record where applicable (e.g. DELETE /api/articles/:parentId/comments/:id)
 * @param id: id of the thing to be deleted
 * @param deletion: API service function which makes the delete request
 * @param callback: function to be called after deletion
 */
const conextAwareTogglePropTypes = {
    children: PropTypes.any, 
    eventKey: PropTypes.string.isRequired, 
    callback:PropTypes.func
};

type conextAwareToggleTypes = InferProps<typeof conextAwareTogglePropTypes>;

function ContextAwareToggle({ children, eventKey, callback }: conextAwareToggleTypes) {
    const { activeEventKey } = useContext(AccordionContext);
  
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey),
    );
  
    const isCurrentEventKey = (
        Array.isArray(activeEventKey) 
            ? activeEventKey.includes(eventKey) 
            : activeEventKey === eventKey);
  
    return (
      <button
        type="button"
        style={{marginLeft:'auto'}}
        onClick={decoratedOnClick}
      >
        {children}
        {isCurrentEventKey ? <FaChevronUp/> : <FaChevronDown/>}
      </button>
    );
  }

  export default ContextAwareToggle;