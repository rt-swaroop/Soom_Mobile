import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

import { jwtDecode } from "jwt-decode";
import { ROUTES } from "./routes";
import { logoutUser, setUser } from "../redux/reducers/authReducer";
import { selectAccessToken, selectRefeshToken, selectUser } from "../redux/selector";

import { refreshToken as refreshApi } from "../services/authServices";

import GetStartedScreen from "../screens/Auth/GetStarted/GetStarted";
import LoginScreen from "../screens/Auth/Login/Login";
import RoleSelectionScreen from "../screens/Auth/RoleSelection/RoleSelection";

import MainNavigator from "./BottomTabNavigator";

import { ROLES } from "../utils/constants";

export type RootStackParamList = {
    [ROUTES.GET_STARTED]: undefined;
    [ROUTES.LOGIN]: undefined;
    [ROUTES.ROLE_SELECTION]: undefined;
    [ROUTES.HOME]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const accessToken = useSelector(selectAccessToken);
    const refreshToken = useSelector(selectRefeshToken);

    const [loading, setLoading] = useState(true);

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
        return null;
    }

    const getInitialRoute = () => {
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
                <Stack.Screen name={ROUTES.GET_STARTED} component={GetStartedScreen} />
                <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
                <Stack.Screen name={ROUTES.ROLE_SELECTION} component={RoleSelectionScreen} />
                <Stack.Screen name={ROUTES.HOME} component={MainNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
