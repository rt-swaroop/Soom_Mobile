import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "react-native";

import { ROUTES } from "../routes";
import { COLORS } from "../../theme/colors";

import Timeoff from "../../Screens/TimeoffScreen/Timeoff";
import AddEditTimeoff from "../../Screens/TimeoffScreen/components/AddEditTimeoff";
import TimeOffHistory from "../../Screens/TimeoffScreen/components/TimeOffHistory";

const Stack = createNativeStackNavigator();

const TimeoffStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.TIMEOFF} component={Timeoff}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "transparent" },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>Timeoff</Text>
                    ),
                    headerTintColor: COLORS.white,
                }}
            />
            <Stack.Screen name={ROUTES.TIMEOFFHISTORY} component={TimeOffHistory}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "transparent" },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>TimeOff History</Text>
                    ),
                    headerTintColor: COLORS.white,
                }}
            />
            <Stack.Screen
                name={ROUTES.ADDEDITTIMEOFF}
                component={AddEditTimeoff}
                options={({
                    route,
                }: {
                    route: { params?: { mode?: string } };
                }) => ({
                    headerShown: true,
                    headerStyle: { backgroundColor: 'transparent' },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>
                            {route.params?.mode === 'edit' ? 'Edit TimeOff' : 'Apply TimeOff'}
                        </Text>
                    ),
                    headerTintColor: COLORS.white,
                })}
            />
        </Stack.Navigator>
    )

}

export default TimeoffStackNavigator;