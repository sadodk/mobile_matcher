import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type GenderPickerProps = {
	visible: boolean;
	onSelect: (gender: string) => void;
	onCancel: () => void;
};

export default function GenderPicker({
	visible,
	onSelect,
	onCancel,
}: GenderPickerProps) {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onCancel}
		>
			<View style={styles.overlay}>
				<View style={styles.content}>
					<Text style={styles.label}>Select Gender</Text>
					{['male', 'female', 'other'].map((option) => (
						<TouchableOpacity
							key={option}
							style={styles.option}
							onPress={() => onSelect(option)}
						>
							<Text style={styles.optionText}>
								{option.charAt(0).toUpperCase() + option.slice(1)}
							</Text>
						</TouchableOpacity>
					))}
					<TouchableOpacity style={styles.option} onPress={onCancel}>
						<Text style={[styles.optionText, { color: '#888' }]}>Cancel</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.3)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	content: {
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 20,
		width: 250,
		alignItems: 'center',
	},
	label: { fontWeight: 'bold', marginBottom: 10 },
	option: { paddingVertical: 12, width: '100%', alignItems: 'center' },
	optionText: { fontSize: 16, color: '#007bff' },
});
