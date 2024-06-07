import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { authTokens } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const submitSearchPrompt = async () => {
    const token = authTokens.access;
    
    try {
        const response = await fetch(`https://sneaker-database-stockx.p.rapidapi.com/simpleSearch?s=${searchQuery}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-RapidAPI-Key': '2eb8f2f484mshe50839032910f8bp11a324jsn2e2529676012',
                'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com'
            }
        });
        const data = await response.json();
        console.log('data:', data);
        if (response.ok) {
            console.log('Worked');
        } else {
            alert('Something went wrong!!');
        }
        console.log('response:', response);
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    console.log('Search query:', event.target.value); 
  };

  const handleSearchSubmit = () => {
    submitSearchPrompt(); // Call the search function
    console.log('Final search query:', searchQuery);
    navigate('/search', { state: { searchQuery } });
  };

  return (
    <div>
      <Link to="/">
        Home
      </Link>
      <span> | </span>
      <Link to="/login">
        Login
      </Link>
      <span> | </span>
      <Link to="/register">
        Register
      </Link>
      <span> | </span>
      <input 
        type="text" 
        placeholder="Search..." 
        value={searchQuery} 
        onChange={handleSearchChange} 
      />
      <button onClick={handleSearchSubmit}>Search</button>
    </div>
  );
};

export default Header;
