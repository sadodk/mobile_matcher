import MovieCard from '@/components/MovieCard';
import TrendingCard from '@/components/TrendingCard';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native';
import { fetchMovies } from '../../api/api_imdb';
import { getTrendingMovies } from '../../api/appwrite';
import useFetch from '../../api/useFetch';

export default function Index() {
	const router = useRouter();

	const {
		data: trendingMovies,
		loading: trendingMoviesLoading,
		error: trendingMoviesError,
	} = useFetch(getTrendingMovies);

	const {
		data: movies,
		loading: moviesLoading,
		error: moviesError,
	} = useFetch(() => fetchMovies({ query: '' }));

	if (moviesLoading || trendingMoviesLoading) {
		return (
			<View className="flex-1 bg-primary justify-center items-center">
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (moviesError || trendingMoviesError) {
		return (
			<View className="flex-1 bg-primary justify-center items-center px-5">
				<Text className="text-white text-center">
					Error loading movies:{' '}
					{moviesError?.message || trendingMoviesError?.message}
				</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-primary">
			<Image
				source={images.bg}
				className="absolute z-0 w-full h-full"
				resizeMode="cover"
			/>
			<FlatList
				ListHeaderComponent={
					<>
						<Image
							source={icons.logo}
							className="w-12 h-10 mt-20 mb-5 mx-auto"
						/>
						<View className="px-5 mt-5">
							{/* Replace SearchBar with a button */}

							{trendingMovies && (
								<View className="mt-10">
									<Text className="text-lg text-white font-bold mr-3">
										Trending Movies
									</Text>
								</View>
							)}
							<FlatList
								horizontal
								showsHorizontalScrollIndicator={false}
								ItemSeparatorComponent={() => <View className="w-4"></View>}
								className="mb-4 mt-3"
								data={trendingMovies}
								renderItem={({ item, index }) => (
									<TrendingCard movie={item} index={index} />
								)}
								keyExtractor={(item) => item.movie_id.toString()}
							/>
							<Text className="text-lg text-white font-bold mt-5 mb-3">
								Latest Movies
							</Text>
						</View>
					</>
				}
				data={movies}
				renderItem={({ item }) => <MovieCard {...item} />}
				keyExtractor={(item) => item.id.toString()}
				numColumns={3}
				columnWrapperStyle={{
					justifyContent: 'space-between',
					marginBottom: 10,
				}}
				contentContainerStyle={{
					paddingBottom: 100, // Increased to clear the navbar
					paddingHorizontal: 12,
				}}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
