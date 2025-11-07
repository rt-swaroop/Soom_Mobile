import React, { useState, useCallback } from "react";

import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { styles } from './Timeoff.styles';
import { ROUTES } from "../../../navigation/routes";

import AppliedTimeoff from "./components/AppliedTimeoff";

const Timeoff = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const navigation = useNavigation<NavigationProp<any>>();

    const handleRefreshComplete = useCallback(() => {
        setRefreshing(false);
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setRefreshKey(prev => prev + 1);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                showsVerticalScrollIndicator={false}
            >

                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => navigation.navigate(ROUTES.TIMEOFFHISTORY)}
                >
                    <Text style={styles.historyButtonText}>TimeOff History</Text>
                </TouchableOpacity>

                <AppliedTimeoff
                    refreshKey={refreshKey}
                    onRefreshComplete={handleRefreshComplete}
                />

                <TouchableOpacity style={styles.applyBtn}
                    onPress={() => navigation.navigate(ROUTES.ADDEDITTIMEOFF, { mode: 'add' })}
                >
                    <Text style={styles.applyText}>Apply TimeOff</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Timeoff;