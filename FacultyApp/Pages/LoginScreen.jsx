import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { UserContext } from './components/UserContext'; // Import UserContext

export default function LoginScreen({ navigation }) {
  const { setUser } = useContext(UserContext); // Access setUser from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Attempting to log in with:', { email, password });
    try {
      const response = await axios.post('http://10.0.2.2:3001/login', {
        email,
        password,
      });
      console.log('Login response:', response.data);
  
      if (response.data.message === 'Login successful') {
        // Store all user and faculty info in context
        const userInfo = {
          user_id: response.data.user_id,
          name: response.data.name,
          email: response.data.email,
          faculty: response.data.facultyInfo, // Get all faculty info from response
        };
        setUser(userInfo); // Update user context
        navigation.navigate('Home', { user: userInfo });
        setPassword('')
      } else {
        console.log('Login failed:', response.data.message);
        Alert.alert('Login Failed', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Failed', 'Error during login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});