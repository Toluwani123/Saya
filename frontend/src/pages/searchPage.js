import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const { authTokens } = useContext(AuthContext);
  const [shoeData, setShoeData] = useState([]);
  const [newShoeData, setNewShoeData] = useState([]);
  const location = useLocation();
  const searchQuery = location.state?.searchQuery;
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery) {
      submitSearchPrompt();
    }
  }, [searchQuery]);

  useEffect(() => {
    const fetchOfferData = async () => {
      const token = authTokens.access;
      const dataShoe = {};

      shoeData.forEach(info => {
        const shoeBrand = info.brand;
        const shoeName = info.shoeName;
        if (shoeBrand && shoeName) {
          if (!dataShoe[shoeBrand]) {
            dataShoe[shoeBrand] = [];
          }
          dataShoe[shoeBrand].push(shoeName);
        }
      });

      console.log('Data sent to backend:', dataShoe);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/fetch_offers/', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ shoe: dataShoe })
        });
        const data = await response.json();
        if (response.ok) {
          console.log('Response from backend:', data);
          setNewShoeData(data.info); // Assuming 'data.info' is the array of shoe data
        } else {
          console.error('Error response:', data);
          alert('Something went wrong!');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
      }
    };

    if (shoeData.length > 0) {
      fetchOfferData();
    }
  }, [shoeData, authTokens]);

  const submitSearchPrompt = async () => {
    const token = authTokens.access;

    try {
      const response = await fetch(
        `https://sneaker-database-stockx.p.rapidapi.com/getproducts?keywords=${searchQuery}&limit=20`,
        {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'X-RapidAPI-Key': '2eb8f2f484mshe50839032910f8bp11a324jsn2e2529676012',
            'X-RapidAPI-Host': 'sneaker-database-stockx.p.rapidapi.com',
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        console.log('Data from StockX:', data);
        setShoeData(data); // Assuming 'data' is the array of shoe data
      } else {
        console.error('Error response from StockX:', data);
        alert('Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  const handleClick = (index) => {
    const value = shoeData[index];
    console.log("Selected Shoe Data:", value);

    const shoeValues = {
      name: value.shoeName,
      brand: value.brand,
      colorway: value.colorway,
      release_date: value.releaseDate,
      price: value.retailPrice,
      image: value.thumbnail,
    };
    console.log("Shoe Values:", shoeValues);

    navigate('/shoe', { state: { shoeValues } });
  };

  const handleSellerClick = (index) => {
    const value = newShoeData[index];

    const shoeValues = {
      name: value.name,
      brand: value.brand,
      colorway: value.color_way,
      release_date: value.year_made,
      more_info: value.shoe_vals,
      image: value.back_picture,
      owner: 'exists',
    };
    console.log("Shoe Values:", shoeValues);

    navigate('/shoe', { state: { shoeValues } });
  };

  const getLowestAsk = (shoeVals) => {
    let lowestPrice = null;

    for (const size in shoeVals) {
      const tuples = shoeVals[size];
      for (const tuple of tuples) {
        const [shoeId, price] = tuple; // Assuming tuple structure is (shoeId, price, used)
        if (lowestPrice === null || price < lowestPrice) {
          lowestPrice = price;
        }
        
      }
    }
    return lowestPrice;
  };

  return (
    <div>
      {shoeData.length > 0 ? shoeData.map((shoe, index) => (
        <div key={index}>
          <h3>{shoe.brand}</h3>
          <p>{shoe.retailPrice} - {index}</p>
          <a onClick={() => handleClick(index)}>See more</a>
        </div>
      )) : 'No results found'}

      {newShoeData.length > 0 ? newShoeData.map((shoe, index) => (
        <div key={index}>
          <h3>{shoe.brand}</h3>
          <h3>{shoe.name}</h3>
          <p>Lowest Ask: {getLowestAsk(shoe.shoe_vals)}</p>
          <p>{shoe.owner}</p>
          <a onClick={() => handleSellerClick(index)}>See more</a>
        </div>
      )) : 'No results found'}
    </div>
  );
}

export default SearchPage;
