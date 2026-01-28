import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Modal, TouchableWithoutFeedback } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { createStyles } from './DailyReports.styles';
import { ROUTES } from '../../../navigation/routes';
import { COLORS } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/useAppTheme';

import { selectUser } from '../../../redux/selector';

import DailyReportCard from './components/DailyReportCard';
import DailyReportSkeleton from '../../../components/Skeleton/DailyReportSkeleton';
import CustomDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';

import { getDailyReports } from '../../../services/dailyReportsServices';

dayjs.extend(customParseFormat);
dayjs.extend(isoWeek);

interface Task {
    _id: string;
    description: string;
    hours: number;
    minutes: number;
    company: string;
    status: 'Completed' | 'In Progress' | string;
}

interface DailyReportData {
    _id: string;
    userId: string;
    employeeId: string;
    employeeName: string;
    submittedDate: string;
    tasks: Task[];
    __v?: number;
}

const DailyReports = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const today = dayjs();
    const [dailyReport, setDailyReport] = useState<DailyReportData | null>(null);
    const [selectedDate, setSelectedDate] = useState(today);
    const [showPicker, setShowPicker] = useState(false);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const user = useSelector(selectUser);
    const navigation = useNavigation<NavigationProp<any>>();

    const isToday = selectedDate.isSame(today, 'day');

    const pastDates = useMemo(() => {
        const dates = [];
        for (let i = 0; i < 5; i++) {
            dates.push(dayjs().subtract(i, 'day'));
        }
        return dates;
    }, []);

    const fetchDailyReports = useCallback(async () => {
        if (!user?._id) return;

        setLoading(true);
        try {
            const formattedDate = selectedDate.format('YYYY-MM-DD');
            const response = await getDailyReports({
                userId: user._id,
                formattedDate,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            });

            setDailyReport(response?.data || null);
        } catch (error) {
            console.error("Error fetching daily reports:", error);
            showMessage({
                message: "Error fetching reports",
                type: "danger",
            });
        } finally {
            setLoading(false);
        }
    }, [user?._id, selectedDate]);

    useFocusEffect(
        useCallback(() => {
            fetchDailyReports();
        }, [fetchDailyReports])
    );

    useEffect(() => {
        fetchDailyReports();
    }, [fetchDailyReports]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDailyReports();
        setRefreshing(false);
    };

    const handleApplyDate = (start: dayjs.Dayjs) => {
        setSelectedDate(start);
    };

    const handleQuickDateSelect = (date: dayjs.Dayjs) => {
        setSelectedDate(date);
        setShowDateDropdown(false);
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
                }
            >
                <View style={styles.headerRow}>
                    <TouchableOpacity
                        style={styles.dateDisplay}
                        onPress={() => setShowDateDropdown(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dateHeaderText}>
                            {selectedDate.format('MMMM DD, YYYY')}
                        </Text>
                        <Icon name="chevron-down" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.calendarBtn}
                        onPress={() => setShowPicker(true)}
                        activeOpacity={0.8}
                    >
                        <Icon name="calendar-search" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                </View>

                {/* Quick Date Dropdown */}
                {showDateDropdown && (
                    <Modal transparent animationType="fade">
                        <TouchableWithoutFeedback onPress={() => setShowDateDropdown(false)}>
                            <View style={styles.dropdownOverlay}>
                                <View style={styles.dropdownMenu}>
                                    {pastDates.map((date, idx) => {
                                        const active = selectedDate.isSame(date, 'day');
                                        return (
                                            <React.Fragment key={idx}>
                                                <TouchableOpacity
                                                    style={[styles.dropdownItem, active && styles.activeDropdownItem]}
                                                    onPress={() => handleQuickDateSelect(date)}
                                                >
                                                    <Text style={[styles.dropdownItemText, active && styles.activeDropdownItemText]}>
                                                        {idx === 0 ? "Today, " : ""}{date.format('MMM DD, YYYY')}
                                                    </Text>
                                                    {active && <Icon name="check" size={18} color={COLORS.primary} style={{ marginLeft: 'auto' }} />}
                                                </TouchableOpacity>
                                                {idx < pastDates.length - 1 && <View style={styles.dropdownDivider} />}
                                            </React.Fragment>
                                        );
                                    })}
                                    <TouchableOpacity
                                        style={[styles.dropdownItem, styles.calendarOption]}
                                        onPress={() => {
                                            setShowDateDropdown(false);
                                            setShowPicker(true);
                                        }}
                                    >
                                        <Icon name="calendar-month" size={20} color={theme.textSecondary} style={{ marginRight: 10 }} />
                                        <Text style={[styles.dropdownItemText, { color: theme.textSecondary }]}>Open Calendar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}

                {isToday && dailyReport && (
                    <View style={styles.editButtonContainer}>
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() =>
                                navigation.navigate(ROUTES.SUBMITDAILYREPORT, {
                                    mode: 'edit',
                                    reportData: dailyReport,
                                })
                            }
                        >
                            <Icon name="pencil" size={18} color="#3B82F6" />
                            <Text style={styles.editButtonText}>Edit Report</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ marginTop: 4 }}>
                    {loading && !refreshing ? (
                        [1, 2, 3].map((i) => <DailyReportSkeleton key={i} />)
                    ) : dailyReport && Array.isArray(dailyReport.tasks) && dailyReport.tasks.length > 0 ? (
                        dailyReport.tasks.map((task) => (
                            <DailyReportCard key={task._id} task={task} />
                        ))
                    ) : (
                        <View style={styles.emptyStateContainer}>
                            <TouchableOpacity
                                style={styles.emptyStateIconWrapper}
                                onPress={() => navigation.navigate(ROUTES.SUBMITDAILYREPORT)}
                                activeOpacity={0.7}
                            >
                                <Icon
                                    name={isToday ? "plus" : "file-search-outline"}
                                    size={56}
                                    color={COLORS.primary}
                                />
                            </TouchableOpacity>
                            <Text style={styles.emptyStateText}>
                                {isToday ? "No reports submitted yet for today" : "No reports found for this date"}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            {dailyReport?.submittedDate && (
                <View style={styles.fixedButtonContainer}>
                    {(() => {
                        const totalMinutes =
                            dailyReport.tasks?.reduce(
                                (acc, t) => acc + t.hours * 60 + (t.minutes || 0),
                                0
                            ) || 0;

                        const totalHours = Math.floor(totalMinutes / 60);
                        const remainingMinutes = totalMinutes % 60;

                        return (
                            <View style={styles.submitButton}>
                                <Icon name="clock-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                                <Text style={styles.submitButtonText}>
                                    TOTAL TIME: {totalHours}h {remainingMinutes}m
                                </Text>
                            </View>
                        );
                    })()}
                </View>
            )}

            <CustomDateRangePicker
                visible={showPicker}
                onClose={() => setShowPicker(false)}
                onApply={handleApplyDate}
                initialStartDate={selectedDate}
                initialEndDate={selectedDate}
                selectionMode="single"
            />
        </View>
    );
};

export default DailyReports;