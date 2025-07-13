import { Movie, MovieDetails } from '@/interfaces/interfaces';

export const TMDB_CONFIG = {
	BASE_URL: 'https://api.themoviedb.org/3',
	API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
};

// functions to call the TMDB API

export const fetchMovies = async ({
	query,
}: {
	query: string;
}): Promise<Movie[]> => {
	// Check if the API key is available to prevent errors
	if (!TMDB_CONFIG.API_KEY) {
		throw new Error('TMDB API Key is missing. Check your .env file.');
	}

	const apiKeyParam = `api_key=${TMDB_CONFIG.API_KEY}`;

	// Build the correct URL with the api_key as a query parameter
	const endpoint = query
		? `${
				TMDB_CONFIG.BASE_URL
		  }/search/movie?${apiKeyParam}&query=${encodeURIComponent(query)}`
		: `${TMDB_CONFIG.BASE_URL}/discover/movie?${apiKeyParam}&sort_by=popularity.desc`;

	const response = await fetch(endpoint); // No custom headers needed

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({})); // Try to get error details
		const errorMessage = errorData.status_message || response.statusText;
		throw new Error(`Failed to fetch movies: ${errorMessage}`);
	}

	const data = await response.json();
	return data.results;
};

export const fetchMovieDetails = async (
	movieId: string
): Promise<MovieDetails> => {
	if (!TMDB_CONFIG.API_KEY) {
		throw new Error('TMDB API Key is missing. Check your .env file.');
	}
	const endpoint = `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`;
	const response = await fetch(endpoint); // No custom headers

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		const errorMessage = errorData.status_message || response.statusText;
		throw new Error(`Failed to fetch movie details: ${errorMessage}`);
	}

	const data = await response.json();
	return data;
};
