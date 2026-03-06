import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

/* AUTH SCREENS */
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

/* APP SCREENS */
import EquipmentDetailsScreen from "../screens/Equipment/EquipmentDetailsScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import LanguageScreen from "../screens/LanguageScreen";
import WomenSafetyScreen from "../screens/women/WomenSafetyScreen";
import GuideScreen from "../screens/GuideScreen";
import SOSScreen from "../screens/SOS/SOSScreen";
import ComplaintScreen from "../screens/ComplaintScreen";
import PriceCheckScreen from "../screens/PriceCheckScreen";
import CrowdScreen from "../screens/CrowdScreen";
import EquipmentScreen from "../screens/Equipment/EquipmentScreen";
import WomenSafetyDetailScreen from "../screens/women/WomenSafetyDetailScreen";
import SOSDetailScreen from "../screens/SOS/SOSDetailScreen";
import ChatBotScreen from "../screens/ChatBotScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  /* CHECK USER ON APP START */
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const user = await AsyncStorage.getItem("user");

    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  /* LOGIN FUNCTION */
  const loginUser = async (userData:any) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
  };

  /* LOGOUT FUNCTION */
  const logoutUser = async () => {
    await AsyncStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {isLoggedIn ? (

          <>
            <Stack.Screen name="Home" component={HomeScreen} />

            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} logoutUser={logoutUser} />}
            </Stack.Screen>

            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="WomenSafety" component={WomenSafetyScreen} />
            <Stack.Screen name="WomenSafetyDetail" component={WomenSafetyDetailScreen} />
            <Stack.Screen name="Guide" component={GuideScreen} />
            <Stack.Screen name="SOS" component={SOSScreen} />
            <Stack.Screen name="SOSDetail" component={SOSDetailScreen} />
            <Stack.Screen name="Complaint" component={ComplaintScreen} />
            <Stack.Screen name="PriceCheck" component={PriceCheckScreen} />
            <Stack.Screen name="Crowd" component={CrowdScreen} />
            <Stack.Screen name="Equipment" component={EquipmentScreen} />
            <Stack.Screen name="EquipmentDetails" component={EquipmentDetailsScreen} />
            <Stack.Screen name="ChatBot" component={ChatBotScreen} />
          </>

        ) : (

          <>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} loginUser={loginUser} />}
            </Stack.Screen>

            <Stack.Screen name="Register" component={RegisterScreen} />
          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
}