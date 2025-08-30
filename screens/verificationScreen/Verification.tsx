import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import axios from 'axios';

type Props = NativeStackScreenProps<RootStackParamList, 'Verification'>;

const Verification = ({ navigation, route }: Props) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  
  const { userData } = route.params;

  const time = ()=>{ const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        setCanResend(true);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}


  useEffect(() => {
      time()
  }, []);

  const handleVerify = async () => {
    if (!otp.trim()) {
      Alert.alert("Error", "Please enter the OTP.");
      return;
    }
    try {
      setLoading(true);
      let email : any = userData.email
  
      const response = await axios.post(
        "https://examvaultserver.onrender.com/user/verify",
        { email, otp },
        { headers: { "Content-Type": "application/json" } }
      );
  
      const data = response.data;
  
      if (data.success) {
        setLoading(false);
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
        
      } else if (data.message === "OTP expired or invalid") {
        setError("OTP expired");
        setLoading(false);
      } else {
        setError("Incorrect OTP");
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("OTP Verification Error:", error.message);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
        const res = await axios.post("https://examvaultserver.onrender.com/user/register", {
            fullname: userData.fullname,
            email: userData.email,
            branch: userData.branch
        });

        if (!res.data.success) {
            Alert.alert("Could not send OTP");
            return;
        }

        // --- Add these two lines to reset the timer ---
        setTimeLeft(300);
        setCanResend(false);
        // --- End of added lines ---

        Alert.alert("OTP Sent to " + userData.email);
    } catch (error) {
        Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
        setLoading(false);
    }
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify Email</Text>
          <Text style={styles.subtitle}>
            We've sent a verification code to{'\n'}
            <Text style={styles.email}>{userData.email}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#999"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />

          {error ? <Text style={styles.error}>
            {error}
          </Text>:""}

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn't receive the code? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Resend</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.timerText}>Resend in {timeLeft}s</Text>
          )}
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, paddingHorizontal: 20, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
  email: { fontWeight: '600', color: '#007bff' },
  form: { gap: 20 },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    letterSpacing: 2,
  },
  verifyButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  verifyButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 },
  footerText: { color: '#666', fontSize: 14 },
  resendText: { color: '#007bff', fontSize: 14, fontWeight: '600' },
  timerText: { color: '#999', fontSize: 14 },
  backButton: { alignSelf: 'center', marginTop: 20 },
  backButtonText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' },
  error:{
    color:"red",
    textAlign:"right"  
  }
});

export default Verification;
