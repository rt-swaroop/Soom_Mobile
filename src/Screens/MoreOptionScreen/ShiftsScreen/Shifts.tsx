import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, FlatList, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { styles } from './Shifts.styles'
import { COLORS } from '../../../theme/colors';

import { selectUser } from '../../../redux/selector';

import { getUserShifts } from '../../../services/shiftServices';
import ShiftCard from './components/ShiftCard';

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

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [shiftsData, setShiftsData] = useState<ShiftsResponse | null>(null);
    const [weekStart, setWeekStart] = useState(dayjs().startOf('isoWeek'));

    const timeZone = useMemo(() => Intl.DateTimeFormat().resolvedOptions().timeZone, []);

    const loadShifts = async (options?: { useSpinner?: boolean }) => {
        const useSpinner = options?.useSpinner ?? true;
        if (useSpinner) setLoading(true);
        try {
            const startDate = weekStart.startOf('isoWeek').format('YYYY-MM-DD');
            const endDate = weekStart.endOf('isoWeek').format('YYYY-MM-DD');

            const formattedData = { startDate, endDate };
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
        }, [weekStart])
    );

    useEffect(() => {
        if (!user?._id) {
            setShiftsData(null);
        }
    }, [user?._id]);

    const mergedData = useMemo(() => {
        if (!shiftsData) return [];

        const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));

        return weekDays.map((date) => {
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
    }, [shiftsData, weekStart]);

    const renderItem = ({ item }: { item: typeof mergedData[0] }) => {
        return <ShiftCard date={item.date} dayName={item.dayName} shift={item.shift} holiday={item.holiday} />;
    };

    const weekStartFormatted = weekStart.startOf('isoWeek');
    const weekEndFormatted = weekStart.endOf('isoWeek');

    const WeekHeader = (
        <View style={styles.weekHeader}>
            <TouchableOpacity
                style={styles.navButton}
                onPress={() => setWeekStart(prev => dayjs(prev).subtract(1, 'week'))}
            >
                <IconMC name="chevron-left" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <Text style={styles.weekText}>
                {weekStartFormatted.format("MMM DD")} - {weekEndFormatted.format("MMM DD")}
            </Text>

            <TouchableOpacity
                style={styles.navButton}
                onPress={() => setWeekStart(prev => dayjs(prev).add(1, 'week'))}
            >
                <IconMC name="chevron-right" size={24} color={COLORS.white} />
            </TouchableOpacity>
        </View>
    );

    if (loading && !refreshing) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View>
                {WeekHeader}
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