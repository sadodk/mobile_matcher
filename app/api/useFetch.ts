// fetchMovies
// fetchMovieDetails

// useFetch(fetchMovies) Notice how this hook can be used with many different fetch functions

import { useEffect, useState } from 'react';

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
	const [data, setData] = useState<T | null>(null); // default state is null
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null); // Reset error state before fetching

			const result = await fetchFunction();

			setData(result);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('An error occurred'));
		} finally {
			setLoading(false);
		}
	};

	const reset = () => {
		setData(null);
		setLoading(false);
		setError(null);
	};

	useEffect(() => {
		if (autoFetch) {
			fetchData();
		}
	}, []);

	return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
