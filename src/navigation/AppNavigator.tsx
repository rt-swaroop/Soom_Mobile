import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

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
        const initAuth = async () => {
            if (refreshToken) {
                try {
                    const res = await refreshApi(refreshToken);
                    dispatch(setUser({
                        user: res.user,
                        accessToken: res.accessToken,
                        refreshToken,
                    }));
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
