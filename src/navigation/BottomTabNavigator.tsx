import React, { useState } from "react";
import { useSelector } from "react-redux";

import { View, Text, TouchableOpacity, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

import { COLORS } from "../theme/colors";
import { selectUser } from "../redux/selector";
import { IMAGES } from "../assets/images";

import HomeScreen from "../Screens/BottomNavigationScreens/HomeScreen/Home"
import AttendanceScreen from "../Screens/BottomNavigationScreens/AttendanceScreen/Attendance";
import ProfileScreen from "../Screens/BottomNavigationScreens/ProfileScreen/Profile";

import MoreOptionsModal from "./components/MoreOptionsModal";
import LeavesStackNavigator from "./components/LeavesStackNavigator";
import TimeoffStackNavigator from "./components/TimeoffStackNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

type RootStackParamList = {
    BottomTabs: undefined;
    LeavesStack: undefined
    TimeoffStack: undefined
};

const BottomTabNavigator = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const user = useSelector(selectUser);

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const toggleModal = () => setModalVisible(!isModalVisible);

    const handleSelect = (option: string) => {
        switch (option) {
            case "Leaves":
                navigation.navigate("LeavesStack");
                break;
            case "Time-Off":
                navigation.navigate("TimeoffStack");
                break;
            default:
                console.log("Selected:", option);
        }
        toggleModal();
    };

    return (
        <>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: true,
                    headerStyle: { height: 100, backgroundColor: "transparent", elevation: 0, shadowOpacity: 0, },
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
                        headerTitle: () => {
                            const navigation = useNavigation<NavigationProp<any>>();
                            return (
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => navigation.navigate("Profile")}
                                >
                                    <Image
                                        source={user?.profilePic?.location ? { uri: user?.profilePic?.location } : IMAGES.user}
                                        style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                                    />
                                    <View>
                                        <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: '700' }}>{user?.fullName}</Text>
                                        <Text style={{ color: COLORS.white, fontSize: 12 }}>Online</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        },
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

                <Tab.Screen name="More" component={View}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <Icon name="apps" size={size} color={color} />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            toggleModal();
                        },
                    }}
                />

                <Tab.Screen name="Profile" component={ProfileScreen}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (<Icon name="person" size={size} color={color} />),
                    }}
                />
            </Tab.Navigator>

            <MoreOptionsModal
                visible={isModalVisible}
                onClose={toggleModal}
                onSelect={handleSelect}
            />
        </>
    );
};

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="LeavesStack" component={LeavesStackNavigator} />
            <Stack.Screen name="TimeoffStack" component={TimeoffStackNavigator} />
        </Stack.Navigator>
    );
};

export default MainNavigator;