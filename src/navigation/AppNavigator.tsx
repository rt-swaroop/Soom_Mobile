import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

import { ROUTES } from "./routes";
import { logoutUser, setUser } from "../redux/reducers/authReducer";
import { selectAccessToken, selectRefeshToken, selectUser } from "../redux/selector";

import { refreshToken as refreshApi } from "../services/authServices";

import GetStartedScreen from "../Screens/GetStartedScreen/GetStarted";
import LoginScreen from "../Screens/LoginScreen/Login";
import BottomTabNavigator from "./BottomTabNavigator";

export type RootStackParamList = {
    [ROUTES.GET_STARTED]: undefined;
    [ROUTES.LOGIN]: undefined;
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
                    console.log("Location permission result:", reqResult);
                }
            } catch (err) {
                console.log("Permission error:", err);
            }
        };

        const initAuth = async () => {
            await requestLocationPermission();

            if (refreshToken) {
                try {
                    const res = await refreshApi(refreshToken);
                    dispatch(
                        setUser({
                            user: res.user,
                            accessToken: res.accessToken,
                            refreshToken,
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
    }, [dispatch, refreshToken]);

    if (loading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user && accessToken ? ROUTES.HOME : ROUTES.GET_STARTED}
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name={ROUTES.GET_STARTED} component={GetStartedScreen} />
                <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
                <Stack.Screen name={ROUTES.HOME} component={BottomTabNavigator} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
