import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

import { usePushNotifications } from "../hooks/usePushNotifications";
import { clearStoredPushToken } from "../services/pushNotificationService";

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
import ComplaintScreen from "../screens/complaints/ComplaintScreen";
import PriceCheckScreen from "../screens/PriceCheckScreen";
import CrowdScreen from "../screens/Crowd/CrowdScreen";
import MapViewScreen from "../screens/Crowd/MapViewScreen";
import LocationDetailScreen from "../screens/Crowd/LocationDetailScreen";
import HistoryScreen from "../screens/Crowd/HistoryScreen";
import EquipmentScreen from "../screens/Equipment/EquipmentScreen";
import WomenSafetyDetailScreen from "../screens/women/WomenSafetyDetailScreen";
import SOSDetailScreen from "../screens/SOS/SOSDetailScreen";
import ChatBotScreen from "../screens/ChatBotScreen";
import MyComplaintsScreen from "../screens/complaints/MyComplaintsScreen";
import MyOrdersScreen from "../screens/Equipment/MyOrdersScreen";
import PaymentSuccessScreen from "../screens/Equipment/PaymentSuccessScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DebugAxiosErrorsScreen from "../screens/DebugAxiosErrorsScreen";

const Stack = createNativeStackNavigator();

type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  MyComplaints: undefined;
  Dashboard: undefined;
  MyOrders: undefined;
  PaymentSuccess: { paymentId: string; orderId: string; amount: number; equipmentName?: string };
  Language: undefined;
  WomenSafety: undefined;
  WomenSafetyDetail: undefined;
  Guide: undefined;
  SOS: undefined;
  SOSDetail: undefined;
  Complaint: undefined;
  PriceCheck: undefined;
  Crowd: undefined;
  CrowdMap: undefined;
  CrowdLocationDetail: undefined;
  CrowdHistory: undefined;
  Equipment: undefined;
  EquipmentDetails: undefined;
  ChatBot: undefined;
  DebugAxiosErrors: undefined;
};

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigationRef = useRef<any>(null);

  // Push notifications hook
  const {
    permissionStatus,
    isInitialized: notificationsInitialized,
    registerToken,
    initializeNotifications,
  } = usePushNotifications(
    // onNotificationReceived - handle foreground notifications
    (notification) => {
      console.log("Foreground notification:", notification);
    },
    // onNotificationTapped - handle notification tap and navigate
    (response) => {
      handleNotificationTap(response);
    }
  );

  /* CHECK USER ON APP START */
  useEffect(() => {
    checkLogin();
  }, []);

  // Initialize push notifications when user logs in
  useEffect(() => {
    if (isLoggedIn === true) {
      initializeNotifications().catch((err) =>
        console.log("Error initializing notifications:", err)
      );
    }
  }, [isLoggedIn]);

  const checkLogin = async () => {
    const user = await AsyncStorage.getItem("user");

    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  /* LOGIN FUNCTION - also register push token */
  const loginUser = async (userData: any) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));

    // Register push token with backend
    if (userData.id) {
      registerToken(userData.id)
        .then((success) => {
          if (success) {
            console.log("Push token registered successfully");
          } else {
            console.log("Push token registration failed (non-critical)");
          }
        })
        .catch((err) => console.log("Error registering token:", err));
    }

    setIsLoggedIn(true);
  };

  /* LOGOUT FUNCTION */
  const logoutUser = async () => {
    await AsyncStorage.removeItem("user");
    await clearStoredPushToken();
    setIsLoggedIn(false);
  };

  /**
   * Handle notification tap and navigate to appropriate screen
   * Uses notification.request.content.data to determine which screen to open
   */
  const handleNotificationTap = (response: Notifications.NotificationResponse) => {
    try {
      const data = response.notification.request.content.data as any;
      console.log("Notification data:", data);

      if (navigationRef.current && data && data.screen) {
        // Map notification types to screen names
        const screenMap: { [key: string]: string } = {
          welcome: "Home",
          equipment_order: "Equipment",
          complaint: "MyComplaints",
          guide_request: "Guide",
          // Add more mappings as new notification types are added
        };

        const targetScreen = screenMap[data.type as string] || data.screen;
        navigationRef.current.navigate(targetScreen);
      }
    } catch (error) {
      console.log("Error handling notification tap:", error);
    }
  };

  if (isLoggedIn === null) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>

      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {isLoggedIn ? (

          <>
            <Stack.Screen name="Home" component={HomeScreen} />

            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} logoutUser={logoutUser} />}
            </Stack.Screen>
            <Stack.Screen name="MyComplaints" component={MyComplaintsScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="Language" component={LanguageScreen} />
            <Stack.Screen name="WomenSafety" component={WomenSafetyScreen} />
            <Stack.Screen name="WomenSafetyDetail" component={WomenSafetyDetailScreen} />
            <Stack.Screen name="Guide" component={GuideScreen} />
            <Stack.Screen name="SOS" component={SOSScreen} />
            <Stack.Screen name="SOSDetail" component={SOSDetailScreen} />
            <Stack.Screen name="Complaint" component={ComplaintScreen} />
            <Stack.Screen name="PriceCheck" component={PriceCheckScreen} />
            <Stack.Screen name="Crowd" component={CrowdScreen} />
            <Stack.Screen name="CrowdMap" component={MapViewScreen} />
            <Stack.Screen name="CrowdLocationDetail" component={LocationDetailScreen} />
            <Stack.Screen name="CrowdHistory" component={HistoryScreen} />
            <Stack.Screen name="Equipment" component={EquipmentScreen} />
            <Stack.Screen name="EquipmentDetails" component={EquipmentDetailsScreen} />
            <Stack.Screen name="ChatBot" component={ChatBotScreen} />
            <Stack.Screen name="DebugAxiosErrors" component={DebugAxiosErrorsScreen} />
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
