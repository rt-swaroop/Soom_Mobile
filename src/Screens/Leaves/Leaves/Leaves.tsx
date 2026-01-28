import React, { useState, useMemo } from "react";

import { Text, View, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { createStyles } from './Leaves.styles';
import { ROUTES } from "../../../navigation/routes";
import { useAppTheme } from "../../../theme/useAppTheme";

import LeaveBalance from "./components/LeaveBalance";
import AppliedLeaves from "./components/AppliedLeaves";

const Leaves = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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
                contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />}
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
            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                <TouchableOpacity style={styles.applyBtn}
                    onPress={() => navigation.navigate(ROUTES.ADDEDITLEAVES, { mode: 'add' })}
                >
                    <Text style={styles.applyText}>Apply Leave</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Leaves;