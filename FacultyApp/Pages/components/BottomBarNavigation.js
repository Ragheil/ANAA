import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../HomeScreen';
import AvailabilityScreen from '../AvailabilityScreen';
import SearchScreen from '../SearchScreen';
import ProfileScreen from '../ProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons if you haven't

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#e91e63', // Color for active tab
        tabBarStyle: { backgroundColor: '#fff' }, // Background color for the tab bar
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Availability" 
        component={AvailabilityScreen} 
        options={{
          tabBarLabel: 'Availability',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="calendar-check" color={color} size={26} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
