import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, Modal, TextInput, SafeAreaView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";

import { IMAGES } from "../../../assets/images";
import { createStyles } from "./AdminLeaves.styles";

import { useAppTheme } from "../../../theme/useAppTheme";
import { COLORS } from "../../../theme/colors";
import { selectUser } from "../../../redux/selector";

import { getAppliedLeaves, getAppliedTimeOff, approveRejectLeave, approveRejectTimeOff } from "../../../services/adminServices";

import CustomAlert from "../../../components/CustomAlert/CustomAlert";
import { useRoute } from "@react-navigation/native";
import AdminLeavesSkeleton from "../../../components/Skeleton/AdminLeavesSkeleton";

const AdminLeaves = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useSelector(selectUser);
    const route = useRoute<any>();

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'Leaves' | 'TimeOff'>('Leaves');
    const [activeFilter, setActiveFilter] = useState('Pending');
    const [requests, setRequests] = useState<any[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [actionType, setActionType] = useState<'Approve' | 'Reject' | null>(null);
    const [comment, setComment] = useState("");
    const [alert, setAlert] = useState<{ visible: boolean, type: 'success' | 'danger' | 'warning' | 'info', message: string }>({
        visible: false,
        type: 'success',
        message: ''
    });

    const fetchData = useCallback(async () => {
        if (!user?.companyId) return;

        try {
            const companyId = typeof user.companyId === 'object' ? user.companyId._id : user.companyId;
            let data;
            if (activeTab === 'Leaves') {
                data = await getAppliedLeaves(companyId);
                setRequests(data.appliedLeaves || []);
            } else {
                data = await getAppliedTimeOff(companyId);
                setRequests(data.appliedTimeOff || []);
            }
        } catch (error) {
            console.error("Error fetching requests:", error);
            setAlert({ visible: true, type: 'danger', message: "Failed to fetch requests" });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, activeTab]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (route.params?.tab) {
            setActiveTab(route.params.tab);
        }
    }, [route.params?.tab]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const handleAction = async () => {
        if (!selectedRequest || !actionType) return;

        const status = actionType === 'Approve' ? 'Approved' : 'Rejected';
        setLoading(true);

        try {
            if (activeTab === 'Leaves') {
                await approveRejectLeave(selectedRequest._id, status, comment);
            } else {
                await approveRejectTimeOff(selectedRequest._id, status, comment);
            }

            setAlert({ visible: true, type: 'success', message: `${activeTab} ${status.toLowerCase()} successfully` });
            setSelectedRequest(null);
            setActionType(null);
            setComment("");
            fetchData();
        } catch (error) {
            console.error("Error processing request:", error);
            setAlert({ visible: true, type: 'danger', message: "Failed to process request" });
            setLoading(false);
        }
    };

    const filteredRequests = useMemo(() => {
        return requests.filter(r => r.status === activeFilter).sort((a, b) =>
            dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()
        );
    }, [requests, activeFilter]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return { color: '#FFA000', bg: '#FFF8E1' };
            case 'Approved': return { color: '#4CAF50', bg: '#E8F5E9' };
            case 'Rejected': return { color: '#F44336', bg: '#FFEBEE' };
            default: return { color: '#9E9E9E', bg: '#F5F5F5' };
        }
    };

    const renderRequest = ({ item }: { item: any }) => {
        const statusStyle = getStatusStyle(item.status);
        const isTimeOff = activeTab === 'TimeOff';

        return (
            <View style={styles.requestCard}>
                <View style={styles.cardHeader}>
                    <Image
                        source={item.userId?.profilePic?.location ? { uri: item.userId.profilePic.location } : IMAGES.user}
                        style={styles.avatar}
                    />
                    <View style={styles.headerInfo}>
                        <Text style={styles.employeeName}>{item.userId?.fullName || 'Unknown'}</Text>
                        <Text style={styles.requestDate}>Requested on {dayjs(item.createdAt).format('DD MMM, YYYY')}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Type</Text>
                        <Text style={styles.value}>{isTimeOff ? item.timeOffType : item.leaveType}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Duration</Text>
                        <Text style={styles.value}>
                            {isTimeOff ?
                                (item.timeOffType === 'Half Day' ? `${item.noOfHours} Hours` : `${item.noOfDays} Days`) :
                                `${item.noOfDays} Days`
                            }
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>{isTimeOff && item.timeOffType === 'Half Day' ? 'Date' : 'Dates'}</Text>
                        <Text style={styles.value}>
                            {isTimeOff && item.timeOffType === 'Half Day' ? (
                                dayjs(item.startDate || item.createdAt).format('DD MMM, YYYY')
                            ) : (
                                `${dayjs(item.startDate).isValid() ? dayjs(item.startDate).format('DD MMM') : '--'} - ${dayjs(item.endDate).isValid() ? dayjs(item.endDate).format('DD MMM') : '--'}`
                            )}
                        </Text>
                    </View>
                    {isTimeOff && item.timeOffType === 'Half Day' && (
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Time</Text>
                            <Text style={styles.value}>{item.startTime || '--:--'} - {item.endTime || '--:--'}</Text>
                        </View>
                    )}
                    {item.reason && (
                        <View style={styles.reasonContainer}>
                            <Text style={styles.label}>Reason</Text>
                            <Text style={styles.reasonText}>"{item.reason}"</Text>
                        </View>
                    )}
                </View>

                {item.status === 'Pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => {
                                setSelectedRequest(item);
                                setActionType('Reject');
                            }}
                        >
                            <Icon name="close" size={18} color="#FF5252" />
                            <Text style={[styles.actionBtnText, styles.rejectText]}>Reject</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionBtn, styles.approveBtn]}
                            onPress={() => {
                                setSelectedRequest(item);
                                setActionType('Approve');
                            }}
                        >
                            <Icon name="check" size={18} color="#4CAF50" />
                            <Text style={[styles.actionBtnText, styles.approveText]}>Approve</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {item.comment && (
                    <View style={styles.adminCommentContainer}>
                        <Text style={styles.label}>Admin Comment</Text>
                        <Text style={[styles.reasonText, { color: theme.textSecondary }]}>{item.comment}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'Leaves' && styles.activeTab]}
                        onPress={() => setActiveTab('Leaves')}
                    >
                        <Text style={[styles.tabText, activeTab === 'Leaves' && styles.activeTabText]}>Leaves</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'TimeOff' && styles.activeTab]}
                        onPress={() => setActiveTab('TimeOff')}
                    >
                        <Text style={[styles.tabText, activeTab === 'TimeOff' && styles.activeTabText]}>Time Off</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={['Pending', 'Approved', 'Rejected']}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.filterBtn, activeFilter === item && styles.filterBtnActive]}
                                onPress={() => setActiveFilter(item)}
                            >
                                <Text style={[styles.filterText, activeFilter === item && styles.filterTextActive]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item}
                    />
                </View>
            </View>

            {loading && !refreshing ? (
                <AdminLeavesSkeleton />
            ) : (
                <FlatList
                    data={filteredRequests}
                    renderItem={renderRequest}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyStateContainer}>
                            <Icon name="event-note" size={60} color={theme.textSecondary} />
                            <Text style={styles.emptyStateText}>
                                No {activeFilter.toLowerCase()} {activeTab.toLowerCase()}
                            </Text>
                        </View>
                    }
                />
            )}

            <Modal
                visible={!!selectedRequest}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    setSelectedRequest(null);
                    setActionType(null);
                }}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => {
                        setSelectedRequest(null);
                        setActionType(null);
                    }}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {actionType} Request
                        </Text>

                        <Text style={styles.modalLabel}>Add a comment (optional)</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Add your note here..."
                            placeholderTextColor={theme.textSecondary}
                            multiline
                            value={comment}
                            onChangeText={setComment}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalCancelBtn]}
                                onPress={() => {
                                    setSelectedRequest(null);
                                    setActionType(null);
                                    setComment("");
                                }}
                            >
                                <Text style={[styles.modalBtnText, { color: theme.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.modalBtn,
                                    styles.modalConfirmBtn,
                                    actionType === 'Reject' && styles.modalConfirmRejectBtn
                                ]}
                                onPress={handleAction}
                            >
                                <Text style={styles.modalBtnText}>Confirm {actionType}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>

            <CustomAlert
                visible={alert.visible}
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert(prev => ({ ...prev, visible: false }))}
            />
        </SafeAreaView>
    );
};

export default AdminLeaves;