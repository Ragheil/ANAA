import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = ({ route, navigation }) => {
  console.log('Route Params:', route.params); // Debug route params

  const { user } = route.params || {};
  const { facultyInfo } = user || {};

  // State to manage input form data if facultyInfo is missing
  const [formData, setFormData] = useState({
    firstname: '',
    middle: '',
    lastname: '',
    age: '',
    rfid: '',
    availability: '',
    status: '',
  });

  const [selectedAvailability, setSelectedAvailability] = useState(facultyInfo?.availability || ''); // Initial value from facultyInfo

  // Handle the change in availability and show confirmation dialog
  const handleAvailabilityChange = (newAvailability) => {
    Alert.alert(
      'Are you sure?',
      `Do you want to change availability to ${newAvailability}?`,
      [
        {
          text: 'Cancel',
          onPress: () => setSelectedAvailability(facultyInfo?.availability || ''),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => setSelectedAvailability(newAvailability),
        },
      ]
    );
  };

  // If facultyInfo is not available, show the input form
  if (!facultyInfo) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter Faculty Info</Text>

        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={formData.firstname}
          onChangeText={(text) => setFormData({ ...formData, firstname: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Middle Name"
          value={formData.middle}
          onChangeText={(text) => setFormData({ ...formData, middle: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={formData.lastname}
          onChangeText={(text) => setFormData({ ...formData, lastname: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="RFID"
          value={formData.rfid}
          onChangeText={(text) => setFormData({ ...formData, rfid: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Status"
          value={formData.status}
          onChangeText={(text) => setFormData({ ...formData, status: text })}
        />

        <Button
          title="Submit"
          onPress={() => {
            // Update the user data with the input values
            console.log('User Info Submitted:', formData);
            navigation.goBack(); // Go back or navigate to another screen
          }}
        />
      </View>
    );
  }

  // If facultyInfo is available, display the data
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {facultyInfo.firstname}!</Text>
      <Text style={styles.info}>Email: {user.email}</Text>
      <Text style={styles.info}>First Name: {facultyInfo.firstname}</Text>
      <Text style={styles.info}>Middle Name: {facultyInfo.middle}</Text>
      <Text style={styles.info}>Last Name: {facultyInfo.lastname}</Text>
      <Text style={styles.info}>Age: {facultyInfo.age}</Text>
      <Text style={styles.info}>RFID: {facultyInfo.rfid}</Text>

      {/* Picker for availability */}
      <Text style={styles.info}>Availability:</Text>
      <Picker
        selectedValue={selectedAvailability}
        style={styles.picker}
        onValueChange={(itemValue) => handleAvailabilityChange(itemValue)}
      >
        <Picker.Item label="Select Availability" value="" />
        <Picker.Item label="1" value="1" />
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
      </Picker>

      <Text style={styles.info}>Status: {facultyInfo.status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  info: {
    marginTop: 10,
    fontSize: 18,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    marginVertical: 10,
  },
  picker: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    marginVertical: 10,
  },
});

export default HomeScreen;
