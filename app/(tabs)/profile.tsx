import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { Button, View } from 'react-native';

export default function Profile() {
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
		router.replace('/(auth)');
	};

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Button title="Logout" onPress={handleLogout} />
			{/* Your profile content */}
		</View>
	);
}
