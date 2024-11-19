from flask import Flask, request, jsonify
import pickle  # No need to install pickle, it's part of Python
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from different domains (e.g., your React frontend)

# Load pickled models (ensure these files exist in the same directory)
with open('dt_model.pkl', 'rb') as f:
    dt_model = pickle.load(f)

with open('rf_model.pkl', 'rb') as f:
    rf_model = pickle.load(f)

with open('pca_model.pkl', 'rb') as f:
    pca_model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get input data from request (the body should contain a JSON object)
        data = request.get_json()

        # Convert input data to a pandas DataFrame
        df = pd.DataFrame([data])

        # Extract features (recency, frequency, and monetary_value)
        features = df[['recency', 'frequency', 'monetary_value']].values

        # Dynamically scale the features using StandardScaler
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)  # Fit and transform the input data

        # Skip PCA and use the scaled features directly
        # Make predictions using both models: Decision Tree and Random Forest
        dt_prediction = dt_model.predict(scaled_features)
        rf_prediction = rf_model.predict(scaled_features)

        # Return the predictions as a JSON response
        return jsonify({
            'dt_prediction': int(dt_prediction[0]),
            'rf_prediction': int(rf_prediction[0])
        })

    except Exception as e:
        # If an error occurs, return an error message as JSON
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
