import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

import { login, signup, testMatchEndpoint } from '@/api/authApi';
import { storeAuthToken } from '@/utils/auth';
import GenderPicker from './GenderPicker';
import LoginScreen from './LoginScreen';
import ProfileView from './ProfileView';
import SignupScreen from './SignupScreen';

import decodeJwt from '@/utils/jwt';

type AuthScreenProps = {
	onAuthSuccess?: (token: string) => void;
};

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
	const [isLogin, setIsLogin] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [idToken, setIdToken] = useState<string | null>(null);
	const [jwtPayload, setJwtPayload] = useState<any>(null);
	const [apiResponse, setApiResponse] = useState<string | null>(null);

	// Login state
	const [loginEmail, setLoginEmail] = useState('');
	const [loginPassword, setLoginPassword] = useState('');

	// Signup state
	const [signupEmail, setSignupEmail] = useState('');
	const [signupPassword, setSignupPassword] = useState('');
	const [givenName, setGivenName] = useState('');
	const [familyName, setFamilyName] = useState('');
	const [gender, setGender] = useState('');
	const [birthdate, setBirthdate] = useState('');
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [genderModalVisible, setGenderModalVisible] = useState(false);

	async function handleSignup() {
		try {
			const data = await signup({
				email: signupEmail,
				password: signupPassword,
				givenName,
				familyName,
				gender,
				birthdate,
			});
			if (data.UserConfirmed === false) {
				alert(
					'Successfully signed up! Please check your email for a verification code.'
				);
			} else {
				alert('Successfully signed up! You can now login.');
				setIsLogin(true);
			}
		} catch (error) {
			let message = 'An error occurred';
			if (error && typeof error === 'object' && 'message' in error) {
				message = (error as { message: string }).message;
			}
			alert('Signup error: ' + message);
		}
	}

	async function handleLogin() {
		try {
			const data = await login({
				email: loginEmail,
				password: loginPassword,
			});
			if (data.AuthenticationResult) {
				const { IdToken } = data.AuthenticationResult;
				setIdToken(IdToken);
				setJwtPayload(decodeJwt(IdToken));

				// Store token
				await storeAuthToken(IdToken);

				// Call success callback or set local state
				if (onAuthSuccess) {
					onAuthSuccess(IdToken);
				} else {
					setIsAuthenticated(true);
				}
			} else {
				alert(data.message || 'Authentication failed');
			}
		} catch (error) {
			let message = 'An error occurred';
			if (error && typeof error === 'object' && 'message' in error) {
				message = (error as { message: string }).message;
			}
			alert('Login error: ' + message);
		}
	}

	async function handleTestMatch() {
		try {
			if (!idToken || !jwtPayload)
				throw new Error('Missing token or user info');
			const userId = jwtPayload.sub || jwtPayload.username || 'unknown-user';
			const data = await testMatchEndpoint({ idToken, userId });
			setApiResponse(JSON.stringify(data, null, 2));
		} catch (error) {
			setApiResponse('Error: ' + (error as any).message);
		}
	}

	function logout() {
		setIsAuthenticated(false);
		setIdToken(null);
		setJwtPayload(null);
		setApiResponse(null);
		setLoginEmail('');
		setLoginPassword('');
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={60}
		>
			<ScrollView
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps="handled"
			>
				{isAuthenticated ? (
					<ProfileView
						jwtPayload={jwtPayload}
						apiResponse={apiResponse}
						onTestMatch={handleTestMatch}
						onLogout={logout}
					/>
				) : (
					<>
						<View style={styles.tabContainer}>
							<TouchableOpacity
								style={[styles.tab, isLogin && styles.activeTab]}
								onPress={() => setIsLogin(true)}
							>
								<Text style={isLogin ? styles.activeTabText : styles.tabText}>
									Login
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={[styles.tab, !isLogin && styles.activeTab]}
								onPress={() => setIsLogin(false)}
							>
								<Text style={!isLogin ? styles.activeTabText : styles.tabText}>
									Sign Up
								</Text>
							</TouchableOpacity>
						</View>
						{isLogin ? (
							<LoginScreen
								email={loginEmail}
								setEmail={setLoginEmail}
								password={loginPassword}
								setPassword={setLoginPassword}
								onLogin={handleLogin}
							/>
						) : (
							<SignupScreen
								email={signupEmail}
								setEmail={setSignupEmail}
								password={signupPassword}
								setPassword={setSignupPassword}
								givenName={givenName}
								setGivenName={setGivenName}
								familyName={familyName}
								setFamilyName={setFamilyName}
								gender={gender}
								setGender={setGender}
								birthdate={birthdate}
								setShowDatePicker={setShowDatePicker}
								onSignup={handleSignup}
								onShowGenderPicker={() => setGenderModalVisible(true)}
							/>
						)}
						<GenderPicker
							visible={genderModalVisible}
							onSelect={(option) => {
								setGender(option);
								setGenderModalVisible(false);
							}}
							onCancel={() => setGenderModalVisible(false)}
						/>
						{showDatePicker && (
							<DateTimePicker
								value={birthdate ? new Date(birthdate) : new Date(2000, 0, 1)}
								mode="date"
								display="default"
								maximumDate={new Date(2025, 11, 31)}
								minimumDate={new Date(1900, 0, 1)}
								onChange={(_, selectedDate) => {
									setShowDatePicker(false);
									if (selectedDate) {
										const iso = selectedDate.toISOString().split('T')[0];
										setBirthdate(iso);
									}
								}}
							/>
						)}
					</>
				)}
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	tabContainer: { flexDirection: 'row', marginBottom: 20 },
	tab: {
		padding: 10,
		marginHorizontal: 5,
		borderRadius: 5,
		backgroundColor: '#f0f0f0',
	},
	activeTab: { backgroundColor: '#007bff' },
	tabText: { color: '#333' },
	activeTabText: { color: '#fff' },
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
	pickerWrapper: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		marginBottom: 5,
		width: 250,
	},
	picker: {
		width: 250,
		height: 44,
	},
	profileContainer: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	profileTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	profileSubtitle: {
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 5,
	},
	profileScroll: {
		maxHeight: 400,
	},
	attributeRow: {
		flexDirection: 'row',
		marginBottom: 4,
	},
	attributeKey: {
		fontWeight: 'bold',
		marginRight: 5,
	},
	attributeValue: {
		color: '#333',
	},
	tokenData: {
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 4,
		fontFamily: 'monospace',
		marginBottom: 10,
	},
	apiResponseBox: {
		backgroundColor: '#fff',
		padding: 10,
		borderRadius: 4,
		marginTop: 10,
	},
});
