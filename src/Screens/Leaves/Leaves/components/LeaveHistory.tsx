import React, { useCallback, useState } from 'react';
import { useSelector } from "react-redux";

import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";

import { styles } from '../Leaves.styles';
import { ROUTES } from '../../../../navigation/routes';
import { COLORS } from '../../../../theme/colors';

import { selectUser } from "../../../../redux/selector";

import { getLeaveHistory } from '../../../../services/leavesServices';

const LeaveHistory = () => {

    const [leaves, setLeaves] = useState<any[]>([]);

    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation<NavigationProp<any>>();

    const fetchLeaveHistory = async () => {
        if (!user?._id) return;

        setLoading(true);
        try {
            const response = await getLeaveHistory({ userId: user._id });
            const history = response?.data || [];

            setLeaves(history);
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
    };

    useFocusEffect(
        useCallback(() => {
            fetchLeaveHistory();
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
                onPress={() => navigation.navigate(ROUTES.ADDEDITLEAVES, { mode: 'non-edit', item })}
            >
                <View style={styles.cardContainer}>
                    <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />

                    <View style={styles.cardContent}>
                        <View style={styles.headerRow2}>
                            <Text style={styles.cardTitle2}>
                                {item.leaveType}</Text>
                            <View style={[styles.statusBadgeContainer, { backgroundColor: statusColor }]}>
                                <Text style={styles.statusBadgeText}>{item.status}</Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Date:</Text>
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
        );
    };

    if (loading) {
        return (
            <View style={[styles.leaveHistorycontainer, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.leaveHistorycontainer}>
            <FlatList
                data={leaves}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderItem(item)}
                ListEmptyComponent={<Text style={styles.noDataText}>No leaves found</Text>}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

export default LeaveHistory;