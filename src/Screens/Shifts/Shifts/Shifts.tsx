import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, FlatList, RefreshControl, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { createStyles } from './Shifts.styles'
import { COLORS } from '../../../theme/colors';
import { useAppTheme } from '../../../theme/useAppTheme';

import { selectUser } from '../../../redux/selector';

import { getUserShifts } from '../../../services/shiftServices';
import ShiftCard from './components/ShiftCard';
import CustomDateRangePicker from '../../../components/CustomDateRangePicker/CustomDateRangePicker';
import ShiftSkeleton from '../../../components/Skeleton/ShiftSkeleton';

type ShiftData = {
    _id: string;
    subscriberId: string;
    shiftTitle: string;
    startTime: string;
    endTime: string;
    note?: string;
    duration: string;
};

type ShiftItem = {
    date: string;
    userId: string;
    shiftType: string;
    shiftData: ShiftData | null;
    isDefault?: boolean;
    isPublicHoliday?: boolean;
    holidayData?: boolean | { title: string; date: string };
    isWeekOff?: boolean;
};

type ShiftsResponse = {
    userId: string;
    subscriberId: string;
    workingDays: string[];
    publicHolidays: Array<{
        _id: string;
        subscriberId: string;
        title: string;
        date: string;
        type: string;
    }>;
    shifts: ShiftItem[];
};


const Shifts = () => {
    const user = useSelector(selectUser);

    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [shiftsData, setShiftsData] = useState<ShiftsResponse | null>(null);
    const [startDate, setStartDate] = useState(dayjs().startOf('isoWeek'));
    const [endDate, setEndDate] = useState(dayjs().endOf('isoWeek'));
    const [showPicker, setShowPicker] = useState(false);
    const [showWeekDropdown, setShowWeekDropdown] = useState(false);

    const pastWeeks = useMemo(() => {
        const weeks = [];
        for (let i = 0; i < 5; i++) {
            const start = dayjs().subtract(i, 'week').startOf('isoWeek');
            const end = dayjs().subtract(i, 'week').endOf('isoWeek');
            weeks.push({
                label: i === 0 ? "Current Week" : `Last ${i} Week${i > 1 ? 's' : ''}`,
                range: `${start.format("MMM DD")} - ${end.format("MMM DD")}`,
                start,
                end
            });
        }
        return weeks;
    }, []);

    const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

    const loadShifts = async (options?: { useSpinner?: boolean }) => {
        const useSpinner = options?.useSpinner ?? true;
        if (useSpinner) setLoading(true);
        try {
            const formattedStartDate = startDate.format('YYYY-MM-DD');
            const formattedEndDate = endDate.format('YYYY-MM-DD');

            const formattedData = { startDate: formattedStartDate, endDate: formattedEndDate };
            const data = { formattedData, timeZone };

            const response: ShiftsResponse = await getUserShifts({
                userId: user?._id || '',
                subscriberId: user?.companyId?._id || "",
                data,
            });

            setShiftsData(response || null);
        } catch (error: any) {
            showMessage({
                message: 'Failed to fetch shifts',
                description: typeof error === 'string' ? error : 'Please try again later.',
                type: 'danger',
                duration: 3000,
            });
            setShiftsData(null);
        } finally {
            if (useSpinner) setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await loadShifts({ useSpinner: false });
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadShifts({ useSpinner: true });
        }, [startDate, endDate])
    );

    useEffect(() => {
        if (!user?._id) {
            setShiftsData(null);
        }
    }, [user?._id]);

    const mergedData = useMemo(() => {
        if (!shiftsData) return [];

        const daysCount = endDate.diff(startDate, 'day') + 1;
        const dateRange = Array.from({ length: daysCount > 0 ? daysCount : 0 }, (_, i) => startDate.add(i, "day"));

        return dateRange.map((date) => {
            const formattedDate = date.format("YYYY-MM-DD");
            const dayName = date.format("dddd");

            const shift = shiftsData.shifts?.find((s) => s.date === formattedDate);

            const holiday = shiftsData.publicHolidays?.find(
                (h) => dayjs(h.date).format("YYYY-MM-DD") === formattedDate
            );

            const isWorkingDay = shiftsData.workingDays?.includes(dayName) || false;

            return {
                date: formattedDate,
                dayName,
                shift,
                holiday,
                isWorkingDay,
            };
        });
    }, [shiftsData, startDate, endDate]);

    const handleApplyRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleWeekSelect = (week: any) => {
        setStartDate(week.start);
        setEndDate(week.end);
        setShowWeekDropdown(false);
    };

    const isCurrentRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        return startDate.isSame(start, 'day') && endDate.isSame(end, 'day');
    };

    const renderItem = ({ item }: { item: typeof mergedData[0] }) => {
        return <ShiftCard date={item.date} dayName={item.dayName} shift={item.shift} holiday={item.holiday} />;
    };


    const WeekHeader = (
        <View style={styles.headerRow}>
            <TouchableOpacity style={styles.weekHeader} onPress={() => setShowWeekDropdown(true)}>
                <Text style={styles.weekText}>
                    {startDate.format("MMM DD")} - {endDate.format("MMM DD")}
                </Text>
                <IconMC name="chevron-down" size={18} color={theme.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => setShowPicker(true)}
            >
                <IconMC name="calendar-month" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    {WeekHeader}
                    <FlatList
                        data={[1, 2, 3, 4, 5]}
                        keyExtractor={(item) => item.toString()}
                        renderItem={() => <ShiftSkeleton />}
                        contentContainerStyle={{ padding: 16 }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {WeekHeader}

                {showWeekDropdown && (
                    <Modal transparent animationType="none">
                        <TouchableWithoutFeedback onPress={() => setShowWeekDropdown(false)}>
                            <View style={styles.dropdownOverlay}>
                                <View style={styles.dropdownMenu}>
                                    {pastWeeks.map((week, idx) => {
                                        const active = isCurrentRange(week.start, week.end);
                                        return (
                                            <TouchableOpacity
                                                key={idx}
                                                style={[styles.dropdownItem, active && styles.activeDropdownItem]}
                                                onPress={() => handleWeekSelect(week)}
                                            >
                                                <Text style={[styles.dropdownItemText, active && styles.activeDropdownItemText]}>
                                                    {week.range} ({week.label})
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                )}

                <CustomDateRangePicker
                    visible={showPicker}
                    onClose={() => setShowPicker(false)}
                    onApply={handleApplyRange}
                    initialStartDate={startDate}
                    initialEndDate={endDate}
                />

                <FlatList
                    data={mergedData}
                    keyExtractor={(item) => item.date}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                    alwaysBounceVertical
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

export default Shifts;