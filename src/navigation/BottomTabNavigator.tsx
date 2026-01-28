import React, { useState, useRef, useEffect } from "react";

import { View, Text, Animated, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation, NavigationProp, getFocusedRouteNameFromRoute, useNavigationState } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from "../theme/colors";
import { useAppTheme } from "../theme/useAppTheme";

import HomeScreen from "../screens/Dashboard/Home/Home"
import AttendanceScreen from "../screens/Attendance/Attendance/Attendance";
import MoreOptionsModal from "./components/MoreOptionsModal";

import HeaderNotification from "../components/Header/HeaderNotification";
import HeaderProfile from "../components/Header/HeaderProfile";

import LeavesStackNavigator from "./components/LeavesStackNavigator";
import TimeoffStackNavigator from "./components/TimeoffStackNavigator";
import ReportsStackNavigator from "./components/ReportsStackNavigator";
import ShiftsStackNavigator from "./components/ShiftsStackNavigator";
import ProfileStackNavigator from "./components/ProfileStackNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();
    const [isModalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation<NavigationProp<any>>();
    const { isDark } = useAppTheme();

    const toggleModal = () => setModalVisible(!isModalVisible);

    const handleSelect = (option: string) => {
        switch (option) {
            case "Time-Off":
                // @ts-ignore
                navigation.navigate("BottomTabs", { screen: "TimeoffStack" });
                break;
            case "Shifts":
                // @ts-ignore
                navigation.navigate("BottomTabs", { screen: "ShiftsStack" });
                break;
            default:
                console.log("Selected:", option);
        }
        toggleModal();
    };

    const TabIcon = ({ name, color, focused, routeName }: { name: string; color: string; focused: boolean, routeName: string }) => {
        const scale = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

        const routes = useNavigationState(state => state.routes);
        const index = useNavigationState(state => state.index);
        const activeRouteName = routes?.[index]?.name;

        const isMoreTab = routeName === "More";
        const isRedirectActive = activeRouteName === "TimeoffStack" || activeRouteName === "ShiftsStack";
        const isEffectiveFocused = focused || (isMoreTab && isRedirectActive);
        const effectiveColor = isEffectiveFocused ? COLORS.white : color;

        useEffect(() => {
            Animated.spring(scale, {
                toValue: isEffectiveFocused ? 1.15 : 1,
                useNativeDriver: true,
                friction: 6,
                tension: 40
            }).start();
        }, [isEffectiveFocused]);

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {isEffectiveFocused && (
                    <Animated.View
                        style={{
                            position: 'absolute',
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            transform: [{
                                scale: scale.interpolate({
                                    inputRange: [1, 1.15],
                                    outputRange: [0.8, 1]
                                })
                            }]
                        }}
                    />
                )}
                <Animated.View style={{ transform: [{ scale }] }}>
                    <Icon name={name} size={28} color={effectiveColor} />
                </Animated.View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: isDark ? '#111827' : '#F5F7FA' }}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerShown: true,
                    headerStyle: {
                        height: 60 + insets.top,
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerBackground: () => (
                        <View style={{ flex: 1, backgroundColor: isDark ? '#1F2937' : COLORS.primary }}>
                            {!isDark && <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />}
                        </View>
                    ),
                    headerTintColor: COLORS.white,
                    tabBarActiveTintColor: COLORS.white,
                    tabBarInactiveTintColor: isDark ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.5)",
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        height: 70 + insets.bottom,
                        backgroundColor: isDark ? '#1F2937' : COLORS.primary,
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,
                        borderTopWidth: 0,
                        borderWidth: 0,
                        elevation: 20,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        paddingBottom: insets.bottom,
                        paddingTop: 0,
                    },
                    tabBarItemStyle: {
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 70,
                        padding: 0,
                        margin: 0,
                    },
                    tabBarIconStyle: {
                        width: '100%',
                        height: 70,
                        marginTop: 0,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    tabBarIcon: ({ color, focused }) => {
                        let iconName: string = "home";
                        if (route.name === "Home") iconName = "home";
                        else if (route.name === "Attendance") iconName = "access-time";
                        else if (route.name === "Reports") iconName = "description";
                        else if (route.name === "Leaves") iconName = "calendar-today";
                        else if (route.name === "More") iconName = "apps";

                        return <TabIcon name={iconName} color={color} focused={focused} routeName={route.name} />;
                    },
                    headerLeft: () => <HeaderNotification />,
                    headerRight: () => <HeaderProfile />,
                    headerTitleAlign: 'center',
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen}
                    options={{
                        headerTitle: () => (
                            <Text style={{
                                color: COLORS.white,
                                fontSize: 36,
                                fontWeight: '700',
                                fontFamily: Platform.OS === 'ios' ? 'Bradley Hand' : 'cursive',
                                marginTop: Platform.OS === 'ios' ? 0 : 0,
                            }}>Soom</Text>
                        ),
                    }}
                />

                <Tab.Screen name="Attendance" component={AttendanceScreen}
                    options={{
                        headerTitle: "Attendance",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                    }}
                />

                <Tab.Screen name="Reports" component={ReportsStackNavigator}
                    options={({ route }) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                        const hiddenRoutes = ["SubmitDailyReport"];
                        return {
                            headerShown: !hiddenRoutes.includes(routeName),
                            headerTitle: "Daily Reports",
                            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        };
                    }}
                />

                <Tab.Screen name="Leaves" component={LeavesStackNavigator}
                    options={({ route }) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                        const hiddenRoutes = ["AddEditLeaves", "LeaveHistory"];
                        return {
                            headerShown: !hiddenRoutes.includes(routeName),
                            headerTitle: "Leaves",
                            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        };
                    }}
                />

                <Tab.Screen name="More" component={View}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            toggleModal();
                        },
                    }}
                />

                <Tab.Screen name="TimeoffStack" component={TimeoffStackNavigator}
                    options={({ route }) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? "";
                        const hiddenRoutes = ["AddEditTimeoff", "TimeoffHistory"];
                        return {
                            headerShown: !hiddenRoutes.includes(routeName),
                            headerTitle: "Time Off",
                            headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                            tabBarButton: () => null,
                            tabBarItemStyle: { display: 'none' }
                        };
                    }}
                />

                <Tab.Screen name="ShiftsStack" component={ShiftsStackNavigator}
                    options={{
                        headerShown: true,
                        headerTitle: "Shifts",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        tabBarButton: () => null,
                        tabBarItemStyle: { display: 'none' }
                    }}
                />
            </Tab.Navigator>

            <MoreOptionsModal
                visible={isModalVisible}
                onClose={toggleModal}
                onSelect={handleSelect}
            />
        </View>
    );
};

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />

            <Stack.Screen name="ProfileStack" component={ProfileStackNavigator} />

        </Stack.Navigator>
    );
};

export default MainNavigator;