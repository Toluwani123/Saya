import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';


const CreateSeller = () => {
  const { user, authTokens } = useContext(AuthContext);
  const [selectedState, setSelectedState] = useState('');
  const [selectedStates, setSelectedStates] = useState('');
  const [saveSeller, setSaveSeller] = useState(null);
  const [sellerExists, setSellerExists] = useState(false);
    


  const submitSeller = async (e) => {
    e.preventDefault();
    const token = authTokens.access;
    const address = `${e.target.addressline.value} ${e.target.addresslinew.value} ${e.target.state.value}`;
    try {
        const response = await fetch('http://127.0.0.1:8000/api/create-seller/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                'user': user.user_id,
                'return_address': address,
            }),
        });
        const data = await response.json();
        console.log('data:', data);
        if (response.status === 201) {
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
  const editSeller = async (e) => {
    e.preventDefault();
    const token = authTokens.access;
    const id = user.user_id;
    const addresss = `${e.target.addresslines.value} ${e.target.addresslinews.value} ${e.target.states.value}`;
    try {
        const response = await fetch('http://127.0.0.1:8000/api/seller/' + id + '/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                'return_address': addresss,
            }),
        });
        if (response.ok) {
            const data = await response.json();
            setSaveSeller(data.return_address);
            console.log(data);
        } else {
            alert('Something went wrong');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong');
    }
  };

  useEffect(() => {
    const getsellerData = async () => {
        const token = authTokens.access;
        const id = user.user_id;
        try {
            const response = await fetch('http://127.0.0.1:8000/api/seller/' + id + '/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSaveSeller(data.return_address);
                setSellerExists(true); // Set to true if buyer data is found
            } else if (response.status === 404) {
                setSellerExists(false); // Set to false if buyer data is not found
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
    {sellerExists ? (
        <div>
            <p>Hello {user.username} for editing</p>
            <form onSubmit={editSeller}>
                <input type='text' name='addresslines' placeholder='Enter Address Line 1' />
                <input type='text' name='addresslinews' placeholder='Enter Address Line 2' />
                <p>Select State:</p>
                <select
                    name='states'
                    value={selectedStates}
                    onChange={(e) => setSelectedStates(e.target.value)}
                >
                    {/* Options for states */}
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </select>
                <input type='submit' name='submit' />
            </form>
        </div>
    ) : (
        <div>
            <p>Hello {user.username} for new comers</p>
            <form onSubmit={submitSeller}>
                <input type='text' name='addressline' placeholder='Enter Address Line 1' />
                <input type='text' name='addresslinew' placeholder='Enter Address Line 2' />
                <p>Select State:</p>
                <select
                    name='state'
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                >
                    {/* Options for states */}
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </select>
                <input type='submit' name='submit' />
            </form>
        </div>
    )}
    <p>{saveSeller}</p>
</div>
  )
}

export default CreateSeller