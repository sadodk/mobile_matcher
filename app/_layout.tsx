import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import './globals.css';

export default function RootLayout() {
	return (
		<AuthProvider>
			<StatusBar hidden={true} />
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name="(auth)" />
				<Stack.Screen name="(tabs)" />
				<Stack.Screen name="movie/[id]" />
			</Stack>
		</AuthProvider>
	);
}
