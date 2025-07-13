import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

type ProfileViewProps = {
	jwtPayload: any;
	apiResponse: string | null;
	onTestMatch: () => void;
	onLogout: () => void;
};

export default function ProfileView({
	jwtPayload,
	apiResponse,
	onTestMatch,
	onLogout,
}: ProfileViewProps) {
	return (
		<View style={styles.profileContainer}>
			<Text style={styles.profileTitle}>Logged in successfully!</Text>
			<ScrollView
				style={styles.profileScroll}
				contentContainerStyle={{ padding: 10 }}
			>
				<Text style={styles.profileSubtitle}>User Attributes:</Text>
				{jwtPayload &&
					Object.entries(jwtPayload).map(([key, value]) => (
						<View key={key} style={styles.attributeRow}>
							<Text style={styles.attributeKey}>{key}:</Text>
							<Text style={styles.attributeValue}>{String(value)}</Text>
						</View>
					))}
				<Text style={styles.profileSubtitle}>Raw Token Data:</Text>
				<Text style={styles.tokenData}>
					{JSON.stringify(jwtPayload, null, 2)}
				</Text>
				<Button title="Test /match Endpoint" onPress={onTestMatch} />
				{apiResponse && (
					<View style={styles.apiResponseBox}>
						<Text style={styles.profileSubtitle}>Match API Response:</Text>
						<Text style={styles.tokenData}>{apiResponse}</Text>
					</View>
				)}
				<Button title="Logout" color="#d9534f" onPress={onLogout} />
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
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
