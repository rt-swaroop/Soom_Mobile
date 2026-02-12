import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { View, Text, FlatList, TouchableOpacity, TextInput, Image, RefreshControl, ActivityIndicator, Modal, ScrollView, Linking, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useAppTheme } from "../../../theme/useAppTheme";
import { createStyles } from "./AdminAttendance.styles";
import { COLORS } from "../../../theme/colors";
import { selectUser } from "../../../redux/selector";
import { getUsersList, getAllAttendance, getDashboardDetails } from "../../../services/adminServices";
import { IMAGES } from "../../../assets/images";
import CustomDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { useRoute } from "@react-navigation/native";
import AdminAttendanceSkeleton from "../../../components/Skeleton/AdminAttendanceSkeleton";

dayjs.extend(utc);
dayjs.extend(timezone);

const AdminAttendance = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useSelector(selectUser);
    const route = useRoute<any>();

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [dashboardDetails, setDashboardDetails] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    useEffect(() => {
        if (route.params?.filter) {
            setActiveFilter(route.params.filter);
        }
        if (route.params?.date) {
            setSelectedDate(dayjs(route.params.date));
        }
    }, [route.params]);

    const fetchData = useCallback(async (date: dayjs.Dayjs) => {
        if (!user?.companyId) return;

        try {
            const timeZone = dayjs.tz.guess();
            const formattedDate = date.format('YYYY-MM-DD');
            const companyId = typeof user.companyId === 'object' ? user.companyId._id : user.companyId;

            const [usersData, attData, dashboardData] = await Promise.all([
                getUsersList(companyId),
                getAllAttendance(companyId, {
                    startDate: formattedDate,
                    endDate: formattedDate,
                    timeZone
                }),
                getDashboardDetails(companyId, formattedDate, timeZone)
            ]);

            setUsers(usersData.data || []);
            const safeAttendance = (attData.attendance || []).map((att: any) => ({
                ...att,
                userID: att.userID?.toString() || att.userID
            }));
            setAttendance(safeAttendance);
            setDashboardDetails(dashboardData.data);
        } catch (error) {
            console.error("Error fetching attendance data:", error);
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

    const filteredData = useMemo(() => {
        const attendanceMap = attendance.reduce((acc, record) => {
            if (record.userID) {
                acc[record.userID.toString()] = record;
            }
            return acc;
        }, {});

        let baseList = users.filter(u =>
            u.isActive &&
            (u.role === 'user' || u.role === 'Company-admin') &&
            u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(u => ({
            ...u,
            attendance: attendanceMap[u._id.toString()]
        }));

        if (activeFilter === "Clocked In") {
            baseList = baseList.filter(u => u.attendance?.clockInTime && !u.attendance?.clockOutTime && u.attendance?.attendanceStatus !== 'Leave');
        } else if (activeFilter === "Clocked Out") {
            baseList = baseList.filter(u => u.attendance?.clockOutTime);
        } else if (activeFilter === "Work From Office") {
            baseList = baseList.filter(u => u.attendance?.place === "Office");
        } else if (activeFilter === "Work From Home") {
            baseList = baseList.filter(u => u.attendance?.place === "Work From Home");
        } else if (activeFilter === "Leave") {
            baseList = baseList.filter(u => u.attendance?.attendanceStatus === 'Leave');
        } else if (activeFilter === "Not Clocked In") {
            if (dashboardDetails?.notClockedInEmployees) {
                return dashboardDetails.notClockedInEmployees.filter((u: any) =>
                    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            // Fallback to local logic if dashboardDetails not yet loaded
            baseList = baseList.filter(u => {
                if (u.attendance) return false;
                const now = dayjs();
                const isToday = selectedDate.isSame(now, 'day');
                const isPast = selectedDate.isBefore(now, 'day');

                if (isPast) return true;
                if (!isToday) return false;

                const shiftStartTime = u.officeInformation?.shiftData?.id?.startTime;
                if (!shiftStartTime) return true;

                const [hours, minutes] = shiftStartTime.split(':').map(Number);
                const shiftStart = dayjs().hour(hours).minute(minutes).second(0);
                return now.isAfter(shiftStart);
            });
        } else if (activeFilter === "Pending") {
            if (dashboardDetails?.pendingEmployees) {
                return dashboardDetails.pendingEmployees.filter((u: any) =>
                    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }
            // Fallback to local logic
            baseList = baseList.filter(u => {
                if (u.attendance) return false;
                const now = dayjs();
                const isToday = selectedDate.isSame(now, 'day');
                const isPast = selectedDate.isBefore(now, 'day');

                if (isPast) return false;
                if (!isToday) return true;

                const shiftStartTime = u.officeInformation?.shiftData?.id?.startTime;
                if (!shiftStartTime) return false;

                const [hours, minutes] = shiftStartTime.split(':').map(Number);
                const shiftStart = dayjs().hour(hours).minute(minutes).second(0);
                return now.isBefore(shiftStart);
            });
        }

        baseList.sort((a, b) => {
            const timeA = a.attendance?.clockInTime ? new Date(a.attendance.clockInTime).getTime() : 0;
            const timeB = b.attendance?.clockInTime ? new Date(b.attendance.clockInTime).getTime() : 0;

            if (timeA === 0 && timeB === 0) return 0;
            if (timeA === 0) return 1;
            if (timeB === 0) return -1;

            return timeA - timeB;
        });

        return baseList;
    }, [users, attendance, searchQuery, activeFilter, selectedDate, dashboardDetails]);

    const displayFilters = useMemo(() => {
        const baseFilters = ["All", "Clocked In", "Clocked Out", "Work From Office", "Work From Home", "Leave", "Not Clocked In", "Pending"];
        return activeFilter === "All"
            ? baseFilters
            : ["All", activeFilter, ...baseFilters.filter(f => f !== "All" && f !== activeFilter)];
    }, [activeFilter]);

    const getStatusInfo = (att: any) => {
        if (att?.attendanceStatus === 'Leave') return { label: 'ON LEAVE', color: '#F44336', bg: '#FFEBEE' };
        if (att?.clockOutTime) return { label: 'CLOCKED OUT', color: '#2196F3', bg: '#E3F2FD' };
        if (att?.clockInTime) return { label: att.place?.toUpperCase() || 'PRESENT', color: '#4CAF50', bg: '#E8F5E9' };
        return { label: 'PENDING', color: '#9E9E9E', bg: '#F5F5F5' };
    };

    const openLocation = (lat: number, lng: number) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Employee Location';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        if (url) Linking.openURL(url);
    };

    const renderEmployee = ({ item }: { item: any }) => {
        const status = getStatusInfo(item.attendance);
        const clockIn = item.attendance?.clockInTime ? dayjs(item.attendance.clockInTime).format('hh:mm A') : '--:--';
        const clockOut = item.attendance?.clockOutTime ? dayjs(item.attendance.clockOutTime).format('hh:mm A') : '--:--';

        return (
            <TouchableOpacity
                style={styles.employeeCard}
                onPress={() => setSelectedEmployee(item)}
                activeOpacity={0.7}
                delayPressIn={0}
            >
                <Image
                    source={item.profilePic?.location ? { uri: item.profilePic.location } : IMAGES.user}
                    style={styles.avatar}
                />
                <View style={styles.infoContainer}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{item.fullName}</Text>
                        {item.attendance?.place && (
                            <Icon
                                name={item.attendance.place === "Work From Home" ? "home" : "business"}
                                size={16}
                                color={COLORS.primary}
                                style={styles.placeIcon}
                            />
                        )}
                    </View>
                    <Text style={styles.code}>{item.officeInformation?.employeeCode || 'No Code'}</Text>
                    <View style={styles.timeContainer}>
                        <Icon name="access-time" size={14} color={theme.textSecondary} />
                        <Text style={styles.timeText}>In: {clockIn}  |  Out: {clockOut}</Text>
                    </View>
                </View>
                {status.label && status.label !== 'OFFICE' && status.label !== 'WORK FROM HOME' ? (
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                    </View>
                ) : status.label === 'OFFICE' || status.label === 'WORK FROM HOME' ? null : (
                    <Icon name="check-circle" size={24} color={status.color} style={styles.checkIcon} />
                )}
            </TouchableOpacity>
        );
    };

    if (initialLoading) {
        return <AdminAttendanceSkeleton />;
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

                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowDatePicker(true)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="event" size={20} color={COLORS.primary} />
                    <Text style={styles.dateText}>{selectedDate.format('DD MMM')}</Text>
                    <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} />
                </TouchableOpacity>
            </View>

            <View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
                    {displayFilters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[styles.filterBtn, activeFilter === filter && styles.filterBtnActive]}
                            onPress={() => setActiveFilter(filter)}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderEmployee}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="search-off" size={60} color={theme.textSecondary} />
                            <Text style={styles.emptyText}>No matching records found</Text>
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
                visible={!!selectedEmployee}
                transparent
                animationType="slide"
                onRequestClose={() => setSelectedEmployee(null)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setSelectedEmployee(null)}
                >
                    <TouchableOpacity activeOpacity={1} style={styles.modalContent}>
                        <View style={styles.modalIndicator} />

                        <Image
                            source={selectedEmployee?.profilePic?.location ? { uri: selectedEmployee.profilePic.location } : IMAGES.user}
                            style={styles.modalAvatar}
                        />
                        <Text style={styles.modalName}>{selectedEmployee?.fullName}</Text>
                        <Text style={styles.modalCode}>{selectedEmployee?.officeInformation?.employeeCode || 'N/A'}</Text>

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Clock In</Text>
                                <Text style={styles.detailValue}>
                                    {selectedEmployee?.attendance?.clockInTime ? dayjs(selectedEmployee.attendance.clockInTime).format('hh:mm A') : '--:--'}
                                </Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Clock Out</Text>
                                <Text style={styles.detailValue}>
                                    {selectedEmployee?.attendance?.clockOutTime ? dayjs(selectedEmployee.attendance.clockOutTime).format('hh:mm A') : '--:--'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Status</Text>
                                <Text style={[styles.detailValue, { color: getStatusInfo(selectedEmployee?.attendance).color }]}>
                                    {getStatusInfo(selectedEmployee?.attendance).label}
                                </Text>
                            </View>
                        </View>

                        {selectedEmployee?.attendance?.clockinLocation && (
                            <TouchableOpacity
                                style={styles.locationBtn}
                                onPress={() => openLocation(
                                    selectedEmployee.attendance.clockinLocation.latitude,
                                    selectedEmployee.attendance.clockinLocation.longitude
                                )}
                            >
                                <Icon name="location-on" size={20} color={COLORS.primary} />
                                <Text style={styles.locationText}>View Clock-in Location</Text>
                            </TouchableOpacity>
                        )}

                        {selectedEmployee?.attendance?.clockoutLocation && (
                            <TouchableOpacity
                                style={styles.locationBtn}
                                onPress={() => openLocation(
                                    selectedEmployee.attendance.clockoutLocation.latitude,
                                    selectedEmployee.attendance.clockoutLocation.longitude
                                )}
                            >
                                <Icon name="location-city" size={20} color={COLORS.primary} />
                                <Text style={styles.locationText}>View Clock-out Location</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

export default AdminAttendance;
