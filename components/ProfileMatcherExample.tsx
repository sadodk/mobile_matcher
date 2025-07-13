import {
	checkHealth,
	createProfile,
	deleteProfile,
	fetchProfiles,
} from '@/api/api_profile_matcher';
import { CreateProfileRequest, Profile, Skill } from '@/interfaces/interfaces';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';

const ProfileMatcherExample = () => {
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [loading, setLoading] = useState(false);
	const [healthStatus, setHealthStatus] = useState<string>('');

	// Form state for creating/editing profiles
	const [formData, setFormData] = useState<CreateProfileRequest>({
		user_id: '',
		name: '',
		email: '',
		bio: '',
		skills: [],
	});

	const [skillInput, setSkillInput] = useState({ name: '', level: 5 });

	useEffect(() => {
		// Check API health on component mount
		checkAPIHealth();
		loadProfiles();
	}, []);

	const checkAPIHealth = async () => {
		try {
			const health = await checkHealth();
			setHealthStatus(health.status);
		} catch (error) {
			console.error('Health check failed:', error);
			setHealthStatus('unhealthy');
		}
	};

	const loadProfiles = async () => {
		setLoading(true);
		try {
			const profilesData = await fetchProfiles();
			setProfiles(profilesData);
		} catch (error) {
			console.error('Failed to load profiles:', error);
			Alert.alert(
				'Error',
				'Failed to load profiles. Please check your authentication.'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCreateProfile = async () => {
		try {
			if (!formData.user_id || !formData.name || !formData.email) {
				Alert.alert('Error', 'Please fill in all required fields');
				return;
			}

			setLoading(true);
			const result = await createProfile(formData);

			if (result.success) {
				Alert.alert('Success', 'Profile created successfully!');
				// Reset form
				setFormData({
					user_id: '',
					name: '',
					email: '',
					bio: '',
					skills: [],
				});
				// Reload profiles
				await loadProfiles();
			}
		} catch (error) {
			console.error('Failed to create profile:', error);
			Alert.alert('Error', 'Failed to create profile. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteProfile = async (userId: string) => {
		Alert.alert(
			'Confirm Delete',
			'Are you sure you want to delete this profile?',
			[
				{ text: 'Cancel', style: 'cancel' },
				{
					text: 'Delete',
					style: 'destructive',
					onPress: async () => {
						try {
							setLoading(true);
							const result = await deleteProfile(userId);
							if (result.success) {
								Alert.alert('Success', 'Profile deleted successfully!');
								await loadProfiles();
							}
						} catch (error) {
							console.error('Failed to delete profile:', error);
							Alert.alert('Error', 'Failed to delete profile.');
						} finally {
							setLoading(false);
						}
					},
				},
			]
		);
	};

	const addSkill = () => {
		if (!skillInput.name) {
			Alert.alert('Error', 'Please enter a skill name');
			return;
		}

		const newSkill: Skill = {
			name: skillInput.name,
			level: skillInput.level,
		};

		setFormData((prev) => ({
			...prev,
			skills: [...prev.skills, newSkill],
		}));

		setSkillInput({ name: '', level: 5 });
	};

	const removeSkill = (index: number) => {
		setFormData((prev) => ({
			...prev,
			skills: prev.skills.filter((_, i) => i !== index),
		}));
	};

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.title}>Profile Matcher API Example</Text>

			{/* Health Status */}
			<View style={styles.healthContainer}>
				<Text style={styles.healthText}>
					API Status:{' '}
					<Text
						style={
							healthStatus === 'healthy' ? styles.healthy : styles.unhealthy
						}
					>
						{healthStatus || 'Checking...'}
					</Text>
				</Text>
			</View>

			{/* Create Profile Form */}
			<View style={styles.formContainer}>
				<Text style={styles.sectionTitle}>Create New Profile</Text>

				<TextInput
					style={styles.input}
					placeholder="User ID"
					value={formData.user_id}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, user_id: text }))
					}
				/>

				<TextInput
					style={styles.input}
					placeholder="Name"
					value={formData.name}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, name: text }))
					}
				/>

				<TextInput
					style={styles.input}
					placeholder="Email"
					value={formData.email}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, email: text }))
					}
					keyboardType="email-address"
				/>

				<TextInput
					style={[styles.input, styles.textArea]}
					placeholder="Bio (optional)"
					value={formData.bio}
					onChangeText={(text) =>
						setFormData((prev) => ({ ...prev, bio: text }))
					}
					multiline
					numberOfLines={3}
				/>

				{/* Skills Section */}
				<Text style={styles.skillsTitle}>Skills</Text>
				<View style={styles.skillInputContainer}>
					<TextInput
						style={[styles.input, styles.skillNameInput]}
						placeholder="Skill name"
						value={skillInput.name}
						onChangeText={(text) =>
							setSkillInput((prev) => ({ ...prev, name: text }))
						}
					/>
					<TextInput
						style={[styles.input, styles.skillLevelInput]}
						placeholder="Level (1-10)"
						value={skillInput.level.toString()}
						onChangeText={(text) =>
							setSkillInput((prev) => ({ ...prev, level: parseInt(text) || 1 }))
						}
						keyboardType="numeric"
					/>
					<TouchableOpacity style={styles.addSkillButton} onPress={addSkill}>
						<Text style={styles.buttonText}>Add</Text>
					</TouchableOpacity>
				</View>

				{/* Display added skills */}
				{formData.skills.map((skill, index) => (
					<View key={index} style={styles.skillItem}>
						<Text style={styles.skillText}>
							{skill.name} (Level: {skill.level})
						</Text>
						<TouchableOpacity onPress={() => removeSkill(index)}>
							<Text style={styles.removeSkillText}>Remove</Text>
						</TouchableOpacity>
					</View>
				))}

				<TouchableOpacity
					style={styles.createButton}
					onPress={handleCreateProfile}
					disabled={loading}
				>
					<Text style={styles.buttonText}>
						{loading ? 'Creating...' : 'Create Profile'}
					</Text>
				</TouchableOpacity>
			</View>

			{/* Profiles List */}
			<View style={styles.profilesContainer}>
				<Text style={styles.sectionTitle}>Profiles</Text>
				<TouchableOpacity style={styles.refreshButton} onPress={loadProfiles}>
					<Text style={styles.buttonText}>Refresh</Text>
				</TouchableOpacity>

				{loading && <Text>Loading...</Text>}

				{profiles.map((profile) => (
					<View key={profile.user_id} style={styles.profileCard}>
						<Text style={styles.profileName}>{profile.name}</Text>
						<Text style={styles.profileEmail}>{profile.email}</Text>
						{profile.bio && (
							<Text style={styles.profileBio}>{profile.bio}</Text>
						)}

						<View style={styles.skillsContainer}>
							<Text style={styles.skillsHeader}>Skills:</Text>
							{profile.skills.map((skill, index) => (
								<Text key={index} style={styles.skillText}>
									• {skill.name} (Level: {skill.level})
								</Text>
							))}
						</View>

						<TouchableOpacity
							style={styles.deleteButton}
							onPress={() => handleDeleteProfile(profile.user_id)}
						>
							<Text style={styles.buttonText}>Delete</Text>
						</TouchableOpacity>
					</View>
				))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		backgroundColor: '#f5f5f5',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 20,
	},
	healthContainer: {
		padding: 10,
		backgroundColor: 'white',
		borderRadius: 8,
		marginBottom: 20,
	},
	healthText: {
		fontSize: 16,
	},
	healthy: {
		color: 'green',
		fontWeight: 'bold',
	},
	unhealthy: {
		color: 'red',
		fontWeight: 'bold',
	},
	formContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 8,
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 15,
	},
	input: {
		borderWidth: 1,
		borderColor: '#ddd',
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
		backgroundColor: 'white',
	},
	textArea: {
		height: 80,
		textAlignVertical: 'top',
	},
	skillsTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		marginTop: 10,
		marginBottom: 10,
	},
	skillInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 10,
	},
	skillNameInput: {
		flex: 2,
		marginRight: 10,
		marginBottom: 0,
	},
	skillLevelInput: {
		flex: 1,
		marginRight: 10,
		marginBottom: 0,
	},
	addSkillButton: {
		backgroundColor: '#007bff',
		padding: 10,
		borderRadius: 5,
	},
	skillItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#f8f9fa',
		marginBottom: 5,
		borderRadius: 5,
	},
	skillText: {
		fontSize: 14,
	},
	removeSkillText: {
		color: 'red',
		fontSize: 12,
	},
	createButton: {
		backgroundColor: '#28a745',
		padding: 15,
		borderRadius: 5,
		alignItems: 'center',
		marginTop: 10,
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
	},
	profilesContainer: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 8,
	},
	refreshButton: {
		backgroundColor: '#007bff',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		marginBottom: 15,
	},
	profileCard: {
		backgroundColor: '#f8f9fa',
		padding: 15,
		borderRadius: 8,
		marginBottom: 10,
	},
	profileName: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	profileEmail: {
		fontSize: 14,
		color: '#666',
		marginBottom: 5,
	},
	profileBio: {
		fontSize: 14,
		fontStyle: 'italic',
		marginBottom: 10,
	},
	skillsContainer: {
		marginBottom: 10,
	},
	skillsHeader: {
		fontSize: 14,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	deleteButton: {
		backgroundColor: '#dc3545',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
	},
});

export default ProfileMatcherExample;
