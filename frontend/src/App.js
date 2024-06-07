import './App.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'
import {Routes, Route} from "react-router-dom";
import React, {Fragment} from 'react';
import Header from './components/Header'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext';
import Register from './pages/Register'
import CreateBuyer from './pages/createBuyer';
import CreateBasicUser from './pages/createBasicUser';
import CreateSeller from './pages/createSeller'
import SearchPage from './pages/searchPage'
import ShoePage from './pages/shoePage'
import CreateShoe from './pages/createShoe'
import CreateTender from './pages/createOffer'
import CreateShoeOffer from './pages/createShoeOffer'
function App() {
  return (
    <div className="App">
      <Fragment>
        <Header/>
        
        
        
        <Routes>

        <Route path="/register" element={<Register/>}/>
          
          
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/createshoe" element={<CreateShoe/>}/>
          <Route path="/createoffer" element={<CreateTender/>}/>
          <Route path="/shoe" element={<ShoePage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/createBuyer" element={<CreateBuyer/>}/>
          <Route path="/createBasicUser" element={<CreateBasicUser/>}/>
          <Route path="/createSeller" element={<CreateSeller/>}/>
          <Route path="/create_offer" element={<CreateShoeOffer/>}/>
          

          <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/' element={<HomePage/>}/>
          </Route>
          

         
          
         
          
        </Routes>
      </Fragment>
      
    </div>
  );
}

export default App;
