import React from "react";

import { Text, View, TouchableOpacity } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { styles } from './Leaves.styles';
import { ROUTES } from "../../../navigation/routes";

import LeaveBalance from "./components/LeaveBalance";
import AppliedLeaves from "./components/AppliedLeaves";

const Leaves = () => {

    const navigation = useNavigation<NavigationProp<any>>();

    return (
        <View style={styles.container}>
            <LeaveBalance
                onHistoryPress={() => navigation.navigate("LeaveHistory")}
            />

            <AppliedLeaves />

            <TouchableOpacity style={styles.applyBtn}
                onPress={() => navigation.navigate(ROUTES.ADDEDITLEAVES, { mode: 'add' })}
            >
                <Text style={styles.applyText}>Apply Leave</Text>
            </TouchableOpacity>

        </View>
    );
};

export default Leaves;