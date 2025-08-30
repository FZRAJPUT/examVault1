// screens/SettingsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen({navigation}:any) {
  const [link,setLink] = useState('')

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userInfo');
    } catch (e) {
      // ignore
    } finally {
      if (navigation?.reset) {
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      } else {
        navigation.navigate('Login');
      }
    }
  };

  useEffect(()=>{
    setLink("https://examvault1.vercel.app")
  },[])

  return (
    <ScrollView style={styles.container}>

      {/* 👤 Account Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <TouchableOpacity onPress={()=> navigation.navigate("Profile")} style={styles.rowButton}>
          <Icon name="person-outline" size={22} color="#555" />
          <Text style={styles.rowLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={()=> Linking.openURL(link)} style={styles.rowButton}>
          <Icon name="help-circle" size={25} color="#555" />
          <Text style={styles.rowLabel}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      {/* 🚪 Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Icon name="log-out-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>      
      <Text style={{textAlign:"center"}}>Version 1.0.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f1f1f1',
      paddingHorizontal: 16,
      paddingTop:40,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 6,
      padding: 16,
      marginBottom: 20,
      elevation: 1,
    },
    cardTitle: {
        fontSize:22,
        fontWeight: 'bold',
        color: '#34495e',
        marginBottom: 12,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 10,
    },
    iconLabel: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingLabel: {
      fontSize: 16,
      color: '#333',
    },
    rowButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
    },
    rowLabel: {
      fontSize: 16,
      marginLeft: 10,
      color: '#333',
    },
    logoutButton: {
      backgroundColor: '#ff4d4d',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 14,
      borderRadius: 10,
      marginBottom: 30,
      marginTop: 10,
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
  