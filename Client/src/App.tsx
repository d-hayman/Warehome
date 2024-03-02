import { BrowserRouter as Router } from 'react-router-dom';
import './App.css'
//import NavBar from "./components/NavBar";
import AppRoutes from './components/AppRoutes';
import NavBar from './components/NavBar';
import LeftNav from './components/LeftNav';

function App() {

  return (
    <Router>
      <div className='app'>
        <NavBar/>
        <div className='app_body'>
          <LeftNav/>
          <AppRoutes />
        </div>
      </div>
    </Router>
  )
}

export default App
