import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { View, Text, FlatList, TouchableOpacity, TextInput, Image, RefreshControl, ActivityIndicator, ScrollView, Modal, Pressable, Animated, Easing, Dimensions, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import IconMC from "react-native-vector-icons/MaterialCommunityIcons";
import dayjs from "dayjs";

import { useAppTheme } from "../../../theme/useAppTheme";
import { COLORS } from "../../../theme/colors";
import { selectUser } from "../../../redux/selector";
import { IMAGES } from "../../../assets/images";
import CustomDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { getAllDailyReports } from "../../../services/dailyReportsServices";
import DailyReportSkeleton from "../../../components/Skeleton/DailyReportSkeleton";

import { createStyles } from "./AdminDailyReports.styles";

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

const AdminDailyReports = () => {
    const { theme } = useAppTheme();
    const user = useSelector(selectUser);
    const styles = useMemo(() => createStyles(theme), [theme]);

    const slideAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        if (selectedReport) {
            setModalVisible(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    mass: 0.8,
                    stiffness: 100,
                })
            ]).start();
        }
    }, [selectedReport, fadeAnim, slideAnim]);

    const closeModal = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease)
            })
        ]).start(() => {
            setModalVisible(false);
            setSelectedReport(null);
        });
    };

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [reports, setReports] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = useCallback(async (date: dayjs.Dayjs) => {
        const subscriberId = typeof user.companyId === 'object' ? user.companyId._id : user.companyId;
        if (!subscriberId) return;

        try {
            const formattedDate = date.format('YYYY-MM-DD');
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const response = await getAllDailyReports({
                formattedDate,
                timezone,
                userId: "",
                subscriberId
            });

            setReports(response?.data || []);
        } catch (error) {
            console.error("Error fetching admin daily reports:", error);
        } finally {
            setInitialLoading(false);
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData(selectedDate);
    }, [fetchData, selectedDate]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData(selectedDate);
    };

    const handleDateApply = (start: dayjs.Dayjs) => {
        setSelectedDate(start);
        setShowDatePicker(false);
    };

    const filteredReports = useMemo(() => {
        return reports.filter(item =>
            item.employeeName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [reports, searchQuery]);

    const renderReportItem = ({ item }: { item: any }) => {
        const taskSummary = item.tasks?.map((t: any) => t.description).join(', ') || 'No tasks listed';

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => setSelectedReport(item)}
                activeOpacity={0.7}
            >
                <Image
                    source={item.profilePic?.location ? { uri: item.profilePic.location } : IMAGES.user}
                    style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{item.employeeName || 'Unknown'}</Text>
                    <Text style={styles.timeDetail}>
                        {item.tasks?.length || 0} Task{item.tasks?.length !== 1 ? 's' : ''} • {dayjs(item.createdAt).format('hh:mm A')}
                    </Text>
                    <Text style={styles.summary} numberOfLines={1}>
                        {taskSummary}
                    </Text>
                </View>
                <Icon name="chevron-right" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
        );
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed': return '#10B981';
            case 'in progress': return '#3B82F6';
            case 'pending': return '#F59E0B';
            default: return theme.textSecondary;
        }
    };

    if (initialLoading) {
        return <DailyReportSkeleton />;
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color={theme.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search employees..."
                        placeholderTextColor={theme.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDatePicker(true)}>
                    <Icon name="event" size={20} color={COLORS.primary} />
                    <Text style={styles.selectedDateText}>{selectedDate.format('DD MMM')}</Text>
                    <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredReports}
                    renderItem={renderReportItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <IconMC name="document-off" size={60} color={theme.textSecondary} />
                            <Text style={styles.emptyText}>No reports found for this date</Text>
                        </View>
                    }
                />
            )}

            <CustomDateRangePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onApply={handleDateApply}
                initialStartDate={selectedDate}
                initialEndDate={selectedDate}
                selectionMode="single"
            />

            <Modal
                visible={modalVisible}
                transparent
                animationType="none"
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={closeModal}>
                        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
                    </Pressable>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <View style={styles.handle} />
                            <Text style={styles.modalTitle}>Report Details</Text>
                            <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                                <Icon name="close" size={24} color={theme.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
                            <View style={styles.reportUserHeader}>
                                <Image
                                    source={selectedReport?.profilePic?.location ? { uri: selectedReport.profilePic.location } : IMAGES.user}
                                    style={styles.modalAvatar}
                                />
                                <View>
                                    <Text style={styles.modalName}>{selectedReport?.employeeName}</Text>
                                    <Text style={styles.modalTime}>
                                        Submitted at {dayjs(selectedReport?.createdAt).format('hh:mm A')}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>TASKS COMPLETED</Text>
                                {selectedReport?.tasks?.length > 0 ? (
                                    selectedReport.tasks.map((task: any, index: number) => (
                                        <View key={index} style={styles.taskCard}>
                                            <View style={styles.taskHeader}>
                                                <Text style={styles.taskCompany}>{task.company || 'INTERNAL'}</Text>
                                                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) + '15' }]}>
                                                    <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>{task.status}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.taskDescription}>{task.description}</Text>
                                            <View style={styles.taskFooter}>
                                                <Icon name="schedule" size={14} color={theme.textSecondary} />
                                                <Text style={styles.taskDuration}>
                                                    {task.hours}h {task.minutes}m spent
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.description}>No tasks recorded.</Text>
                                )}
                            </View>
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
};



export default AdminDailyReports;
