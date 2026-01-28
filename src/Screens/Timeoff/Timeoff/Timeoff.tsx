import React, { useState, useCallback, useMemo } from "react";

import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { createStyles } from './Timeoff.styles';
import { ROUTES } from "../../../navigation/routes";
import { useAppTheme } from "../../../theme/useAppTheme";

import AppliedTimeoff from "./components/AppliedTimeoff";

const Timeoff = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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
                contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />}
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
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.applyBtn}
                    onPress={() => navigation.navigate(ROUTES.ADDEDITTIMEOFF, { mode: 'add' })}
                >
                    <Text style={styles.applyText}>Apply TimeOff</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Timeoff;