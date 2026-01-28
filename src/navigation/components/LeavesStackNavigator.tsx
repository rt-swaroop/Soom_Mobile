
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '../routes';

import Leaves from '../../screens/Leaves/Leaves/Leaves';
import LeaveHistory from '../../screens/Leaves/Leaves/components/LeaveHistory';
import AddEditLeaves from '../../screens/Leaves/Leaves/components/AddEditLeaves';

const Stack = createNativeStackNavigator();

const LeavesStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={ROUTES.LEAVES} component={Leaves} />
            <Stack.Screen name={ROUTES.LEAVEHISTORY} component={LeaveHistory} />
            <Stack.Screen name={ROUTES.ADDEDITLEAVES} component={AddEditLeaves} />
        </Stack.Navigator>
    );
};

export default LeavesStackNavigator;
