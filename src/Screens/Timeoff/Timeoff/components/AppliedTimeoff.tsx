import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";

import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from '@react-navigation/native';
import Icon from "react-native-vector-icons/Feather";

import { COLORS } from "../../../../theme/colors";
import { ROUTES } from "../../../../navigation/routes";
import { useAppTheme } from "../../../../theme/useAppTheme";
import { createStyles } from "../Timeoff.styles";

import { selectUser } from "../../../../redux/selector";

import { getUpcomingAndPendingTimeoff } from "../../../../services/timeoffServices";
import { AppliedCardSkeleton } from "../../../../components/Skeleton/LeaveSkeleton";

type AppliedTimeoffProps = { refreshKey?: number; onRefreshComplete?: () => void };

const AppliedTimeoff = ({ refreshKey, onRefreshComplete }: AppliedTimeoffProps) => {
    const { theme } = useAppTheme();
    const styles = React.useMemo(() => createStyles(theme), [theme]);

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

    React.useEffect(() => {
        if (typeof refreshKey === 'number' && refreshKey > 0) {
            fetchUpcomingAndpendingTimeoff().finally(() => {
                onRefreshComplete?.();
            });
        }
    }, [refreshKey]);

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

    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>Applied Timeoff</Text>
            {loading ? (
                <View style={styles.listContainer}>
                    {[1, 2].map((i) => <AppliedCardSkeleton key={i} />)}
                </View>
            ) : timeOffs.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No applied timeoffs</Text>
                </View>
            ) : (
                <View style={styles.listContainer}>
                    {timeOffs.map((item) => (
                        <TimeoffCard key={item._id} item={item} />
                    ))}
                </View>
            )}
        </View>
    );
};

export default AppliedTimeoff;