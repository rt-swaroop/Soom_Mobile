import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import { ROUTES } from "./routes";

import GetStartedScreen from "../Screens/GetStartedScreen/GetStarted";
import LoginScreen from "../Screens/LoginScreen/Login";
import HomeScreen from "../Screens/HomeScreen/Home";

export type RootStackParamList = {
    [ROUTES.GET_STARTED]: undefined;
    [ROUTES.LOGIN]: undefined;
    [ROUTES.HOME]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={ROUTES.GET_STARTED} component={GetStartedScreen} />
                <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
                <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
