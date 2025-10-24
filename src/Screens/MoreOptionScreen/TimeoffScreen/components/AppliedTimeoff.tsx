import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";

import { COLORS } from "../../../../theme/colors";
import { ROUTES } from "../../../../navigation/routes";

import { selectUser } from "../../../../redux/selector";

import { getUpcomingAndPendingTimeoff } from "../../../../services/timeoffServices";

const AppliedTimeoff = () => {

    const [timeOffs, setTimeOffs] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation<NavigationProp<any>>();

    const fetchUpcomingAndpendingTimeoff = async () => {

        if (!user?._id) return;

        setLoading(true);
        try {
            const response = await getUpcomingAndPendingTimeoff({ userId: user._id, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
            const timeoffData = response?.data || [];

            setTimeOffs(timeoffData);
        } catch (error) {
            console.error("Error fetching leave history:", error);
            showMessage({
                message: "Error fetching leave history",
                description: "Unable to retrieve leave history. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchUpcomingAndpendingTimeoff();
        }, [user?._id])
    );

    const TimeoffCard = ({ item }: { item: any }) => {

        const statusColor =
            item.status === "Approved"
                ? COLORS.green1
                : item.status === "Pending"
                    ? COLORS.primary
                    : COLORS.red1;

        let dateLabel = '';
        let formattedFrom = '';
        let formattedTo = '';

        if (item.timeOffType === "Half Day") {
            formattedFrom = item.startTime;
            formattedTo = item.endTime;
            dateLabel = "Time";
        } else if (item.timeOffType === "Work From Home") {
            const start = new Date(item.startDate);
            const end = new Date(item.endDate);

            formattedFrom = start.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });

            formattedTo = end.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            });

            if (formattedFrom === formattedTo) formattedTo = '';
            dateLabel = "Date";
        }

        const appliedDate = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            : '';

        const statusDate = item.updatedAt
            ? new Date(item.updatedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            : '';

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate(ROUTES.ADDEDITTIMEOFF, { mode: 'edit', item })}
            >
                <View style={styles.cardContainer}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

                    <View style={styles.cardContent}>

                        <View style={styles.headerRow}>
                            <Text style={styles.cardTitle}>{item.timeOffType}</Text>
                            <View style={[styles.statusBadgeContainer, { backgroundColor: statusColor }]}>
                                <Text style={styles.statusBadgeText}>{item.status}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{dateLabel}:</Text>
                            <Text style={styles.infoValue}>
                                {formattedTo ? `From ${formattedFrom} • To ${formattedTo}` : formattedFrom}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Contact No:</Text>
                            <Text style={styles.infoValue}>{item.contactNumber}</Text>
                        </View>

                        <View style={[styles.infoRow, { alignItems: 'flex-start' }]}>
                            <Text style={styles.infoLabel}>Reason:</Text>
                            <Text style={[styles.infoValue, { flex: 1, flexWrap: 'wrap' }]}>
                                {item.reason || '-'}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Applied on:</Text>
                            <Text style={styles.infoValue}>{appliedDate}</Text>
                        </View>

                        {item.status !== "Pending" && (
                            <View style={styles.statusRow}>
                                <View style={styles.statusBadge}>
                                    <Icon
                                        name={item.status === "Rejected" ? "x-circle" : "check-circle"}
                                        size={16}
                                        color={item.status === "Rejected" ? "#e74c3c" : "#2ecc71"}
                                        style={{ marginRight: 6 }}
                                    />
                                    <Text style={styles.statusText}>
                                        {item.status === "Rejected"
                                            ? `Rejected on ${statusDate}`
                                            : `Approved on ${statusDate}`}
                                    </Text>
                                </View>

                                {(item.approvedBy || item.rejectedBy) && (
                                    <View style={styles.approverRow}>
                                        <Text style={styles.approvedByLabel}>By:</Text>
                                        <Image
                                            source={{ uri: item.approvedByImage || item.rejectedByImage }}
                                            style={styles.avatar}
                                        />
                                        <Text style={styles.approvedByName}>
                                            {item.approvedBy || item.rejectedBy}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        )}

                    </View>
                </View>

            </TouchableOpacity>
        )

    }

    if (loading) {
        return (
            <View style={[styles.loader, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Upcoming / Pending</Text>
            <FlatList
                data={timeOffs}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <TimeoffCard item={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyText}>No applied timeoffs</Text>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />

        </View>
    )
}

export default AppliedTimeoff

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 20
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 12
    },
    emptyBox: {
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    emptyText: {
        color: "#9CA3AF",
        fontSize: 14,
        fontStyle: "italic"
    },
    listContainer: {
        paddingVertical: 10,
        paddingHorizontal: 4,
    },
    cardContainer: {
        flexDirection: "row",
        backgroundColor: COLORS.white,
        borderRadius: 14,
        marginHorizontal: 8,
        marginVertical: 4,
        padding: 12,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 3,
    },
    statusIndicator: {
        width: 6,
        borderRadius: 3,
    },
    cardContent: {
        flex: 1,
        marginLeft: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    statusBadgeContainer: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        marginVertical: 2,
    },
    infoLabel: {
        fontWeight: '500',
        color: '#4B5563',
        marginRight: 4,
    },
    infoValue: {
        fontWeight: '600',
        color: '#111827',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#374151',
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2ecc7133",
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    approverRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    approvedByLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 4,
    },
    approvedByName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginHorizontal: 4,
    },
    loader: {
        flex: 1,
        backgroundColor: COLORS.lightBlue,
    },
})