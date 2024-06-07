import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ShoePage = () => {
  const { authTokens } = useContext(AuthContext);
  const location = useLocation();
  const searchQuery = location.state?.shoeValues;
  const navigate = useNavigate();
  const [shoeValues, setShoeValues] = useState({});
  const [existingTender, setExistingTender] = useState(false);
  const [existingTenders, setExistingTenders] = useState(false);
  const [selectedSize, setSelectedSize] = useState('m12');
  const [sizePrices, setSizePrices] = useState({});
  const [tenders, setTenders] = useState({});

  const handleClick = () => {
    fetchShoe(shoeValues.name);
  };

  const handleClicks = () => {
    if (existingTender) {
      let prices = {};
      for (const size in shoeValues.more_info) {
        console.log(`Prices for size ${size}:`);
        const sizeInfos = shoeValues.more_info[size];
        for (const priceInfo of sizeInfos) {
          console.log(`Price: ${priceInfo[1]}, Seller: ${priceInfo[0]}, Id: ${priceInfo[2]}, Name: ${priceInfo[3]}`);
          prices[size] = [priceInfo[1], priceInfo[2], priceInfo[3]]; // Assign the price and id for the size
        }
      }
      setSizePrices(prices); // Update state outside the loop
    } else {
      newShoeFunct();
    }
  };

  const handleClicker = (id, size, price, name) => {
    navigate('/create_offer', { state: { offer_datas: { shoe_id: id, shoe_size: size, shoe_price: price, shoe_name: name } } });
  };

  const sizeChart = () => {
    setExistingTender(!existingTender);
    console.log(existingTender);
  };

  const usedShoeFunct = (id, size) => {
    navigate('/create_offer', { state: { offer_data: { shoe_id: id, shoe_size: size } } });
  };

  const newShoeFunct = async () => {
    const token = authTokens.access;
    const formData = {
      colorway: shoeValues.colorway || '', // Provide default values if necessary
      name: shoeValues.name || '',
      brand: shoeValues.brand || '',
      size: selectedSize || 'm12',
      year_made: shoeValues.release_date ? shoeValues.release_date.substring(0, 4) : '2023',
      used: false, // Assuming 'used' field needs to be included
      front_picture: null, // Assuming null or appropriate file if available
      rightside_picture: null,
      leftside_picture: null,
      back_picture: null,
      top_picture: null,
      sole_picture: null,
      flaw_picture_1: null,
      flaw_picture_2: null,
      flaw_picture_3: null
    };
    
    console.log('Payload being sent:', formData);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/create_shoe/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const createdData = await response.json();
        navigate('/create_offer', { state: { offer_data: { shoe_id: createdData.id, shoe_size: selectedSize } } });
      } else {
        const errorData = await response.json();
        console.error('Failed to create shoe:', errorData);
        alert('Failed to create shoe.');
      }
    } catch (error) {
      console.error('Error creating shoe:', error);
      alert('Something went wrong while creating shoe.');
    }
  };
  
  const fetchShoes = async (shoeName) => {
    const token = authTokens.access;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/shoe_name/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ shoe_name: shoeName }),
      });

      if (response.ok) {
        const data = await response.json();
        setShoeValues(data);
        navigate('/create_offer', {
          state: {
            offer_data: {
              shoe_id: data.info.id,
              shoe_name: data.info.name,
              shoe_size: data.info.size,
            },
          },
        });
      } else if (response.status === 404) {
        console.error('Shoe not found');
      } else {
        console.error('Failed to fetch shoe data:', response.statusText);
        alert('Something went wrong while fetching shoe data.');
      }
    } catch (error) {
      console.error('Error fetching shoe data:', error);
      alert('Something went wrong while fetching shoe data.');
    }
  };

  const fetchShoe = async (shoeName) => {
    const token = authTokens.access;
  
    const data = {
      name: shoeName,
      brand: shoeValues.brand,
      colorway: shoeValues.colorway,
    };
  
    console.log(data);
    navigate('/createshoe', { state: { shoeValues: data } });
  };
  
  
  useEffect(() => {
    if (searchQuery) {
      setShoeValues(searchQuery);
      if (!searchQuery.more_info) {
        console.log("No tender")
      } else {
        setExistingTender(true)
      }
    }
  }, [searchQuery]);

  const fetchTenderedShoe = async () => {
    try {
      const token = authTokens.access;
      const { name, brand, colorway } = shoeValues;
  
      const response = await fetch(`http://127.0.0.1:8000/api/fetch_tenders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          brand,
          colorway
        })
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData)
        setTenders(responseData.tenders_for_size);
        console.log(tenders)
        setExistingTenders(true);
      } else if (response.status === 404) {
        console.error('Shoe not found');
        alert('Shoe not found');
      } else {
        const errorData = await response.json();
        console.error('Failed to fetch shoe data:', errorData);
        alert('Failed to fetch shoe data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching shoe data:', error);
      alert('Something went wrong while fetching shoe data.');
    }
  };
  





  return (
    <div>
      {shoeValues && (
        <>
          <p>{shoeValues.brand}</p>
          {shoeValues.owner ? (
            <p>Owned by: {shoeValues.owner}</p>
          ) : (
            <p>Owner information not available</p>
          )}
          {!shoeValues.owner && <button onClick={handleClick}>Sell Shoe</button>}
          {shoeValues.owner && <button onClick={handleClicks}>See Sizes</button>}
          {!shoeValues.owner && <button onClick={handleClicks}>Offer</button>}
          {!shoeValues.owner && <button onClick={fetchTenderedShoe}>Buy Shoe</button>}

          {existingTenders && Object.keys(tenders.new).length > 0 && (
            <div>
              <h3>Prices for Sizes:</h3>
              <ul>
                {Object.entries(tenders.new).map(([size, [id, price, name]]) => (
                  <li key={size}>
                    Size {size}: ${price} - {id}
                    <button onClick={() => handleClicker(id, size, price, name)}>Buy</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {existingTender && Object.keys(sizePrices).length > 0 && (
            <div>
              <h3>Prices for Sizes:</h3>
              <ul>
                {Object.entries(sizePrices).map(([size, [price, id, name]]) => (
                  <li key={size}>
                    Size {size}: ${price}
                    <button onClick={() => usedShoeFunct(id, size)}>Offer</button>
                    <button onClick={() => handleClicker(id, size, price, name)}>Buy</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!existingTender && (
            <select
              name="size"
              id="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              required
            >
              <option value="m7">7</option>
              <option value="m7.5">7.5</option>
              <option value="m8">8</option>
              <option value="m8.5">8.5</option>
              <option value="m9">9</option>
              <option value="m9.5">9.5</option>
              <option value="m10">10</option>
              <option value="m10.5">10.5</option>
              <option value="m11">11</option>
              <option value="m11.5">11.5</option>
              <option value="m12">12</option>
              <option value="m12.5">12.5</option>
              <option value="m13">13</option>
              <option value="m13.5">13.5</option>
              <option value="m14">14</option>
            </select>
          )}
        </>
      )}
    </div>
  );
};

export default ShoePage;

