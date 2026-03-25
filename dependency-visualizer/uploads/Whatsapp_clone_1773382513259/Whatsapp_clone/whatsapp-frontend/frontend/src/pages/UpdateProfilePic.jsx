import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfilePic = () => {
const [profilePic, setProfilePic] = useState(null);
const [message, setMessage] = useState('');

const handleUpdate = async (e) => {
e.preventDefault();


if (!profilePic) return setMessage('Please select a picture!');

const formData = new FormData();
formData.append('profilePic', profilePic);

try {
  const res = await axios.put(
    'http://localhost:5000/api/users/profile-pic',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }
  );
  setMessage('Profile picture updated!');
  console.log(res.data);
} catch (err) {
  setMessage(err.response?.data?.message || 'Error occurred');
}


};

return ( <div> <h2>Update Profile Picture</h2> <form onSubmit={handleUpdate}>
<input
type="file"
accept="image/*"
onChange={(e) => setProfilePic(e.target.files[0])}
/> <button type="submit">Update</button> </form>
{message && <p>{message}</p>} </div>
);
};

export default UpdateProfilePic;
