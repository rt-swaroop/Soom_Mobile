import React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { styles } from './Timeoff.styles';
import { ROUTES } from "../../navigation/routes";

// import LeaveBalance from "./components/LeaveBalance";
import AppliedTimeoff from "./components/AppliedTimeoff";

const Timeoff = () => {

    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <View style={styles.container}>
            {/* <LeaveBalance
                onHistoryPress={() => navigation.navigate("LeaveHistory")}
            /> */}

            <TouchableOpacity
                style={styles.historyButton}
                onPress={() => navigation.navigate(ROUTES.TIMEOFFHISTORY)}
            >
                <Text style={styles.historyButtonText}>TimeOff History</Text>
            </TouchableOpacity>


            <AppliedTimeoff />

            <TouchableOpacity style={styles.applyBtn}
                onPress={() => navigation.navigate(ROUTES.ADDEDITTIMEOFF, { mode: 'add' })}
            >
                <Text style={styles.applyText}>Apply TimeOff</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Timeoff;