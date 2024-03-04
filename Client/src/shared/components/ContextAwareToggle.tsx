/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { useAccordionButton } from "react-bootstrap";
import PropTypes, {InferProps} from "prop-types";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { isAccordionKeyActive } from "../utils/contextHelpers";

/**
 * @param children: child elements
 * @param eventKey: string tied to the accordion item this controls
 * @param callback: function to be called after click
 */
const conextAwareTogglePropTypes = {
    children: PropTypes.any, 
    eventKey: PropTypes.string.isRequired, 
    callback:PropTypes.func
};

type conextAwareToggleTypes = InferProps<typeof conextAwareTogglePropTypes>;

function ContextAwareToggle({ children, eventKey, callback }: conextAwareToggleTypes) {
  
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey),
    );
  
    const isCurrentEventKey = isAccordionKeyActive(eventKey);
  
    return (
      <button
        type="button"
        style={{marginLeft:'auto', backgroundColor:'transparent'}}
        onClick={decoratedOnClick}
      >
        {children}
        {isCurrentEventKey ? <FaChevronDown/> : <FaChevronRight/>}
      </button>
    );
  }

  export default ContextAwareToggle;