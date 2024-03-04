/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { useContext } from "react";
import { AccordionContext } from "react-bootstrap";

function isAccordionKeyActive(eventKey:string) {
    const { activeEventKey } = useContext(AccordionContext);
  
    return (
        Array.isArray(activeEventKey) 
            ? activeEventKey.includes(eventKey) 
            : activeEventKey === eventKey);
  }

  export {isAccordionKeyActive};