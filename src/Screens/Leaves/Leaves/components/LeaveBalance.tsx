/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { Text, View, TouchableOpacity, Platform, UIManager, LayoutAnimation, ScrollView, Animated } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";

import { createStyles } from '../Leaves.styles'
import { useAppTheme } from "../../../../theme/useAppTheme";

import { selectUser } from "../../../../redux/selector";

import { getLeaveBalance, getLeaveTypes } from "../../../../services/leavesServices";
import { LeaveBalanceSkeleton } from "../../../../components/Skeleton/LeaveSkeleton";

type LeaveType = {
    available: number;
    used: number;
    total: number;
};

type BalanceCard = {
    key: string;
    label: string;
    icon: string;
    color: string;
    data: LeaveType;
};

interface Props {
    onHistoryPress?: () => void;
    refreshKey?: number;
    onRefreshComplete?: () => void;
}

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LeaveBalance = ({ onHistoryPress, refreshKey, onRefreshComplete }: Props) => {
    const { theme } = useAppTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

    const [balanceCards, setBalanceCards] = useState<BalanceCard[]>([]);
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const getIconForLeaveType = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('casual')) return 'beach';
        if (lowerName.includes('sick')) return 'hospital-box';
        if (lowerName.includes('special')) return 'star-outline';
        if (lowerName.includes('comp') || lowerName.includes('earned')) return 'briefcase-check';
        if (lowerName.includes('maternity') || lowerName.includes('paternity')) return 'baby-face-outline';
        return 'calendar-check';
    };

    const getColorForLeaveType = (name: string, defaultColor: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('casual')) return '#FF9F43';
        if (lowerName.includes('sick')) return '#28C76F';
        if (lowerName.includes('special')) return '#A855F7';
        if (lowerName.includes('comp') || lowerName.includes('earned')) return '#00CFE8';
        if (lowerName.includes('maternity') || lowerName.includes('paternity')) return '#F472B6';
        return defaultColor || '#2563EB';
    };

    const fetchLeaveBalance = async () => {
        const subscriberId = user?.companyId?._id;
        if (!subscriberId || !user?._id) return;

        setLoading(true);
        try {
            const typesResponse = await getLeaveTypes(subscriberId);
            const leaveTypes = typesResponse?.leaveTypes || [];

            const balancesResponse = await getLeaveBalance(user._id);
            const userBalancesMap = balancesResponse?.balances || {};

            const mapped: BalanceCard[] = leaveTypes.map((type: any) => {
                const balanceData = userBalancesMap[type._id] || { available: 0, used: 0, total: 0 };

                return {
                    key: type._id,
                    label: type.leaveTypeName,
                    icon: getIconForLeaveType(type.leaveTypeName),
                    color: getColorForLeaveType(type.leaveTypeName, type.leaveTypeColor),
                    data: {
                        available: balanceData.available,
                        used: balanceData.used,
                        total: balanceData.total,
                    },
                };
            });

            setBalanceCards(mapped);
        } catch (error) {
            console.error("Error fetching leave balance:", error);
            showMessage({
                message: "Error fetching leave balance",
                description: "Unable to retrieve leave balance. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchLeaveBalance();
        }, [user?._id])
    );

    React.useEffect(() => {
        if (typeof refreshKey === 'number' && refreshKey > 0) {
            fetchLeaveBalance().finally(() => {
                onRefreshComplete?.();
            });
        }
    }, [refreshKey]);

    const rotateAnim = React.useRef(new Animated.Value(0)).current;

    const toggleCollapse = () => {
        LayoutAnimation.configureNext({
            duration: 300,
            create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.spring, springDamping: 0.7 },
            delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
        });

        const toValue = collapsed ? 1 : 0;
        Animated.timing(rotateAnim, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start();

        setCollapsed((prev) => !prev);
    };

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={toggleCollapse} activeOpacity={0.7}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <Icon name="calendar-month-outline" size={22} color="#2563EB" />
                        <Text style={styles.cardTitle}>Leave Balance</Text>
                    </View>

                    <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                        <Icon name="chevron-down" size={24} color={theme.text} />
                    </Animated.View>
                </View>
            </TouchableOpacity>

            {!collapsed && (
                <>
                    {loading ? (
                        <LeaveBalanceSkeleton />
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.balanceGrid}
                        >
                            {balanceCards.map((item) => (
                                <View
                                    key={item.key}
                                    style={[styles.balanceTile, { borderColor: item.color + "88", borderWidth: 1.5 }]}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: item.color + "33" }]}>
                                        <Icon name={item.icon} size={26} color={item.color} />
                                    </View>

                                    <Text style={styles.tileTitle} numberOfLines={1}>{item.label}</Text>

                                    <Text style={[styles.tileValue, { color: item.color }]}>
                                        {item.data.available}
                                    </Text>
                                    <Text style={styles.tileSub}>Available</Text>

                                    {item.data.used > 0 && <Text style={styles.tileInfo}>Used: {item.data.used}</Text>}
                                    {item.data.total > 0 && <Text style={styles.tileInfo}>Total: {item.data.total}</Text>}
                                </View>
                            ))}
                        </ScrollView>
                    )}

                    <TouchableOpacity style={styles.historyBtn} onPress={onHistoryPress}>
                        <Text style={styles.historyText}>View Leave History</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default LeaveBalance;