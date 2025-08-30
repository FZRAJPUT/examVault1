import axios from "axios";
import React, { createContext, useState, ReactNode } from "react";
import { Alert } from "react-native";

// Define the shape of our context
interface StoreContextType {
  details: any;
  getUser: (email: string) => Promise<void>;
}

// Create context with default value as undefined
export const StoreContext = createContext<StoreContextType | undefined>(undefined);

const StoreContextProvider = ({ children }: { children: ReactNode }) => {
  const [details, setDetails] = useState<any>("Subhash");

  const getUser = async (email: string) => {
    try {
      const res = await axios.post(
        "https://examvaultserver.onrender.com/user/register",
        { email }
      );

      if (res.data.success) {
        setDetails(res.data.user);
      } else {
        Alert.alert("Error", res.data.message || "Failed to fetch user");
      }
    } catch (error: any) {
      console.error("Error fetching user:", error?.response?.data || error.message);
      Alert.alert("Error", "Something went wrong while fetching user data.");
    }
  };

  return (
    <StoreContext.Provider value={{ details, getUser }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
