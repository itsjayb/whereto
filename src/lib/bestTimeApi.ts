interface BestTimeForecastParams {
  venue_name: string;
  venue_address: string;
}

interface BestTimeForecastResponse {
  // Add response type definition based on actual API response
  [key: string]: any;
}

interface BestTimeKeyResponse {
  // Add response type definition based on actual API response
  [key: string]: any;
}

const API_KEY = process.env.BEST_TIME_API_KEY || '';
const BASE_URL = 'https://besttime.app/api/v1';

// Log API key status once at module load
if (!API_KEY) {
  console.warn('BEST_TIME_API_KEY environment variable is not set');
} else {
  console.log('BEST_TIME_API_KEY loaded successfully');
}

/**
 * Get live forecast for a venue
 */
export async function getLiveForecast(params: BestTimeForecastParams): Promise<BestTimeForecastResponse> {
  try {
    console.log('🚀 Best Time API - Making request with params:', params);
    console.log('🔑 API Key status:', API_KEY ? 'Present' : 'Missing');
    
    const searchParams = new URLSearchParams({
      'api_key_private': API_KEY,
      'venue_name': params.venue_name,
      'venue_address': params.venue_address
    });

    const url = `${BASE_URL}/forecasts/live?${searchParams}`;
    console.log('🌐 Request URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('📦 Raw API Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('❌ Error fetching live forecast:', error);
    throw error;
  }
}

/**
 * Get API key information
 */
export async function getKeyInfo(): Promise<BestTimeKeyResponse> {
  try {
    const response = await fetch(`${BASE_URL}/keys/${API_KEY}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching key info:', error);
    throw error;
  }
}

/**
 * Check if API key is valid
 */
export async function validateApiKey(): Promise<boolean> {
  try {
    await getKeyInfo();
    return true;
  } catch (error) {
    return false;
  }
}

// Export types
export type { BestTimeForecastParams, BestTimeForecastResponse, BestTimeKeyResponse };
