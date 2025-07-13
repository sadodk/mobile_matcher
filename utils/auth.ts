import AsyncStorage from '@react-native-async-storage/async-storage';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

export interface AuthTokens {
	token: string;
	expiresAt: number;
}

// Store authentication token
export const storeAuthToken = async (
	token: string,
	expiresIn: number = 3600
): Promise<void> => {
	try {
		const expiresAt = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
		await AsyncStorage.multiSet([
			[TOKEN_KEY, token],
			[TOKEN_EXPIRY_KEY, expiresAt.toString()],
		]);
	} catch (error) {
		console.error('Error storing auth token:', error);
		throw error;
	}
};

// Get stored authentication token
export const getAuthToken = async (): Promise<string | null> => {
	try {
		const [[, token], [, expiryStr]] = await AsyncStorage.multiGet([
			TOKEN_KEY,
			TOKEN_EXPIRY_KEY,
		]);

		if (!token || !expiryStr) {
			return null;
		}

		const expiry = parseInt(expiryStr);
		const now = Date.now();

		// Check if token is expired (with 5 minute buffer)
		if (now >= expiry - 5 * 60 * 1000) {
			await clearAuthToken();
			return null;
		}

		return token;
	} catch (error) {
		console.error('Error getting auth token:', error);
		return null;
	}
};

// Clear stored authentication token
export const clearAuthToken = async (): Promise<void> => {
	try {
		await AsyncStorage.multiRemove([TOKEN_KEY, TOKEN_EXPIRY_KEY]);
	} catch (error) {
		console.error('Error clearing auth token:', error);
		throw error;
	}
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
	const token = await getAuthToken();
	return token !== null;
};

// Example authentication function (you'll need to implement based on your auth flow)
export const authenticateUser = async (
	username: string,
	password: string
): Promise<AuthTokens> => {
	// This is a placeholder - you'll need to implement your actual authentication logic
	// based on your AWS Cognito setup or whatever auth system you're using

	try {
		// Example API call to your authentication endpoint
		const response = await fetch('YOUR_AUTH_ENDPOINT', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username,
				password,
			}),
		});

		if (!response.ok) {
			throw new Error('Authentication failed');
		}

		const data = await response.json();

		// Extract token and expiry from response
		const token = data.token || data.id_token || data.access_token;
		const expiresIn = data.expires_in || 3600;

		// Store the token
		await storeAuthToken(token, expiresIn);

		return {
			token,
			expiresAt: Date.now() + expiresIn * 1000,
		};
	} catch (error) {
		console.error('Authentication error:', error);
		throw error;
	}
};

// Logout function
export const logout = async (): Promise<void> => {
	await clearAuthToken();
};

// Get auth headers for API requests
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
	const token = await getAuthToken();

	if (!token) {
		throw new Error('No authentication token available. Please login first.');
	}

	return {
		Authorization: `Bearer ${token}`,
		'Content-Type': 'application/json',
	};
};
