import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { UserContext } from './components/UserContext';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.put(`http://localhost:3001/faculty/${user.id}/status`, { availability: newStatus });
      setUser({ ...user, availability: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}</Text>
      <Text style={styles.status}>Current Status: {user.availability}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Available" color="#28a745" onPress={() => handleStatusChange(0)} />
        <Button title="Busy" color="#ff8c00" onPress={() => handleStatusChange(2)} />
        <Button title="Offline" color="#dc3545" onPress={() => handleStatusChange(1)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default HomeScreen;