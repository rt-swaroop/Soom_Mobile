/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { Text, View, TouchableOpacity, ActivityIndicator, Platform, UIManager, LayoutAnimation } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";

import { styles } from '../Leaves.styles'
import { COLORS } from "../../../theme/colors";

import { selectUser } from "../../../redux/selector";

import { getLeaveBalance } from "../../../services/leavesServices";

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
}

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LeaveBalance = ({ onHistoryPress }: Props) => {
    const [balanceCards, setBalanceCards] = useState<BalanceCard[]>([]);
    const [collapsed, setCollapsed] = useState(true);
    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const fetchLeaveBalance = async () => {
        setLoading(true);
        try {
            const response = await getLeaveBalance({
                userId: user?._id || "",
                year: new Date().getFullYear(),
            });

            if (response?.leaveSummary) {
                const mapped: BalanceCard[] = [
                    {
                        key: "casual",
                        label: "Casual Leave",
                        icon: "beach",
                        color: "#2563EB",
                        data: {
                            available: response?.leaveSummary?.casualLeave?.remaining,
                            used: response?.leaveSummary?.casualLeave?.remaining,
                            total: response?.leaveSummary?.casualLeave?.total,
                        },
                    },
                    {
                        key: "sick",
                        label: "Sick Leave",
                        icon: "hospital-box",
                        color: "#DC2626",
                        data: {

                            available: response?.leaveSummary?.sickLeave?.remaining,
                            used: response?.leaveSummary?.sickLeave?.used,
                            total: response?.leaveSummary?.sickLeave?.total,
                        },
                    },
                    {
                        key: "compoff",
                        label: "Comp Off",
                        icon: "briefcase-check",
                        color: "#059669",
                        data: {
                            available: response?.leaveSummary?.compOff?.remaining,
                            used: response?.leaveSummary?.compOff?.used,
                            total: response?.leaveSummary?.compOff?.total,
                        },
                    },
                ];

                setBalanceCards(mapped);
            }
        } catch (error) {
            console.error("Error fetching leave balance:", error);
            showMessage({
                message: "Error fetching leave balance",
                description:
                    "Unable to retrieve leave balance. Please try again later.",
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

    const toggleCollapse = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setCollapsed((prev) => !prev);
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={toggleCollapse} activeOpacity={0.7}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <Icon name="calendar-month-outline" size={22} color="#2563EB" />
                        <Text style={styles.cardTitle}>Leave Balance</Text>
                    </View>

                    <Icon name={collapsed ? "chevron-down" : "chevron-up"} size={24} color={"#333"} />
                </View>
            </TouchableOpacity>

            {!collapsed && (
                <>
                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary || "#2563EB"} />
                        </View>
                    ) : (
                        <View style={styles.balanceGrid}>
                            {balanceCards.map((item) => (
                                <View
                                    key={item.key}
                                    style={[styles.balanceTile, { borderColor: item.color + "55" }]}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: item.color + "22" }]}>
                                        <Icon name={item.icon} size={24} color={item.color} />
                                    </View>

                                    <Text style={styles.tileTitle}>{item.label}</Text>

                                    <Text style={[styles.tileValue, { color: item.color }]}>
                                        {item.data.available}
                                    </Text>
                                    <Text style={styles.tileSub}>Available</Text>

                                    <Text style={styles.tileInfo}>Used: {item.data.used}</Text>
                                    <Text style={styles.tileInfo}>Total: {item.data.total}</Text>
                                </View>
                            ))}
                        </View>
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