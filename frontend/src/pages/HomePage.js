import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [sellerExists, setSellerExists] = useState(false); // State to track if seller exists

  useEffect(() => {
    const getsellerData = async () => {
      const token = authTokens.access;
      const id = user.user_id;
      try {
        const response = await fetch('http://127.0.0.1:8000/api/basicuser/' + id + '/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setSellerExists(true); // Set to true if seller data is found
        } else if (response.status === 404) {
          setSellerExists(false); // Set to false if seller data is not found
        } else {
          alert('Something went wrong');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
      }
    };

    getsellerData();
  }, [authTokens.access]);

  return (
    <div>
      <p>
        You are logged in to the home page, {user.username}
      </p>
      <ul>
        <li>
          <Link to='/createBuyer'>
            Click Here to create and edit buyer
          </Link>
        </li>
        <li>
          <Link to='/createBasicUser'>
            Click Here to create and edit basic user
          </Link>
        </li>
        {sellerExists && (
          <li>
            <Link to='/createSeller'>
              Click Here to create and edit seller
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default HomePage;
