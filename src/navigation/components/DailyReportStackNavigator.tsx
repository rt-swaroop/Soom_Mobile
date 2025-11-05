import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LinearGradient from "react-native-linear-gradient";
import { Text } from "react-native";

import { ROUTES } from "../routes";
import { COLORS } from "../../theme/colors";

import DailyReports from "../../Screens/MoreOptionScreen/DailyReportsScreen/DailyReports";
import SubmitDailyReport from "../../Screens/MoreOptionScreen/DailyReportsScreen/components/SubmitDailyReport";

const Stack = createNativeStackNavigator();

const DailyReportStackNavigator = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.DAILYREPORTS} component={DailyReports}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: "transparent" },
                    headerBackground: () => (
                        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={{ flex: 1 }} />
                    ),
                    headerTitle: () => (
                        <Text style={{ color: COLORS.white, fontSize: 20, fontWeight: "700" }}>Daily Reports</Text>
                    ),
                    headerTintColor: COLORS.white,
                }}
            />
            <Stack.Screen
                name={ROUTES.SUBMITDAILYREPORT}
                component={SubmitDailyReport}
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
                            Daily Report
                        </Text>
                    ),
                    headerTintColor: COLORS.white,
                })}
            />
        </Stack.Navigator>
    )

}

export default DailyReportStackNavigator;