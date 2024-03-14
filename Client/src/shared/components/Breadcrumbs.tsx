/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */

import { Container } from "react-bootstrap";
import { Link, Outlet, useLocation } from "react-router-dom";

/**
 * Creates an array of sub paths up to the path fro back navigation
 * e.g. /admin/categories/1 will result in /admin, /admin/categories, and /admin/categories/1
 * @param path path to break up
 * @returns all subpaths up to path
 */
function makeSubpaths(path:string): string[]{
  const subpaths = [];
  let current = "";

  for(const part of path.split('/')){
    if(part){
      current+=("/"+part);
      subpaths.push(current);
    }
  }

  return subpaths;
}

/**
 * Route element wrapper to prepend a set of routes with links to parent routes
 * @param param0 
 * @returns 
 */
const Breadcrumbs = () => {

    const location = useLocation();
  
    return (
      <>
        <Container style={{textAlign:"left", marginTop:"1rem", marginBottom:"1rem"}}>
          {
          makeSubpaths(location.pathname)
          .map(
            (path, i, row) => {
              if(row.length === i+1){
                return(<>
                  {path.substring(path.lastIndexOf('/')+1)}
                </>)
              } else {
                return(<>
                  <Link 
                    to={path} 
                    style={{color:"black"}}>
                      {path.substring(path.lastIndexOf('/')+1)}
                  </Link>
                  {" > "}
                </>)
              }
            }
          )}
        </Container>
        <Outlet/>
      </>
    );
  };
  
  export default Breadcrumbs;