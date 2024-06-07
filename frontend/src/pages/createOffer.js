import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateTender = () => {
  const location = useLocation();
  const searchQuery = location.state?.shoeId;
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext);
  const [shoeData, setShoeData] = useState({});
  const acceptedOffer = location.state?.infor;
  const [acceptedInfo, setAcceptedInfo] = useState({});

  useEffect(() => {
    if (searchQuery) {
      fetchShoe(searchQuery.id);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (acceptedOffer) {
      setAcceptedInfo(acceptedOffer);
    }
  }, [acceptedOffer]);

  const fetchAcceptedShoe = async (shoeId, tenderId) => {
    const token = authTokens.access;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/accept-offer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          'id': shoeId,
          'tender_id': tenderId
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate('/');
      } else {
        console.error('Failed to accept offer:', response.statusText);
        alert('Something went wrong while accepting the offer.');
      }
    } catch (error) {
      console.error('Error accepting offer:', error);
      alert('Something went wrong while accepting the offer.');
    }
  };

  const fetchShoe = async (shoeId) => {
    const token = authTokens.access;
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/shoe/${shoeId}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setShoeData(data);
      } else {
        console.error('Failed to fetch shoe data:', response.statusText);
        alert('Something went wrong while fetching shoe data.');
      }
    } catch (error) {
      console.error('Error fetching shoe data:', error);
      alert('Something went wrong while fetching shoe data.');
    }
  };

  const submitTender = async (e) => {
    e.preventDefault();
    const token = authTokens.access;
    const formData = {
      price: e.target.price.value,
      size: shoeData.size,
      shoe: shoeData.id,
    };

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/create_tender/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log('data:', data);
      if (response.ok) {
        console.log('Tender Created Successfully');
        navigate('/');
      } else {
        alert('Something went wrong!!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  const submitTenders = async (e) => {
    
    e.preventDefault();
    const token = authTokens.access;

    const formData = {
      price: acceptedInfo.price,
      size: acceptedInfo.size,
      shoe: acceptedInfo.id,
    };

    console.log("Form data:", formData);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/create_tender/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log('data:', data);
      if (response.ok) {
        console.log('Tender Created Successfully');
        fetchAcceptedShoe(acceptedInfo.id, data.id);
      } else {
        alert('Something went wrong!!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div>
      <h1>{shoeData.name}</h1>
      {!acceptedOffer && 
      <form onSubmit={submitTender}>
        <p>Price:</p>
        <input type="number" name="price" placeholder="Enter Price" required />
        <button type="submit">Submit Tender</button>
      </form> 
      }

      {acceptedOffer && 
      <form onSubmit={submitTenders}>
        <p>Buying {shoeData.name} in this size {acceptedInfo.size} for this Price: {acceptedInfo.price}</p>
        <button type="submit">Submit Tender</button>
      </form> 
      }

    </div>
  );
}

export default CreateTender;
