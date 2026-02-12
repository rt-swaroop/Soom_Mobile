import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AdminBottomTabNavigator from "./AdminBottomTabNavigator";
import ProfileStackNavigator from "./components/ProfileStackNavigator";

const Stack = createNativeStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AdminTabs" component={AdminBottomTabNavigator} />
            <Stack.Screen name="ProfileStack" component={ProfileStackNavigator} />
        </Stack.Navigator>
    );
};

export default AdminNavigator;
