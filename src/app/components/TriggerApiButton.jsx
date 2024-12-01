'use client'; // Ensure this is client-side only in Next.js 15

import React from 'react';

const TriggerApiButton = () => {
  // Handler for button click to trigger the API
  const handleButtonClick = async () => {
    try {
      // Make the POST request to your API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Parse the JSON response from the API
      const data = await response.json();

      // Log the API response to the console
      console.log('API Response:', data);
    } catch (error) {
      // Log any errors that occur
      console.error('Error calling API:', error);
    }
  };

  return (
    <div>
      <button className='bg-white text-black p-4 block my-8' onClick={handleButtonClick}>Trigger API</button>
    </div>
  );
};

export default TriggerApiButton;
