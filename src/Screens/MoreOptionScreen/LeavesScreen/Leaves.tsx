import React, { useState, useCallback } from "react";

import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { styles } from './Leaves.styles';
import { ROUTES } from "../../../navigation/routes";

import LeaveBalance from "./components/LeaveBalance";
import AppliedLeaves from "./components/AppliedLeaves";

const Leaves = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const refreshCountRef = React.useRef(0);

    const navigation = useNavigation<NavigationProp<any>>();

    const handleRefreshComplete = React.useCallback(() => {
        refreshCountRef.current += 1;
        if (refreshCountRef.current >= 2) {
            refreshCountRef.current = 0;
            setRefreshing(false);
        }
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refreshCountRef.current = 0;
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >
                <LeaveBalance
                    refreshKey={refreshKey}
                    onRefreshComplete={handleRefreshComplete}
                    onHistoryPress={() => navigation.navigate("LeaveHistory")}
                />

                <AppliedLeaves
                    refreshKey={refreshKey}
                    onRefreshComplete={handleRefreshComplete}
                />

                <TouchableOpacity style={styles.applyBtn}
                    onPress={() => navigation.navigate(ROUTES.ADDEDITLEAVES, { mode: 'add' })}
                >
                    <Text style={styles.applyText}>Apply Leave</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Leaves;