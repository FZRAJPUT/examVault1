import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './homeScreen/Home';
import SettingsScreen from './settingScreen/Setting';
import Icon from 'react-native-vector-icons/Ionicons';



const Tab = createBottomTabNavigator();

export default function Main() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    headerShown: true,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="settings-outline" size={size} color={color} />
                    ),
                }}
            />

        </Tab.Navigator>
    );
}
