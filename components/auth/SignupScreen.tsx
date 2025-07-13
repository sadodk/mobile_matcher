import React from 'react';
import {
	Button,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

type SignupScreenProps = {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	givenName: string;
	setGivenName: (name: string) => void;
	familyName: string;
	setFamilyName: (name: string) => void;
	gender: string;
	setGender: (gender: string) => void;
	birthdate: string;
	setShowDatePicker: (show: boolean) => void;
	onSignup: () => void;
	onShowGenderPicker: () => void;
};

export default function SignupScreen({
	email,
	setEmail,
	password,
	setPassword,
	givenName,
	setGivenName,
	familyName,
	setFamilyName,
	gender,
	setGender,
	birthdate,
	setShowDatePicker,
	onSignup,
	onShowGenderPicker,
}: SignupScreenProps) {
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
			<Text style={styles.label}>First Name</Text>
			<TextInput
				placeholder="Enter your first name"
				style={styles.input}
				value={givenName}
				onChangeText={setGivenName}
			/>
			<Text style={styles.label}>Last Name</Text>
			<TextInput
				placeholder="Enter your last name"
				style={styles.input}
				value={familyName}
				onChangeText={setFamilyName}
			/>
			<Text style={styles.label}>Gender (optional)</Text>
			<TouchableOpacity style={styles.input} onPress={onShowGenderPicker}>
				<Text style={{ color: gender ? '#333' : '#888' }}>
					{gender
						? gender.charAt(0).toUpperCase() + gender.slice(1)
						: 'Select Gender (Optional)'}
				</Text>
			</TouchableOpacity>
			<Text style={styles.label}>Birthdate (optional)</Text>
			<TouchableOpacity
				style={styles.input}
				onPress={() => setShowDatePicker(true)}
			>
				<Text style={{ color: birthdate ? '#333' : '#888' }}>
					{birthdate ? birthdate : 'Select your birthdate (Optional)'}
				</Text>
			</TouchableOpacity>
			<Button title="Sign Up" onPress={onSignup} />
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
