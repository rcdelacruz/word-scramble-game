// API route for validating words
import axios from 'axios';

// This is the URL of your backend API
// Replace with the correct URL of your backend deployment
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'https://word-scramble-api.vercel.app/api';

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    // Forward the request to the backend API
    const response = await axios.post(`${BACKEND_API_URL}/game/validate`, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the backend
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error forwarding request to backend:', error);
    
    // Return a fallback response if the backend is not available
    if (error.response) {
      // The backend returned an error response
      return res.status(error.response.status).json(error.response.data);
    } else {
      // The backend is not available
      return res.status(500).json({
        success: false,
        error: 'Backend service is not available',
        message: error.message,
      });
    }
  }
}
