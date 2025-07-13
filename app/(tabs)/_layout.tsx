import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { Image } from 'expo-image';
import { Tabs } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, View } from 'react-native';

const TabIcon = ({
	focused,
	icon,
	title,
}: {
	focused: boolean;
	icon: any;
	title: string;
}) => {
	if (focused) {
		return (
			<ImageBackground
				source={images.highlight}
				className="flex-row min-w-[112px] min-h-12 mt-5 justify-center items-center rounded-full overflow-hidden flex-1"
				resizeMode="contain"
			>
				<Image source={icon} tintColor="#151312" className="w-5 h-5" />
				<Text className="text-secondary text-base font-semibold ml-2">
					{title}
				</Text>
			</ImageBackground>
		);
	}
	return (
		<View className="flex-row min-w-[112px] min-h-12 mt-2 justify-center items-center rounded-full w-full h-12">
			<Image source={icon} tintColor="#A8B5DB" className="w-5 h-5" />
			<Text className="text-white text-base font-semibold ml-2">{title}</Text>
		</View>
	);
};

const _layout = () => {
	return (
		<Tabs
			screenOptions={{
				tabBarShowLabel: false,
				tabBarItemStyle: {
					// NativeWind doesn't support className here, so keep these minimal
					width: '100%',
					height: 56,
					justifyContent: 'center',
					alignItems: 'center',
				},
				tabBarStyle: {
					backgroundColor: '#030014', // Use primary color from your theme
					borderRadius: 50,
					marginHorizontal: 20,
					marginBottom: 38,
					height: 56,
					position: 'absolute', // Ensure it's absolutely positioned
					borderWidth: 1,
					borderColor: '#0f0d23',
					zIndex: 1000, // Ensure it's above other content
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.home} title="Home" />
					),
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: 'Search',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.search} title="Search" />
					),
				}}
			/>
			<Tabs.Screen
				name="saved"
				options={{
					title: 'Saved',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.save} title="Saved" />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					headerShown: false,
					tabBarIcon: ({ focused }) => (
						<TabIcon focused={focused} icon={icons.person} title="Profile" />
					),
				}}
			/>
		</Tabs>
	);
};

export default _layout;
