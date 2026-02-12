import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StatusBar, SafeAreaView, Image, FlatList } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { useAppTheme } from "../../../theme/useAppTheme";
import { createStyles } from "./AdminDashboard.styles";
import { COLORS } from "../../../theme/colors";
import { selectUser } from "../../../redux/selector";
import { getAttendanceStats, getDashboardDetails } from "../../../services/adminServices";
import { IMAGES } from "../../../assets/images";
import CustomDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import { ROUTES } from "../../../navigation/routes";
import DashboardSkeleton from "../../../components/Skeleton/DashboardSkeleton";

dayjs.extend(utc);
dayjs.extend(timezone);

const StatCard = ({ title, value, icon, colors, onPress, fullWidth = false, styles }: any) => (
    <TouchableOpacity
        style={fullWidth ? styles.statCardMain : styles.statCardSmall}
        onPress={onPress}
        activeOpacity={0.9}
    >
        <LinearGradient colors={colors} style={styles.cardGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.cardHeader}>
                <View style={styles.cardIconWrapper}>
                    <Icon name={icon} size={20} color={COLORS.white} />
                </View>
                <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.5)" />
            </View>
            <View>
                <Text style={styles.cardValue}>{value}</Text>
                <Text style={styles.cardLabel}>{title}</Text>
            </View>
        </LinearGradient>
    </TouchableOpacity>
);

const EmployeeHorizontalCard = ({ employee, styles }: any) => (
    <TouchableOpacity style={styles.employeeCard} activeOpacity={0.7}>
        <Image
            source={employee.profilePic?.location ? { uri: employee.profilePic.location } : IMAGES.user}
            style={styles.employeeAvatar}
        />
        <Text style={styles.employeeName} numberOfLines={1}>{employee.fullName}</Text>
        <Text style={styles.employeeCode}>{employee.employeeCode || 'N/A'}</Text>
        {employee.leaveType && (
            <Text style={styles.employeeLeaveType}>
                {employee.leaveType}
            </Text>
        )}
    </TouchableOpacity>
);

const AdminDashboard = () => {
    const { theme, isDark } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const user = useSelector(selectUser);
    const navigation = useNavigation<any>();

    const [refreshing, setRefreshing] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [details, setDetails] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const fetchData = useCallback(async (date: dayjs.Dayjs) => {
        if (!user?.companyId) return;

        try {
            const timeZone = dayjs.tz.guess();
            const formattedDate = date.format('YYYY-MM-DDTHH:mm:ss');
            const companyId = typeof user.companyId === 'object' ? user.companyId._id : user.companyId;

            const [statsData, detailsData] = await Promise.all([
                getAttendanceStats(companyId, formattedDate, timeZone),
                getDashboardDetails(companyId, formattedDate, timeZone)
            ]);

            setStats(statsData);
            setDetails(detailsData.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setRefreshing(false);
            setInitialLoading(false);
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

    const sortedWFH = useMemo(() => {
        if (!details?.wfhEmployees) return [];
        return [...details.wfhEmployees].sort((a, b) =>
            (a.employeeCode || '').localeCompare(b.employeeCode || '', undefined, { numeric: true, sensitivity: 'base' })
        );
    }, [details?.wfhEmployees]);

    const sortedOnLeave = useMemo(() => {
        if (!details?.onLeaveToday) return [];
        return [...details.onLeaveToday].sort((a, b) =>
            (a.employeeCode || '').localeCompare(b.employeeCode || '', undefined, { numeric: true, sensitivity: 'base' })
        );
    }, [details?.onLeaveToday]);

    const sortedUpcoming = useMemo(() => {
        if (!details?.upcomingLeaves) return [];
        return [...details.upcomingLeaves].sort((a, b) =>
            (a.employeeCode || '').localeCompare(b.employeeCode || '', undefined, { numeric: true, sensitivity: 'base' })
        );
    }, [details?.upcomingLeaves]);

    const sortedUpcomingTimeOff = useMemo(() => {
        if (!details?.upcomingTimeOffs) return [];
        return [...details.upcomingTimeOffs].sort((a, b) =>
            (a.employeeCode || '').localeCompare(b.employeeCode || '', undefined, { numeric: true, sensitivity: 'base' })
        );
    }, [details?.upcomingTimeOffs]);

    const dashboardCards = [
        {
            title: "Clocked In",
            value: stats?.clockInCount || 0,
            icon: "login",
            colors: ["#4facfe", "#00f2fe"],
            fullWidth: true,
            filter: "Clocked In"
        },
        {
            title: "Work From Office",
            value: stats?.officeCount || 0,
            icon: "business",
            colors: ["#667eea", "#764ba2"],
            filter: "Work From Office"
        },
        {
            title: "Work From Home",
            value: stats?.wfhCount || 0,
            icon: "home-work",
            colors: ["#2af598", "#009ad1"],
            filter: "Work From Home"
        },
        {
            title: "On Leave",
            value: stats?.leaveCount || 0,
            icon: "event-busy",
            colors: ["#f093fb", "#f5576c"],
            filter: "Leave"
        },
        {
            title: "Clocked Out",
            value: stats?.clockOutCount || 0,
            icon: "done-all",
            colors: ["#a18cd1", "#fbc2eb"],
            filter: "Clocked Out"
        },
        {
            title: "Not Clocked In",
            value: stats?.notClockedInCount || 0,
            icon: "timer-off",
            colors: ["#ff9a9e", "#fecfef"],
            filter: "Not Clocked In"
        },
        {
            title: "Pending",
            value: stats?.pendingCount || 0,
            icon: "schedule",
            colors: ["#89f7fe", "#66a6ff"],
            filter: "Pending"
        }
    ];

    const approvalCards = [
        {
            title: "Leave Approvals",
            value: stats?.pendingLeaveCount || 0,
            icon: "event-note",
            colors: ["#6a11cb", "#2575fc"],
            route: ROUTES.ADMIN_LEAVES,
            params: { tab: 'Leaves' }
        },
        {
            title: "Time-off Approvals",
            value: stats?.pendingTimeOffCount || 0,
            icon: "schedule",
            colors: ["#ff7e5f", "#feb47b"],
            route: ROUTES.ADMIN_LEAVES,
            params: { tab: 'TimeOff' }
        }
    ];

    const handleStatPress = (filter: string) => {
        navigation.navigate(ROUTES.ADMIN_ATTENDANCE, { filter, date: selectedDate.toISOString() });
    };

    if (initialLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome back,</Text>
                    <Text style={styles.nameText}>{user?.fullName || "Admin"}</Text>
                </View>

                <TouchableOpacity
                    style={styles.dateSelector}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Icon name="event" size={20} color={COLORS.primary} />
                    <Text style={styles.dateSelectorText}>
                        {selectedDate.format('dddd, DD MMM YYYY')}
                    </Text>
                    <Icon name="arrow-drop-down" size={24} color={theme.textSecondary} style={styles.dateSelectorIconRight} />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Attendance Overview</Text>

                <View style={styles.statsGrid}>
                    {dashboardCards.map((card, index) => (
                        <StatCard
                            key={index}
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            colors={card.colors}
                            fullWidth={card.fullWidth}
                            styles={styles}
                            onPress={() => handleStatPress(card.filter)}
                        />
                    ))}
                </View>

                {(stats?.pendingLeaveCount > 0 || stats?.pendingTimeOffCount > 0) && (
                    <>
                        <Text style={styles.sectionTitle}>Pending Approvals</Text>
                        <View style={styles.approvalStatsGrid}>
                            {approvalCards.map((card, index) => (
                                <StatCard
                                    key={`approval-${index}`}
                                    title={card.title}
                                    value={card.value}
                                    icon={card.icon}
                                    colors={card.colors}
                                    styles={styles}
                                    onPress={() => navigation.navigate(card.route, card.params)}
                                />
                            ))}
                        </View>
                    </>
                )}

                <Text style={styles.sectionTitle}>Work From Home ({details?.wfhEmployees?.length || 0})</Text>
                {details?.wfhEmployees?.length > 0 ? (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={sortedWFH}
                        renderItem={({ item }) => <EmployeeHorizontalCard employee={item} styles={styles} />}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.horizontalList}
                    />
                ) : (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No employees working from home</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>On Leave ({details?.onLeaveToday?.length || 0})</Text>
                {details?.onLeaveToday?.length > 0 ? (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={sortedOnLeave}
                        renderItem={({ item }) => <EmployeeHorizontalCard employee={item} styles={styles} />}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.horizontalList}
                    />
                ) : (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>Everyone is present today!</Text>
                    </View>
                )}


                <Text style={styles.sectionTitle}>Upcoming Leaves ({details?.upcomingLeaves?.length || 0})</Text>
                {details?.upcomingLeaves?.length > 0 ? (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={sortedUpcoming}
                        renderItem={({ item }) => <EmployeeHorizontalCard employee={item} styles={styles} />}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.horizontalList}
                    />
                ) : (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No upcoming leaves scheduled</Text>
                    </View>
                )}

                <Text style={styles.sectionTitle}>Upcoming Time Off ({details?.upcomingTimeOffs?.length || 0})</Text>
                {details?.upcomingTimeOffs?.length > 0 ? (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={sortedUpcomingTimeOff}
                        renderItem={({ item }) => <EmployeeHorizontalCard employee={item} styles={styles} />}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.horizontalList}
                    />
                ) : (
                    <View style={styles.emptyListContainer}>
                        <Text style={styles.emptyListText}>No upcoming time off scheduled</Text>
                    </View>
                )}

            </ScrollView>

            <CustomDateRangePicker
                visible={showDatePicker}
                onClose={() => setShowDatePicker(false)}
                onApply={handleDateApply}
                initialStartDate={selectedDate}
                initialEndDate={selectedDate}
                selectionMode="single"
            />
        </SafeAreaView>
    );
};

export default AdminDashboard;
