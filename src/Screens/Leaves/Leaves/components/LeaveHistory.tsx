import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from "react-redux";

import { View, Text, FlatList, Image, TouchableOpacity, StatusBar } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";
import MIcon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from 'react-native-linear-gradient';

import { createStyles } from '../Leaves.styles';
import { ROUTES } from '../../../../navigation/routes';
import { COLORS } from '../../../../theme/colors';
import { useAppTheme } from '../../../../theme/useAppTheme';

import { selectUser } from "../../../../redux/selector";

import { getLeaveHistory } from '../../../../services/leavesServices';
import { AppliedCardSkeleton } from "../../../../components/Skeleton/LeaveSkeleton";

const LeaveHistory = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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


    return (
        <View style={styles.leaveHistorycontainer}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={styles.screenHeader}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.headerBackButton}
                        >
                            <MIcon name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Leave History</Text>
                    </View>
                </LinearGradient>
            </View>

            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4, 5]}
                    renderItem={() => <AppliedCardSkeleton />}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 16 }]}
                />
            ) : leaves.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Icon name="calendar" size={60} color={theme.textSecondary || "#9CA3AF"} />
                    <Text style={styles.emptyText}>No leave history found</Text>
                    <Text style={styles.emptySubText}>When you apply for leaves, they will appear here.</Text>
                </View>
            ) : (
                <FlatList
                    data={leaves}
                    renderItem={({ item }) => renderItem(item)}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={[styles.scrollContent, { paddingHorizontal: 16 }]}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

export default LeaveHistory;