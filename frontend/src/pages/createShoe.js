import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const CreateShoe = () => {
  const { authTokens } = useContext(AuthContext);
  const [isUsed, setIsUsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = location.state?.shoeValues;
  const highestOffers = location.state?.highest_offers;
  const [shoeData, setShoeData] = useState({});
  const [shoeId, setShoeId] = useState(null);
  const [offers, setOffers] = useState({});
  const [showQualityModal, setShowQualityModal] = useState(false);

  const handleCheckboxChange = () => {
    setIsUsed(!isUsed);
  };

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const token = authTokens.access;
        const { name, brand, colorway } = shoeData;

        const response = await fetch(`http://127.0.0.1:8000/api/fetch-offers/`, {
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
          setOffers(responseData.offers_for_size);
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

    if (shoeData.name) {
      fetchShoe();
    }
  }, [authTokens.access, shoeData]);

  useEffect(() => {
    if (searchQuery) {
      setShoeData(searchQuery);
    }
  }, [searchQuery]);

  const submitShoe = async (e) => {
    e.preventDefault();
    const token = authTokens.access;

    const formData = {
      colorway: shoeData.colorway,
      name: shoeData.name,
      brand: shoeData.brand,
      size: e.target.size.value,
      year_made: e.target.year_made.value,
      price: e.target.price.value,
      used: isUsed,
    };

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/create_shoe/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('data:', data);
        console.log('Shoe created successfully');
        const info = {
          id: data.id,
          size: data.size,
        };
        setShoeId(info);
        if (isUsed) {
          setShowQualityModal(true);
        } else {
          navigate('/createoffer', { state: { shoeId: info } });
        }
      } else {
        alert('Something went wrong!!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    }
  };

  const submitQuality = async (e) => {
    e.preventDefault();
    const token = authTokens.access;

    const formData = {
      quality: e.target.quality.value,
      shoe: shoeId.id
    };

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/create-qc/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log('data:', data);
        console.log('Quality created successfully');

        navigate('/createoffer', { state: { shoeId } });
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
      <div>
        <p>Sell for the highest offers:</p>
        {offers.new && Object.keys(offers.new).length > 0 ? (
          <div>
            <h3>Prices for Sizes:</h3>
            <ul>
              {Object.entries(offers.new).map(([size, [id, price]]) => (
                <li key={size}>
                  Size {size}: ${price} - {id}
                  <button onClick={() => {
                    navigate('/createoffer', { state: { infor: { id, price, size } } });
                  }}>Accept Offer</button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No offers available</p>
        )}
      </div>
      <form onSubmit={submitShoe}>
        <p>Used:</p>
        <input
          type="checkbox"
          name="used"
          checked={isUsed}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="used"> Used</label>

        <p>Price:</p>
        <input type="number" name="price" placeholder="Enter Price" required />

        <label htmlFor="size">Size:</label>
        <select name="size" id="size" required>
          <optgroup label="Men's Sizes">
            <option value="m7">7</option>
            <option value="m7.5">7.5</option>
            {/* Add other options */}
          </optgroup>
          {/* Add Women's Sizes */}
        </select>

        <label htmlFor="year_made">Year Made:</label>
        <select name="year_made" id="year_made" required>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          {/* Add other options */}
        </select>

        <input type="submit" name="submit" />
      </form>

      {showQualityModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowQualityModal(false)}>&times;</span>
            <form onSubmit={submitQuality}>
              <label htmlFor="quality">Select Quality:</label>
              <select name="quality" id="quality" required>
                <optgroup label="Quality_Used">
                  <option value="Slightly Used W/ Original Box New">Slightly Used W/ Original Box New</option>
                  <option value="Heavily Used W/ Original Box New">Heavily Used W/ Original Box New</option>
                  <option value="Slightly Used W/ Original Box Damaged">Slightly Used W/ Original Box Damaged</option>
                  <option value="Heavily Used W/ Original Box Damaged">Heavily Used W/ Original Box Damaged</option>
                  <option value="Slightly Used No Box">Slightly Used No Box</option>
                  <option value="Heavily Used No Box">Heavily Used No Box</option>
                  {/* Add other options */}
                </optgroup>
                {/* Add Women's Sizes */}
              </select>
              <input type="submit" name="submit" />
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateShoe;
