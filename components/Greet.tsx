import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';

const Greet = () => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = async ()=>{
    let name:any = await AsyncStorage.getItem("userInfo")
    name = JSON.parse(name)
    return name.name
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greetText}>
        {getGreeting()}, <Text style={styles.username}>{userName()}!</Text>
      </Text>
      <Text style={styles.subtitle}>Welcome 👋</Text>
    </View>
  );
};

export default Greet;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingTop: 50,
    paddingHorizontal:15,
    paddingVertical:10,
    backgroundColor:"#FFFCFB",
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android shadow
    elevation: 2,
  },
  greetText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    color: '#007bff',
    fontSize:22
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});