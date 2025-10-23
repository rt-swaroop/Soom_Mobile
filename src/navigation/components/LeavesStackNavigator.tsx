import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "react-native";

import { COLORS } from "../../theme/colors";
import { ROUTES } from "../routes";

import Leaves from "../../Screens/LeavesScreen/Leaves";
import LeaveHistory from "../../Screens/LeavesScreen/components/LeaveHistory";
import AddEditLeaves from "../../Screens/LeavesScreen/components/AddEditLeaves";

const Stack = createNativeStackNavigator();

const LeavesStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.LEAVES} component={Leaves}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "transparent" },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>Leaves</Text>
                    ),
                    headerTintColor: COLORS.white,
                }}
            />
            <Stack.Screen name={ROUTES.LEAVEHISTORY} component={LeaveHistory}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "transparent" },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>Leave History</Text>
                    ),
                    headerTintColor: COLORS.white,
                }}
            />
            <Stack.Screen
                name={ROUTES.ADDEDITLEAVES}
                component={AddEditLeaves}
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
                            {route.params?.mode === 'edit' ? 'Edit Leave' : 'Apply Leave'}
                        </Text>
                    ),
                    headerTintColor: COLORS.white,
                })}
            />
        </Stack.Navigator>
    );
};

export default LeavesStackNavigator;