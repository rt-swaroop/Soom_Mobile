import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

import { jwtDecode } from "jwt-decode";
import { ROUTES } from "./routes";
import { logoutUser, setUser } from "../redux/reducers/authReducer";
import { selectAccessToken, selectRefeshToken, selectUser } from "../redux/selector";

import { refreshToken as refreshApi, checkAppVersion } from "../services/authServices";

import GetStartedScreen from "../screens/Auth/GetStarted/GetStarted";
import LoginScreen from "../screens/Auth/Login/Login";
import RoleSelectionScreen from "../screens/Auth/RoleSelection/RoleSelection";
import NotificationsScreen from "../screens/Notifications/Notifications";
import NotificationPreferencesScreen from '../screens/ProfileScreen/NotificationPreferences';
import PermissionManagerScreen from '../screens/ProfileScreen/PermissionManager';

import LauncherScreen from "../screens/Auth/Launcher/Launcher";
import UpdateRequiredScreen from "../screens/Auth/UpdateRequired/UpdateRequiredScreen";

import MainNavigator from "./BottomTabNavigator";

import { ROLES } from "../utils/constants";

export type RootStackParamList = {
    [ROUTES.GET_STARTED]: undefined;
    [ROUTES.LAUNCHER]: undefined;
    [ROUTES.UPDATE_REQUIRED]: { updateUrl: string; message: string };
    [ROUTES.LOGIN]: undefined;
    [ROUTES.ROLE_SELECTION]: undefined;
    [ROUTES.HOME]: undefined;
    [ROUTES.NOTIFICATIONS]: undefined;
    [ROUTES.NOTIFICATION_PREFERENCES]: undefined;
    [ROUTES.PERMISSION_MANAGER]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const accessToken = useSelector(selectAccessToken);
    const refreshToken = useSelector(selectRefeshToken);

    const [loading, setLoading] = useState(true);
    const [updateRequired, setUpdateRequired] = useState<{ required: boolean; url: string; message: string }>({
        required: false,
        url: "",
        message: ""
    });

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const permission =
                    Platform.OS === "ios"
                        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
                        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

                const result = await check(permission);

                if (result === RESULTS.DENIED || result === RESULTS.BLOCKED) {
                    const reqResult = await request(permission);
                }
            } catch (err) {
                console.log("Permission error:", err);
            }
        };

        const initAuth = async () => {
            const currentVersion = DeviceInfo.getVersion();
            const platform = Platform.OS;

            try {
                const verCheck = await checkAppVersion(platform, currentVersion);
                if (verCheck.needsUpdate) {
                    setUpdateRequired({
                        required: true,
                        url: verCheck.updateUrl,
                        message: verCheck.message
                    });
                    setLoading(false);
                    return;
                }
            } catch (err) {
                console.log("Version check failed, proceeding...", err);
            }

            await requestLocationPermission();

            let shouldRefresh = true;

            if (accessToken) {
                try {
                    const decoded: any = jwtDecode(accessToken);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp && decoded.exp > currentTime + 300) {
                        shouldRefresh = false;
                    }
                } catch (e) {
                    console.log("Token decode failed", e);
                }
            }

            if (refreshToken && shouldRefresh) {
                try {
                    const res = await refreshApi(refreshToken);
                    dispatch(
                        setUser({
                            user: res.user,
                            accessToken: res.accessToken,
                            refreshToken: res.refreshToken || refreshToken,
                        })
                    );
                } catch (err) {
                    console.log("Refresh failed at startup:", err);
                    dispatch(logoutUser());
                }
            }
            setLoading(false);
        };

        initAuth();
    }, [dispatch, refreshToken, accessToken]);

    if (loading) {
        return <LauncherScreen />;
    }

    const getInitialRoute = () => {
        if (updateRequired.required) return ROUTES.UPDATE_REQUIRED;
        if (!user || !accessToken) return ROUTES.GET_STARTED;

        if (user.role === ROLES.COMPANY_ADMIN) {
            return ROUTES.ROLE_SELECTION;
        }

        return ROUTES.HOME;
    };

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={getInitialRoute()}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name={ROUTES.LAUNCHER} component={LauncherScreen} />
                <Stack.Screen name={ROUTES.UPDATE_REQUIRED} component={UpdateRequiredScreen} initialParams={{ updateUrl: updateRequired.url, message: updateRequired.message }} />
                <Stack.Screen name={ROUTES.GET_STARTED} component={GetStartedScreen} />
                <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
                <Stack.Screen name={ROUTES.ROLE_SELECTION} component={RoleSelectionScreen} />
                <Stack.Screen name={ROUTES.HOME} component={MainNavigator} />
                <Stack.Screen name={ROUTES.NOTIFICATIONS} component={NotificationsScreen} options={{ headerShown: false }} />
                <Stack.Screen name={ROUTES.NOTIFICATION_PREFERENCES} component={NotificationPreferencesScreen} options={{ headerShown: false }} />
                <Stack.Screen name={ROUTES.PERMISSION_MANAGER} component={PermissionManagerScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
