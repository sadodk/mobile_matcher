import {
	CreateProfileRequest,
	Profile,
	ProfileDetails,
	UpdateProfileRequest,
} from '@/interfaces/interfaces';
import { getAuthHeaders as getStoredAuthHeaders } from '@/utils/auth';

export const PROFILE_MATCHER_CONFIG = {
	BASE_URL: 'https://c0su3lk7ae.execute-api.eu-central-1.amazonaws.com/dev',
};

// Helper function to get auth headers
const getAuthHeaders = async (token?: string) => {
	if (token) {
		return {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		};
	}

	// Use stored token from auth utility
	return await getStoredAuthHeaders();
};

// Health check endpoint
export const checkHealth = async (
	token?: string
): Promise<{ status: string; timestamp: string }> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(`${PROFILE_MATCHER_CONFIG.BASE_URL}/health`, {
		method: 'GET',
		headers,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Health check failed: ${errorMessage}`);
	}

	return await response.json();
};

// Get all profiles
export const fetchProfiles = async (token?: string): Promise<Profile[]> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(`${PROFILE_MATCHER_CONFIG.BASE_URL}/profiles`, {
		method: 'GET',
		headers,
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Failed to fetch profiles: ${errorMessage}`);
	}

	const data = await response.json();

	// Handle wrapped response structure from your API
	if (data.body && data.body.profiles) {
		return data.body.profiles;
	}

	// Handle direct response structure
	if (data.profiles) {
		return data.profiles;
	}

	return data;
};

// Get a specific profile by user ID
export const fetchProfileById = async (
	userId: string,
	token?: string
): Promise<ProfileDetails> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(
		`${PROFILE_MATCHER_CONFIG.BASE_URL}/profiles/${userId}`,
		{
			method: 'GET',
			headers,
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Failed to fetch profile: ${errorMessage}`);
	}

	return await response.json();
};

// Create a new profile
export const createProfile = async (
	profileData: CreateProfileRequest,
	token?: string
): Promise<{ success: boolean; user_id: string; message: string }> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(`${PROFILE_MATCHER_CONFIG.BASE_URL}/profiles`, {
		method: 'POST',
		headers,
		body: JSON.stringify(profileData),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Failed to create profile: ${errorMessage}`);
	}

	return await response.json();
};

// Update an existing profile
export const updateProfile = async (
	userId: string,
	profileData: UpdateProfileRequest,
	token?: string
): Promise<{ success: boolean; user_id: string; message: string }> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(
		`${PROFILE_MATCHER_CONFIG.BASE_URL}/profiles/${userId}`,
		{
			method: 'PUT',
			headers,
			body: JSON.stringify(profileData),
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Failed to update profile: ${errorMessage}`);
	}

	return await response.json();
};

// Delete a profile
export const deleteProfile = async (
	userId: string,
	token?: string
): Promise<{ success: boolean; user_id: string; message: string }> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(
		`${PROFILE_MATCHER_CONFIG.BASE_URL}/profiles/${userId}`,
		{
			method: 'DELETE',
			headers,
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Failed to delete profile: ${errorMessage}`);
	}

	return await response.json();
};

// Search profiles (if you implement search functionality later)
export const searchProfiles = async (
	query: string,
	token?: string
): Promise<Profile[]> => {
	const headers = await getAuthHeaders(token);
	const response = await fetch(
		`${PROFILE_MATCHER_CONFIG.BASE_URL}/profiles/search?q=${encodeURIComponent(
			query
		)}`,
		{
			method: 'GET',
			headers,
		}
	);

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.message || response.statusText;
		throw new Error(`Failed to search profiles: ${errorMessage}`);
	}

	const data = await response.json();

	// Handle wrapped response structure
	if (data.body && data.body.profiles) {
		return data.body.profiles;
	}

	if (data.profiles) {
		return data.profiles;
	}

	return data;
};
