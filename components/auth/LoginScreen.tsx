import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

type LoginScreenProps = {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	onLogin: () => void;
};

export default function LoginScreen({
	email,
	setEmail,
	password,
	setPassword,
	onLogin,
}: LoginScreenProps) {
	return (
		<View>
			<Text style={styles.label}>Email</Text>
			<TextInput
				placeholder="Enter your email"
				style={styles.input}
				autoCapitalize="none"
				value={email}
				onChangeText={setEmail}
				keyboardType="email-address"
			/>
			<Text style={styles.label}>Password</Text>
			<TextInput
				placeholder="Enter your password"
				style={styles.input}
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<Button title="Login" onPress={onLogin} />
		</View>
	);
}

const styles = StyleSheet.create({
	label: {
		alignSelf: 'flex-start',
		marginLeft: 5,
		marginTop: 10,
		marginBottom: 2,
		fontWeight: 'bold',
		color: '#333',
	},
	input: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		padding: 10,
		marginBottom: 5,
		width: 250,
	},
});
