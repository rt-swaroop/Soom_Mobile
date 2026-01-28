
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../routes';

import DailyReports from '../../screens/Reports/Reports/DailyReports';
import SubmitDailyReport from '../../screens/Reports/Reports/components/SubmitDailyReport';

const Stack = createNativeStackNavigator();

const ReportsStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.DAILYREPORTS} component={DailyReports} />
            <Stack.Screen name={ROUTES.SUBMITDAILYREPORT} component={SubmitDailyReport} />
        </Stack.Navigator>
    );
};

export default ReportsStackNavigator;
