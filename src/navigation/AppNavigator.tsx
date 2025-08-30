import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

import GetStartedScreen from "../Screens/GetStartedScreen/GetStarted";
import { ROUTES } from "./routes";

export type RootStackParamList = {
    [ROUTES.GET_STARTED]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={ROUTES.GET_STARTED} component={GetStartedScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
