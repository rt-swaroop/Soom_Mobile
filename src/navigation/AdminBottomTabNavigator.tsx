import React, { useRef, useEffect, useState } from "react";

import { View, Text, Animated, Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useNavigationState } from "@react-navigation/native";

import { COLORS } from "../theme/colors";
import { useAppTheme } from "../theme/useAppTheme";
import { ROUTES } from "./routes";

import AdminDashboard from "../screens/Admin/Dashboard/AdminDashboard";
import AdminAttendance from "../screens/Admin/Attendance/AdminAttendance";
import AdminLeaves from "../screens/Admin/Leaves/AdminLeaves";
import AdminEmployees from "../screens/Admin/Employees/AdminEmployees";
import AdminShifts from "../screens/Admin/Shifts/AdminShifts";
import AdminDailyReports from "../screens/Admin/Reports/AdminDailyReports";
import AdminMoreOptionsModal from "./components/AdminMoreOptionsModal";

import HeaderNotification from "../components/Header/HeaderNotification";
import HeaderProfile from "../components/Header/HeaderProfile";

const Tab = createBottomTabNavigator();

const HeaderLeft = () => <HeaderNotification />;
const HeaderRight = () => <HeaderProfile />;

const TabIcon = ({ name, color, focused, routeName }: { name: string; color: string; focused: boolean, routeName: string }) => {
    const scale = useRef(new Animated.Value(focused ? 1.15 : 1)).current;

    const routes = useNavigationState(state => state.routes);
    const index = useNavigationState(state => state.index);
    const activeRouteName = routes?.[index]?.name;

    const isMoreTab = routeName === "AdminMore";
    const isRedirectActive = activeRouteName === ROUTES.ADMIN_SHIFTS || activeRouteName === ROUTES.ADMIN_USERS;
    const isEffectiveFocused = focused || (isMoreTab && isRedirectActive);
    const effectiveColor = isEffectiveFocused ? COLORS.white : color;

    useEffect(() => {
        Animated.spring(scale, {
            toValue: isEffectiveFocused ? 1.15 : 1,
            useNativeDriver: true,
            friction: 6,
            tension: 40
        }).start();
    }, [isEffectiveFocused, scale]);

    return (
        <View style={styles.tabIconContainer}>
            {isEffectiveFocused && (
                <Animated.View
                    style={[
                        styles.highlightCircle,
                        {
                            transform: [{
                                scale: scale.interpolate({
                                    inputRange: [1, 1.15],
                                    outputRange: [0.8, 1]
                                })
                            }]
                        }
                    ]}
                />
            )}
            <Animated.View style={{ transform: [{ scale }] }}>
                <Icon name={name} size={28} color={effectiveColor} />
            </Animated.View>
        </View>
    );
};

const AdminHeaderBackground = () => {
    const { isDark } = useAppTheme();
    return (
        <View style={[styles.headerBackground, isDark ? styles.darkBG : styles.primaryBG]}>
            {!isDark && <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.flex1} />}
        </View>
    );
};

const AdminDashboardHeaderTitle = () => (
    <Text style={styles.headerTitle}>Soom</Text>
);

const AdminTabBarIcon = ({ routeName, color, focused }: { routeName: string; color: string; focused: boolean }) => {
    let iconName: string = "home";
    if (routeName === ROUTES.ADMIN_DASHBOARD) iconName = "home";
    else if (routeName === ROUTES.ADMIN_ATTENDANCE) iconName = "access-time";
    else if (routeName === ROUTES.ADMIN_LEAVES) iconName = "calendar-today";
    else if (routeName === ROUTES.ADMIN_DAILY_REPORTS) iconName = "description";
    else if (routeName === "AdminMore") iconName = "apps";

    return <TabIcon name={iconName} color={color} focused={focused} routeName={routeName} />;
};

const DashboardIcon = (props: any) => <AdminTabBarIcon {...props} routeName={ROUTES.ADMIN_DASHBOARD} />;
const AttendanceIcon = (props: any) => <AdminTabBarIcon {...props} routeName={ROUTES.ADMIN_ATTENDANCE} />;
const LeavesIcon = (props: any) => <AdminTabBarIcon {...props} routeName={ROUTES.ADMIN_LEAVES} />;
const DailyReportsIcon = (props: any) => <AdminTabBarIcon {...props} routeName={ROUTES.ADMIN_DAILY_REPORTS} />;
const MoreIcon = (props: any) => <AdminTabBarIcon {...props} routeName="AdminMore" />;

const AdminBottomTabNavigator = () => {
    const insets = useSafeAreaInsets();
    const { isDark } = useAppTheme();
    const [isMoreModalVisible, setMoreModalVisible] = useState(false);

    const navigation = useNavigation<any>();
    const toggleMoreModal = () => setMoreModalVisible(!isMoreModalVisible);

    const handleSelectMore = (option: string) => {
        switch (option) {
            case "Shifts":
                navigation.navigate("AdminTabs", { screen: ROUTES.ADMIN_SHIFTS });
                break;
            case "Users":
                navigation.navigate("AdminTabs", { screen: ROUTES.ADMIN_USERS });
                break;
            default:
                console.log("Admin Selected More:", option);
        }
        toggleMoreModal();
    };

    return (
        <View style={[styles.container, isDark ? styles.darkMainBG : styles.lightMainBG]}>
            <Tab.Navigator
                screenOptions={({ route: _route }) => ({
                    headerShown: true,
                    headerStyle: {
                        height: 60 + insets.top,
                        borderBottomWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    headerBackground: AdminHeaderBackground,
                    headerTintColor: COLORS.white,
                    tabBarActiveTintColor: COLORS.white,
                    tabBarInactiveTintColor: isDark ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.5)",
                    tabBarShowLabel: false,
                    tabBarStyle: [
                        styles.tabBar,
                        isDark ? styles.darkBG : styles.primaryBG,
                        {
                            height: 70 + insets.bottom,
                            paddingBottom: insets.bottom,
                        }
                    ],
                    tabBarItemStyle: styles.tabBarItem,
                    tabBarIconStyle: styles.tabBarIcon,
                    headerLeft: HeaderLeft,
                    headerRight: HeaderRight,
                    headerTitleAlign: 'center',
                })}
            >
                <Tab.Screen
                    name={ROUTES.ADMIN_DASHBOARD}
                    component={AdminDashboard}
                    options={{
                        headerTitle: AdminDashboardHeaderTitle,
                        tabBarIcon: DashboardIcon,
                    }}
                />
                <Tab.Screen
                    name={ROUTES.ADMIN_ATTENDANCE}
                    component={AdminAttendance}
                    options={{
                        headerTitle: "Team Attendance",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        tabBarIcon: AttendanceIcon,
                    }}
                />
                <Tab.Screen
                    name={ROUTES.ADMIN_LEAVES}
                    component={AdminLeaves}
                    options={{
                        headerTitle: "Approvals",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        tabBarIcon: LeavesIcon,
                    }}
                />
                <Tab.Screen
                    name={ROUTES.ADMIN_DAILY_REPORTS}
                    component={AdminDailyReports}
                    options={{
                        headerTitle: "Team Daily Reports",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        tabBarIcon: DailyReportsIcon,
                    }}
                />
                <Tab.Screen
                    name="AdminMore"
                    component={View}
                    options={{
                        headerShown: false,
                        tabBarIcon: MoreIcon,
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            toggleMoreModal();
                        },
                    }}
                />
                <Tab.Screen
                    name={ROUTES.ADMIN_SHIFTS}
                    component={AdminShifts}
                    options={{
                        headerTitle: "Team Shifts",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        tabBarButton: () => null,
                        tabBarItemStyle: { display: 'none' }
                    }}
                />
                <Tab.Screen
                    name={ROUTES.ADMIN_USERS}
                    component={AdminEmployees}
                    options={{
                        headerTitle: "Users",
                        headerTitleStyle: { fontWeight: '700', fontSize: 18 },
                        tabBarButton: () => null,
                        tabBarItemStyle: { display: 'none' }
                    }}
                />
            </Tab.Navigator>
            <AdminMoreOptionsModal
                visible={isMoreModalVisible}
                onClose={toggleMoreModal}
                onSelect={handleSelectMore}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    highlightCircle: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.12)',
    },
    tabBar: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderTopWidth: 0,
        borderWidth: 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        paddingTop: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    tabBarItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        padding: 0,
        margin: 0,
    },
    tabBarIcon: {
        width: '100%',
        height: 70,
        marginTop: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: COLORS.white,
        fontSize: 36,
        fontWeight: '700',
        fontFamily: Platform.OS === 'ios' ? 'Bradley Hand' : 'cursive',
        marginTop: Platform.OS === 'ios' ? 0 : 0,
    },
    flex1: {
        flex: 1,
    },
    headerBackground: {
        flex: 1,
    },
    primaryBG: {
        backgroundColor: COLORS.primary,
    },
    darkBG: {
        backgroundColor: '#1F2937',
    },
    darkMainBG: {
        backgroundColor: '#111827',
    },
    lightMainBG: {
        backgroundColor: '#F5F7FA',
    },
});

export default AdminBottomTabNavigator;
