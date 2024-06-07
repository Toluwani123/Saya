import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const CreateBasicUser = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [sellerInd, setSellerInd] = useState(false);
  const [saveSeller, setSaveSeller] = useState(null);

  const handleCheckboxChange = () => {
    setSellerInd(!sellerInd);
  };

  const submitBasicUser = async (e) => {
    e.preventDefault();
    const token = authTokens.access;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create-basic-user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          'user': user.user_id,
          'selling': sellerInd, // Corrected field name
        }),
      });

      const data = await response.json();

      console.log('data:', data);
      if (response.status === 201) {
        setSaveSeller(data.selling); // Update state with response data
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

  useEffect(() => {
    // Fetch the data when the component mounts
    const getbasicuserData = async () => {
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
          setSaveSeller(data.selling); // Update state with response data
        } else {
          alert('Something went wrong');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
      }
    };

    getbasicuserData();
  }, [authTokens.access]);

  useEffect(() => {
    // Synchronize sellerInd with saveSeller when saveSeller is updated
    if (saveSeller !== null) {
      setSellerInd(saveSeller);
    }
  }, [saveSeller]);

  const editBasicUser = async (e) => {
    e.preventDefault();
    const token = authTokens.access;
    const id = user.user_id;
    try {
      const response = await fetch('http://127.0.0.1:8000/api/basicuser/' + id + '/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          'selling': sellerInd, // Corrected field name
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSaveSeller(data.selling); // Update state with response data
        console.log(data);
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div>
      <p>Hello {user.username}</p>
      <p>Seller: {saveSeller !== null ? saveSeller.toString() : 'Loading...'}</p> 

      <form onSubmit={submitBasicUser}>
        <p>Seller:</p>
        <input 
          type='checkbox' 
          name='seller' 
          checked={sellerInd} 
          onChange={handleCheckboxChange} 
        />
        <label htmlFor='seller'> Yes</label>
        <input type='submit' name='submit' />
      </form>
      <form onSubmit={editBasicUser}>
        <button type="submit">Edit Basic User</button>
      </form>
    </div>
  );
};

export default CreateBasicUser;
