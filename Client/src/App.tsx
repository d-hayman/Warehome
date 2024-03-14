import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
//import NavBar from "./components/NavBar";
import AppRoutes from './components/AppRoutes';
import NavBar from './components/NavBar';
import LeftNav from './components/LeftNav';
import { SearchProvider } from './components/providers/SearchProvider';

function App() {

  return (
    <SearchProvider>
    <Router>
          <AppRoutes />
    </Router>
    </SearchProvider>
  )
}

export default App
