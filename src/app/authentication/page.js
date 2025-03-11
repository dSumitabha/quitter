'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Register from '../components/Register';
import Login from '../components/Login';

const Authentication = () => {
  const router = useRouter();

  const [isRegistering, setIsRegistering] = useState(false); // State for toggling between Register and Login
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    console.log('Hello')
    e.preventDefault();

    const endpoint = isRegistering ? '/api/userRegister' : '/api/userLogin';
    const body = isRegistering
      ? { username: formData.username, email: formData.email, password: formData.password }
      : { username: formData.username, password: formData.password };

    if (isRegistering && formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isRegistering ? 'Registration successful' : 'Login successful');
        
        // Optional: Redirect or set user session
        router.push('/profile'); // Redirect on success

      } else {
        setMessage(data.error || (isRegistering ? 'Registration failed' : 'Login failed'));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4">
      {isRegistering ? (
        <Register handleChange={handleChange} formData={formData} handleSubmit={handleSubmit} />
      ) : (
        <Login handleChange={handleChange} formData={formData} handleSubmit={handleSubmit} />
      )}

    {/* Feedback Message */}
	{message && (
		<p className="text-center mt-4 p-2 text-blue-700 rounded-md">{message}</p>
	)}

      <div className="text-center mt-4">
        {isRegistering ? (
          <p>
            Already a user?{' '}
            <button onClick={() => setIsRegistering(false)} className="text-blue-500 hover:text-blue-700">Sign In</button>
          </p>
        ) : (
          <p>
            New to quitter?{' '}
            <button onClick={() => setIsRegistering(true)} className="text-blue-500 hover:text-blue-700">Sign Up</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Authentication;