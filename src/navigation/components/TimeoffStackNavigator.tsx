
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../routes';

import Timeoff from '../../screens/Timeoff/Timeoff/Timeoff';
import TimeOffHistory from '../../screens/Timeoff/Timeoff/components/TimeOffHistory';
import AddEditTimeoff from '../../screens/Timeoff/Timeoff/components/AddEditTimeoff';

const Stack = createNativeStackNavigator();

const TimeoffStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.TIMEOFF} component={Timeoff} />
            <Stack.Screen name={ROUTES.TIMEOFFHISTORY} component={TimeOffHistory} />
            <Stack.Screen name={ROUTES.ADDEDITTIMEOFF} component={AddEditTimeoff} />
        </Stack.Navigator>
    );
};

export default TimeoffStackNavigator;
