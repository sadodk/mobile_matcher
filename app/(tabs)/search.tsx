import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { fetchMovies } from '../api/api_imdb';
import { updateSearchCount } from '../api/appwrite';
import useFetch from '../api/useFetch';

const search = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const {
		data: movies,
		loading,
		error,
		refetch: loadMovies,
		reset,
	} = useFetch(() => fetchMovies({ query: searchQuery }), true);

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			if (searchQuery.trim()) {
				await loadMovies();
			} else {
				reset();
			}
		}, 500); // Debounce the search query by 500ms
		return () => clearTimeout(timeoutId);
	}, [searchQuery]);

	useEffect(() => {
		if ((movies?.length ?? 0) > 0 && movies?.[0]) {
			updateSearchCount(searchQuery, movies[0]);
		}
	}, [movies]);

	return (
		<View className="flex-1 bg-primary">
			<Image
				source={images.bg}
				className="flex-1 absolute z-0 w-full"
				resizeMode="cover"
			/>

			<FlatList
				data={movies}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item, index) => item.id?.toString() || index.toString()}
				className="px-5"
				numColumns={3}
				columnWrapperStyle={{
					justifyContent: 'center',
					gap: 16,
					marginVertical: 16,
				}}
				contentContainerStyle={{
					paddingBottom: 20,
				}}
				ListHeaderComponent={
					<>
						<View className="w-full flex-row justify-center mt-20 items-center">
							<Image source={icons.logo} className="w-12 h-10" />
						</View>
						<View className="my-5">
							<SearchBar
								placeholder="Search Movies"
								value={searchQuery}
								onChangeText={(text: string) => setSearchQuery(text)}
							/>
						</View>

						{loading && (
							<ActivityIndicator
								size="large"
								color="#0000ff"
								className="my-3"
							/>
						)}

						{error && (
							<Text className="text-red-500 px-5 my-3">
								Error: {error.message}{' '}
							</Text>
						)}

						{!loading &&
							!error &&
							searchQuery.trim() &&
							(movies?.length ?? 0) > 0 && (
								<Text className="text-xl text-white font-bold">
									Search Results for {''}
									<Text className="text-accent">{searchQuery}</Text>
								</Text>
							)}
					</>
				}
				ListEmptyComponent={
					!loading && !error ? (
						<View className="mt-10 px-5">
							<Text className="text-center text-gray-500">
								{searchQuery.trim() ? 'no movies found' : 'Search for a movie'}
							</Text>
						</View>
					) : null
				}
			/>
		</View>
	);
};

export default search;
