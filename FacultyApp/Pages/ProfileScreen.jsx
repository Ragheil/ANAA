import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'; // Import Alert
import BottomBar from './components/BottomBar';
import { UserContext } from './components/UserContext'; // Adjust the import path as necessary
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext); // Accessing user context
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to toggle confirm password visibility
  const [editableUser, setEditableUser] = useState({
    firstname: '',
    middle: '',
    lastname: '',
    age: '',
    email: '',
    password: '', // Add password field
    confirmPassword: '', // Add confirm password field
  });

  // Fetch faculty data using useEffect
  useEffect(() => {
    const fetchFacultyData = async () => {
      if (user?.faculty?.id) {
        try {
          const response = await fetch(`http://192.168.191.103:3001/faculty/profile/${user.user_id}`);
          if (response.ok) {
            const data = await response.json();
            setEditableUser({
              firstname: data.firstName,
              middle: data.middle,
              lastname: data.lastName,
              age: data.age,
              email: data.email,
              password: '', // Keep password field empty for security reasons
              confirmPassword: '',
            });
          } else {
            console.error('Failed to fetch faculty data');
          }
        } catch (error) {
          console.error('Network error:', error);
        }
      }
    };

    fetchFacultyData();
  }, [user]);

  const handleInputChange = (field, value) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSave = async () => {
    if (editableUser.password !== editableUser.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); // Error pop-up for password mismatch
      return; // Early exit if passwords don't match
    }

    try {
      // Remove password fields if they are empty
      const userDataToUpdate = { ...editableUser };
      if (!editableUser.password) {
        delete userDataToUpdate.password;
        delete userDataToUpdate.confirmPassword;
      }

      const response = await fetch(`http://192.168.191.103:3001/edit/faculty/${user.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataToUpdate),
      });

      const responseData = await response.text();

      if (response.ok) {
        const result = JSON.parse(responseData);
        console.log(result.message);
        setIsEditing(false);
        Alert.alert('Success', 'Profile updated successfully'); // Success pop-up
      } else {
        Alert.alert('Error', 'Error updating profile'); // Error pop-up for failed update
        console.error('Error updating profile:', responseData);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error occurred'); // Error pop-up for network errors
      console.error('Network error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.text}>
            {editableUser.email}
          </Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>First Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editableUser.firstname}
              onChangeText={(value) => handleInputChange('firstname', value)}
            />
          ) : (
            <Text style={styles.text}>{editableUser.firstname || 'N/A'}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Middle Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editableUser.middle}
              onChangeText={(value) => handleInputChange('middle', value)}
            />
          ) : (
            <Text style={styles.text}>{editableUser.middle || 'N/A'}</Text>
          )}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Last Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={editableUser.lastname}
              onChangeText={(value) => handleInputChange('lastname', value)}
            />
          ) : (
            <Text style={styles.text}>{editableUser.lastname || 'N/A'}</Text>
          )}
        </View>

        {/* Password Input with Visibility Toggle */}
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Password:</Text>
          {isEditing ? (
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputWithIcon}
                value={editableUser.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!passwordVisible} // Toggle secure text entry
                placeholder="Enter new password"
              />
              <TouchableOpacity style={styles.iconStyle} onPress={() => setPasswordVisible(!passwordVisible)}>
                <Icon name={passwordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.text}>********</Text> // Mask the password
          )}
        </View>

        {/* Confirm Password Input with Visibility Toggle */}
        {isEditing && (
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Confirm Password:</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputWithIcon}
                value={editableUser.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry={!confirmPasswordVisible} // Toggle secure text entry
                placeholder="Confirm new password"
              />
              <TouchableOpacity style={styles.iconStyle} onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Icon name={confirmPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Button
          title={isEditing ? 'Save' : 'Edit'}
          onPress={isEditing ? handleSave : () => setIsEditing(true)}
          color="#007BFF"
        />
      </ScrollView>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  infoContainer: {
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    paddingRight: 40, // Add padding for icon space
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
  },
  iconStyle: {
    position: 'absolute',
    right: 10, // Align the icon to the right inside the input field
    top: 12,   // Adjust top positioning
  },
});
