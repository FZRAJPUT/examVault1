import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Alert, 
  TouchableOpacity, 
  ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import axios from 'axios';

interface User {
  id?: string | number;
  name?: string;
  email?: string;
  branch?: string;
  profile?: string;
}

interface ProfileProps {
  navigation: any;
}

const Profile: React.FC<ProfileProps> = ({ navigation }) => {
  const [user, setUser] = useState<User>({});
  const [uploading, setUploading] = useState<boolean>(false);

  const getBranchFullForm = (branch: string) => {
    const branchMap: { [key: string]: string } = {
      ME: "Mechanical Engineering",
      CSE: "Computer Science Engineering",
      CE: "Civil Engineering",
      EE: "Electrical Engineering",
    };
    return branchMap[branch?.toUpperCase()] || branch;
  };

  const fetchUserDetails = async (): Promise<void> => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");
      if (userInfo) {
        const parsedUser: User = JSON.parse(userInfo);
        setUser(parsedUser);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load user details");
    }
  };

  const showImagePicker = (): void => {
    openGallery()
  };


  const openGallery = (): void => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = (response: ImagePickerResponse): void => {
    if (response.didCancel || response.errorMessage) {
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      uploadProfilePicture(asset);
    }
  };

  const uploadProfilePicture = async (asset: any): Promise<void> => {
    setUploading(true);

    try {
      const formData = new FormData();
      
      // Add the image file with field name 'profileImage' to match your backend
      formData.append('profileImage', {
        uri: asset.uri,
        type: asset.type || 'image/jpeg',
        name: asset.fileName || 'profile.jpg',
      } as any);

      // Add email as your backend expects it
      if (user.email) {
        formData.append('email', user.email);
      } else {
        Alert.alert("Error", "User email not found. Please login again.");
        return;
      }

      const response = await fetch('https://examvaultserver.onrender.com/user/upload-profile', {
        method: 'POST',
        headers: {
          // Don't set Content-Type for FormData, let the browser set it with boundary
          // Add authorization header if needed
          // 'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Update user state with new profile picture from backend response
        const updatedUser: User = { ...user, profile: result.data.url };
        setUser(updatedUser);
        
        // Update AsyncStorage with profilePicture field to match backend
        const userToStore = { ...updatedUser, profilePicture: result.data.url };
        await AsyncStorage.setItem("userInfo", JSON.stringify(userToStore));
        
        Alert.alert("Success", result.message || "Profile picture updated successfully!");
      } else {
        Alert.alert("Error", result.message || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={showImagePicker} style={styles.imageContainer}>
            <Image
              source={{ 
                uri: user.profile || 'https://via.placeholder.com/150/cccccc/666666?text=No+Image' 
              }}
              style={styles.profileImage}
            />
            {uploading && (
              <View style={styles.uploadingOverlay}>
                <ActivityIndicator size="large" color="#4F46E5" />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Text style={styles.cameraIconText}>+</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name}</Text>
        </View>

        {/* Details */}
        <Text style={styles.value}>Email</Text>
        <Text style={styles.label}>{user.email}</Text>

        <Text style={styles.value}>Branch</Text>
        <Text style={styles.label}>{getBranchFullForm(user.branch)}</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#4F46E5",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 15,
    right: 10,
    backgroundColor: "#4F46E5",
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  cameraIconText: {
    fontSize: 18,
    color:"#fff"
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  changePhotoButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#4F46E5",
    borderRadius: 15,
  },
  changePhotoText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#4F46E5",
  },
  label: {
    fontSize: 15,
    color: "#555",
  },
});