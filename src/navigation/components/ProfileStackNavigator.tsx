import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ROUTES } from "../routes";

import ProfileScreen from "../../screens/ProfileScreen/Profile";
import ProfileDetailsScreen from "../../screens/ProfileScreen/ProfileDetails/ProfileDetails";

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
            <Stack.Screen name={ROUTES.PROFILE_DETAILS} component={ProfileDetailsScreen} />
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;
