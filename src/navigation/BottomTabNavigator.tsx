import React from "react";

import { View, Text, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

import HomeScreen from "../Screens/HomeScreen/Home";
import AttendanceScreen from "../Screens/AttendanceScreen/Attendance";
import ProfileScreen from "../Screens/ProfileScreen/Profile";

import { COLORS } from "../theme/colors";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: true,
                headerStyle: { height: 100, backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
                headerBackground: () => (
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                ),
                tabBarActiveTintColor: COLORS.white,
                tabBarInactiveTintColor: "rgba(255,255,255,0.6)",
                tabBarLabelStyle: { fontSize: 12, fontWeight: "600", marginBottom: 5 },
                tabBarStyle: { height: 70, backgroundColor: "transparent", position: "absolute", borderTopWidth: 0, elevation: 0 },
                tabBarIcon: ({ color, size }) => {
                    let iconName: string = "home";

                    if (route.name === "Home") iconName = "home";
                    else if (route.name === "Attendance") iconName = "access-time";
                    else if (route.name === "Profile") iconName = "person";

                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarBackground: () => (
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                ),
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/300' }}
                                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                            />
                            <View>
                                <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>Tipparthi Sai Swaroop</Text>
                                <Text style={{ color: COLORS.white, fontSize: 12 }}>Online</Text>
                            </View>
                        </View>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 15 }}>
                            <Icon name="notifications-none" size={28} color={COLORS.white} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tab.Screen name="Attendance" component={AttendanceScreen}
                options={{
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: '700' }}>Attendance</Text>
                    ),
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 15 }}>
                            <Icon name="notifications-none" size={28} color={COLORS.white} />
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tab.Screen name="Profile" component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => <Icon name="person" size={size} color={color} />,
                }}
            />

        </Tab.Navigator>
    );
};

export default BottomTabNavigator;