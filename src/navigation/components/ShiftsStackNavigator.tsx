import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "react-native";

import { ROUTES } from "../routes";
import { COLORS } from "../../theme/colors";

import ShiftScreen from '../../screens/Shifts/Shifts/Shifts';

const Stack = createNativeStackNavigator();

const ShiftsStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Shifts" component={ShiftScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "transparent" },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>Shifts</Text>
                    ),
                    headerTintColor: COLORS.white,
                }}
            />
        </Stack.Navigator>
    )

}

export default ShiftsStackNavigator;