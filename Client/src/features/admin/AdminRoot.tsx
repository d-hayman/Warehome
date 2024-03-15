/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { Grid, Paper } from "@mui/material";
import { Container } from "react-bootstrap";
import { IconType } from "react-icons";
import { FaTools, FaUser } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { Link } from "react-router-dom";

class Tile {
    public icon!: IconType;
    public title: string = '';
    public link: string = '';
}

function AdminRoot () {

    const tiles:Tile[] = [
        {icon:FaUser,title:"Users",link:"users"},
        {icon:FaTools,title:"Roles",link:"roles"},
        {icon:MdCategory,title:"Categories",link:"categories"}
    ];

    return (
        <Container>
        <Grid container justifyContent="left" spacing={2} style={{marginTop:"unset", paddingLeft:'1rem', paddingRight:'1rem'}}>
            {tiles.map((value) => (
                <Grid item xs={4} sm={3} md={2} key={value.title}>
                    <Link to={`/admin/${value.link}`} style={{textDecoration:"none"}}>
                        <Paper
                            sx={{
                            height: 150,
                            paddingTop: 3
                            }}
                        >
                            {<value.icon size={70}/>}<br/>
                            {value.title}
                        </Paper>
                    </Link>
                </Grid>
            ))}
      </Grid>
      </Container>
    )
}

export default AdminRoot;