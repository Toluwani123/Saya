import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const CreateShoeOffer = () => {
    const { user, authTokens } = useContext(AuthContext);
    const location = useLocation();
    const searchQuery = location.state?.offer_data;
    const acceptedTender = location.state?.offer_datas;
    const navigate = useNavigate();
    const [acceptedInfo, setAcceptedInfo] = useState({});
    const [shoeValues, setShoeValues] = useState({});

    useEffect(() => {
        if (searchQuery) {
            console.log(searchQuery);
            setShoeValues(searchQuery);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (acceptedTender) {
            console.log(acceptedTender);
            setAcceptedInfo(acceptedTender);
        }
    }, [acceptedTender]);

    const submitOffers = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const token = authTokens.access;
        const user_id = user.user_id;

        const formData = {
            price: acceptedInfo.shoe_price,
            expiration_duration: '1',
            shoe: acceptedInfo.shoe_id,
            owner: user_id,
            size: acceptedInfo.shoe_size,
        };

        console.log("Form data:", formData);

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/api/create_offer/',
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
                console.log('Offer Created Successfully');
                console.log(acceptedInfo.shoe_id, data.id);
                fetchAcceptedShoe(acceptedInfo.shoe_id, data.id);

            } else {
                alert('Something went wrong!!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong');
        }
    };

    const submitOffer = async (e) => {
        e.preventDefault(); // Prevent default form submission
        const token = authTokens.access;
        const user_id = user.user_id;

        const formData = {
            price: e.target.price.value,
            expiration_duration: e.target.expire.value,
            shoe: shoeValues.shoe_id,
            owner: user_id,
            size: shoeValues.shoe_size,
        };

        console.log("Form data:", formData);

        try {
            const response = await fetch(
                'http://127.0.0.1:8000/api/create_offer/',
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
                console.log('Offer Created Successfully');
                navigate('/');
            } else {
                alert('Something went wrong!!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Something went wrong');
        }
    };

    const fetchAcceptedShoe = async (shoeId, offerId) => {
        const token = authTokens.access;
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/accept-tender/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    'id': shoeId,
                    'offer_id': offerId
                })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                navigate('/');
            } else {
                const data = await response.json();
                console.log(data);
                console.error('Failed to accept offer:', response.statusText);
                alert('Something went wrong while accepting the offer.');
            }
        } catch (error) {
            console.error('Error accepting offer:', error);
            alert('Something went wrong while accepting the offer.');
        }
    };

    return (
        <div>
            {shoeValues.name && <h1>{shoeValues.name}</h1>}

            {!acceptedTender && 
                <form onSubmit={submitOffer}>
                    <p>Price:</p>
                    <input type="number" name="price" placeholder="Enter Price" required />
                    <p>Expiration Time:</p>
                    <select name="expire" id="expire" required>
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="7">7</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="30">30</option>
                    </select>
                    <button type="submit">Submit Offer</button>
                </form>
            }

            {acceptedTender && acceptedInfo &&  (
                <form onSubmit={submitOffers}>
                    <p>
                        Buying {acceptedInfo.shoe_name} in size {acceptedInfo.shoe_size} for Price: {acceptedInfo.shoe_price}
                    </p>
                    <button type="submit">Submit Tender</button>
                </form>
            )}
            
        </div>
    );
};

export default CreateShoeOffer;
