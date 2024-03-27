/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { useState, createContext } from "react";
import { Outlet, useSearchParams } from "react-router-dom";

interface SearchContextValue {
    searchQuery: string;
    emitSearch: (query: string) => void;
    selectedCategories: string[];
    emitCategories: (categories: string[]) => void;
    selectedSubcategories: string[];
    emitSubcategories: (categories: string[]) => void;
}

const SearchContext = createContext({} as SearchContextValue);

/**
 * 
 * @param param0 
 * @returns 
 */
const SearchProvider = () => {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q")||'');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  
    /**
     * Updates the search query and handles other applicable logic
     * @param query 
     */
    const emitSearch = (query:string) => {
      setSearchQuery(query);
    };
  
    /**
     * Updates the category selection
     * @param categories 
     */
    const emitCategories = (categories:string[]) => {
      setSelectedCategories(categories);
    };
  
    /**
     * Updates the subcategory selection
     * @param subcategories 
     */
    const emitSubcategories = (subcategories:string[]) => {
      setSelectedSubcategories(subcategories);
    };
  
    return (
      <SearchContext.Provider value={{ 
        searchQuery, emitSearch, 
        selectedCategories, emitCategories, 
        selectedSubcategories, emitSubcategories, 
      }}>
          <Outlet/>
      </SearchContext.Provider>
    );
  };
  
  export { SearchContext, SearchProvider };