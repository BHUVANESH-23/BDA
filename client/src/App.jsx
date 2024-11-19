// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [recency, setRecency] = useState('');
  const [frequency, setFrequency] = useState('');
  const [monetaryValue, setMonetaryValue] = useState('');
  const [dtPrediction, setDtPrediction] = useState(null);
  const [rfPrediction, setRfPrediction] = useState(null);
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate if all inputs are numbers and not empty
    if (
      isNaN(recency) || recency === '' ||
      isNaN(frequency) || frequency === '' ||
      isNaN(monetaryValue) || monetaryValue === ''
    ) {
      setError('Please enter valid numerical values for all fields.');
      return;
    }

    const requestData = {
      recency: parseFloat(recency),    // Convert to float
      frequency: parseFloat(frequency),// Convert to float
      monetary_value: parseFloat(monetaryValue), // Convert to float
    };

    try {
      // Send data to the backend API
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      // Check if response is successful
      if (response.ok) {
        setDtPrediction(data.dt_prediction);
        setRfPrediction(data.rf_prediction);
        setError('');  // Reset error
      } else {
        setError(data.error || 'Unexpected error from the backend');
      }
    } catch (err) {
      setError('Error communicating with the backend');
    }
  };

  return (
    <div className="App">
      <h1>Customer Segmentation Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Recency (in seconds):
            <input
              type="number"
              value={recency}
              onChange={(e) => setRecency(e.target.value)}
              placeholder="e.g. 1000"
            />
          </label>
        </div>
        <div>
          <label>
            Frequency:
            <input
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="e.g. 25"
            />
          </label>
        </div>
        <div>
          <label>
            Monetary Value:
            <input
              type="number"
              value={monetaryValue}
              onChange={(e) => setMonetaryValue(e.target.value)}
              placeholder="e.g. 500"
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display predictions if they exist */}
      {dtPrediction !== null && rfPrediction !== null && (
        <div>
          <h3>Predictions:</h3>
          <p>Decision Tree Prediction: {dtPrediction}</p>
          <p>Random Forest Prediction: {rfPrediction}</p>
        </div>
      )}
    </div>
  );
}

export default App;
