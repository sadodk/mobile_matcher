import AuthScreen from '@/components/auth/AuthScreen';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuthIndex() {
	const { login } = useAuth();

	const handleAuthSuccess = async (token: string) => {
		await login(token);
		router.replace('/(tabs)');
	};

	return (
		<View style={styles.container}>
			<AuthScreen onAuthSuccess={handleAuthSuccess} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
