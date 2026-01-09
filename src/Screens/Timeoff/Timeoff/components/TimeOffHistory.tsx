import React, { useCallback, useState } from 'react';
import { useSelector } from "react-redux";

import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";

import { styles } from '../Timeoff.styles';
import { ROUTES } from '../../../../navigation/routes';
import { COLORS } from '../../../../theme/colors';

import { selectUser } from "../../../../redux/selector";

import { getTimeoffHistory } from '../../../../services/timeoffServices';

const TimeOffHistory = () => {
    const [timeOffs, setTimeOffs] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation<NavigationProp<any>>();

    const fetchTimeoffHistory = async () => {
        if (!user?._id) return;

        setLoading(true);
        try {
            const response = await getTimeoffHistory({ userId: user._id });
            const history = response?.data || [];

            setTimeOffs(history);
        } catch (error) {
            console.error("Error fetching timeoff history:", error);
            showMessage({
                message: "Error fetching timeoff history",
                description: "Unable to retrieve timeoff history. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTimeoffHistory();
        }, [user?._id])
    );

    const renderItem = (item: any) => {

        const statusColor =
            item.status === "Approved"
                ? COLORS.green1
                : item.status === "Pending"
                    ? COLORS.primary
                    : COLORS.red1;

        let formattedFrom = '';
        let formattedTo = '';
        let dateLabel = '';

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
                onPress={() => navigation.navigate(ROUTES.ADDEDITTIMEOFF, { mode: 'non-edit', item })}
            >
                <View style={styles.cardContainer}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

                    <View style={styles.cardContent}>
                        <View style={styles.headerRow}>
                            <Text style={styles.cardTitle}>{item.timeOffType}
                            </Text>
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

                        <View style={styles.statusRow}>
                            <View style={styles.statusBadge}>
                                <Icon
                                    name={item.status === "Rejected" ? "x-circle" : "check-circle"}
                                    size={16}
                                    color={item.status === "Rejected" ? "#e74c3c" : "#2ecc71"}
                                    style={{ marginRight: 6 }}
                                />
                                <Text style={styles.statusText}>
                                    {item.status === "Rejected" ? `Rejected on ${statusDate}` : `Approved on ${statusDate}`}
                                </Text>
                            </View>

                            {(item.approvedBy || item.rejectedBy) && (
                                <View style={styles.approverRow}>
                                    <Text style={styles.approvedByLabel}>By:</Text>
                                    <Image
                                        source={{ uri: item.approvedByImage || item.rejectedByImage }}
                                        style={styles.avatar}
                                    />
                                    <Text style={styles.approvedByName}>{item.approvedBy || item.rejectedBy}</Text>
                                </View>
                            )}
                        </View>

                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    if (loading) {
        return (
            <View style={[styles.timeoffHistorycontainer, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.timeoffHistorycontainer}>
            <FlatList
                data={timeOffs}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderItem(item)}
                ListEmptyComponent={<Text style={styles.noDataText}>No time-offs found</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}

export default TimeOffHistory