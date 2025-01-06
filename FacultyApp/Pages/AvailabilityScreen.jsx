import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { UserContext } from './components/UserContext'; // Import UserContext
import BottomBar from './components/BottomBar';

const availabilityOptions = [
  { label: 'Available', value: 0, color: '#2196F3' }, // Blue
  { label: 'Offline', value: 1, color: '#F44336' }, // Red
  { label: 'Busy', value: 2, color: '#FF9800' }, // Orange
];

export default function HomeScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext); // Access user info from context
  const [availability, setAvailability] = useState(user?.faculty?.availability ?? availabilityOptions[0].value); // Set initial state based on user availability

  const handleAvailabilityChange = async (value) => {
    setAvailability(value);
    try {
      const response = await fetch(`http://192.168.191.103:3001/faculty/${user.faculty.id}`, { // Update the faculty ID accordingly
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ availability: value }),
      });

      if (!response.ok) throw new Error('Failed to update availability');

      Alert.alert("Success", "Availability updated successfully!", [{ text: "OK" }]);
    } catch (error) {
      Alert.alert("Error", error.message, [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
       
        <Text style={styles.availabilityText}>
          Current Availability: {availabilityOptions.find(option => option.value == availability)?.label}
        </Text>

        <View style={styles.availabilityContainer}>
          {availabilityOptions.map(option => (
            <TouchableOpacity
              key={option.value}
              style={[styles.availabilityButton, { backgroundColor: availability == option.value ? option.color : '#ddd' }]}
              onPress={() => handleAvailabilityChange(option.value)} // Update availability and send to backend
            >
              <Text style={styles.buttonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>


      </View>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
  },
  availabilityText: {
    fontSize: 24,
    marginVertical: 10,
  },
  availabilityContainer: {
    flexDirection: 'column', // Change to column for vertical alignment
    justifyContent: 'space-around',
    marginVertical: 20,
    width: '80%',
  },
  availabilityButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 10, // Adjust margin to create space between buttons
    width: '100%', // Make buttons full width
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
