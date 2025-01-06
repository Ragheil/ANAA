import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper'; // Use IconButton for clickable icons
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Ensure you have the necessary icon set

const BottomBar = () => {
    const navigation = useNavigation(); // Hook for navigation

    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
                <IconButton
                    icon={() => <MaterialCommunityIcons name="home" size={24} color="#333" />} // Home icon
                    size={30}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Availability')}>
                <IconButton
                    icon={() => <MaterialCommunityIcons name="clock-outline" size={24} color="#333" />} // Availability icon
                    size={30}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Search')}>
                <IconButton
                    icon={() => <MaterialCommunityIcons name="magnify" size={24} color="#333" />} // Search icon
                    size={30}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                <IconButton
                    icon={() => <MaterialCommunityIcons name="account" size={24} color="#333" />} // Profile icon
                    size={30}
                />
            </TouchableOpacity>
        </View>
    );
};

// Styles for the BottomBar
const styles = StyleSheet.create({
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#f8f8f8', // Adjust as needed
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
    },
});

export default BottomBar;
