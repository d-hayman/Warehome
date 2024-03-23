/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { MdGridView, MdList } from "react-icons/md";

enum displayModes {
    grid,
    list
}

function useDisplayModeToggle() {
    const [displayMode, setItemDisplay] = useState(displayModes.grid);
    
    const displayToggle = (
        <ButtonGroup>
            <ToggleButton
                id="item-grid"
                type="radio"
                value={displayModes.grid}
                checked={displayMode === displayModes.grid}
                variant="outline-primary"
                onChange={(_) => setItemDisplay(displayModes.grid)}
            >
                <MdGridView/>
            </ToggleButton>
            <ToggleButton
                id="item-list"
                type="radio"
                value={displayModes.list}
                checked={displayMode === displayModes.list}
                variant="outline-primary"
                onChange={(_) => setItemDisplay(displayModes.list)}
            >
                <MdList/>
            </ToggleButton>
        </ButtonGroup>
    );

    return {displayMode, displayToggle};
}

export {displayModes, useDisplayModeToggle};