import { icons } from '@/constants/icons';
import { Movie } from '@/interfaces/interfaces';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({
	id,
	title,
	poster_path,
	vote_average,
	release_date,
}: Movie) => {
	return (
		<Link href={`/movie/${id}`} asChild>
			<TouchableOpacity
				style={{ flex: 1, marginHorizontal: 4, marginBottom: 12 }}
			>
				<Image
					source={{
						uri: poster_path
							? `https://image.tmdb.org/t/p/w500/${poster_path}`
							: 'https://via.placeholder.com/600x400/1a1a1a/ffffff.png',
					}}
					style={{ width: '100%', height: 180, borderRadius: 12 }}
					contentFit="cover"
				/>
				<Text
					style={{
						color: 'white',
						fontWeight: 'bold',
						fontSize: 14,
						marginTop: 8,
					}}
					numberOfLines={1}
				>
					{title}
				</Text>
				<View className="flex-row items-center justify-start gap-x-1">
					<Image source={icons.star} className="size-4" />
					<Text className="text-xs text-white font-bold uppercase">
						{Math.round(vote_average / 2)}
					</Text>
				</View>
				<View className="flex-row items-center justify-between">
					<Text className="text-xs text-light-300 font-medium mt-1">
						{release_date?.split('-')[0] || 'N/A'}
					</Text>
					<Text className="text-xs font-medium text-light-300 uppercase mt-1"></Text>
				</View>
			</TouchableOpacity>
		</Link>
	);
};

export default MovieCard;
