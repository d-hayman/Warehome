/**
 * Copyright dhayman 2024 https://github.com/d-hayman/Warehome
 */
import { useState, createContext } from "react";

interface SearchContextValue {
    searchQuery: string;
    setSearch: (query: string) => void;
    selectedCategories: string[];
    setCategories: (categories: string[]) => void;
    searchSubmit: boolean;
    submit: () => void;
}

const SearchContext = createContext({} as SearchContextValue);

/**
 * 
 * @param param0 
 * @returns 
 */
const SearchProvider = ({ children }:{children:any}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [searchSubmit, setSearchSubmit] = useState(false);
  
    /**
     * Updates the search query and handles other applicable logic
     * @param query 
     */
    const setSearch = (query:string) => {
      setSearchQuery(query);
    };
  
    /**
     * Updates the category selection
     * @param categories 
     */
    const setCategories = (categories:string[]) => {
      setSelectedCategories(categories);
    };

    /**
     * Flips the submit bool to trigger any useEffect that watches the submit flag
     */
    const submit = () => {
        setSearchSubmit(!searchSubmit);
    }
  
    return (
      <SearchContext.Provider value={{ searchQuery, setSearch, selectedCategories, setCategories, searchSubmit, submit }}>
        {children}
      </SearchContext.Provider>
    );
  };
  
  export { SearchContext, SearchProvider };