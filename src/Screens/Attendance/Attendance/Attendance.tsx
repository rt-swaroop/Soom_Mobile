import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

import { View, FlatList, Text, TouchableOpacity, RefreshControl, Modal, TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { showMessage } from "react-native-flash-message";
import { useFocusEffect } from "@react-navigation/native";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import AttendanceCard from "./components/AttendanceCard";
import CustomDateRangePicker from "../../../components/CustomDateRangePicker/CustomDateRangePicker";
import AttendanceCardSkeleton from "../../../components/Skeleton/AttendanceCardSkeleton";

import { selectUser } from "../../../redux/selector";
import { createStyles } from "./Attendance.styles";
import { useAppTheme } from "../../../theme/useAppTheme";
import { getAttendance } from "../../../services/attendanceServices";

dayjs.extend(isoWeek);

const AttendanceScreen = () => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [startDate, setStartDate] = useState(dayjs().startOf("isoWeek"));
    const [endDate, setEndDate] = useState(dayjs().endOf("isoWeek"));
    const [showPicker, setShowPicker] = useState(false);
    const [showWeekDropdown, setShowWeekDropdown] = useState(false);

    const [attendanceData, setAttendanceData] = useState<{ attendanceDate: string;[key: string]: any }[]>([]);
    const [publicHolidays, setPublicHolidays] = useState<{ _id: string; title: string; date: string; type: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const user = useSelector(selectUser);

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

    const fetchUserAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await getAttendance({
                userId: user?._id || "",
                subscriberId: user?.companyId?._id || "",
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD"),
                timeZone
            });

            if (response?.success) {
                setAttendanceData(response?.attendance || []);
                setPublicHolidays(response?.publicHolidays || []);
            }
        } catch (error) {
            console.error(error);
            showMessage({
                message: "Error fetching attendance",
                type: "danger"
            });
        } finally {
            setLoading(false);
        }
    }, [user?._id, user?.companyId?._id, startDate, endDate]);

    useFocusEffect(
        useCallback(() => {
            fetchUserAttendance();
        }, [fetchUserAttendance])
    );

    useEffect(() => {
        fetchUserAttendance();
    }, [fetchUserAttendance]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserAttendance();
        setRefreshing(false);
    };

    const handleApplyRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleWeekSelect = (week: any) => {
        setStartDate(week.start);
        setEndDate(week.end);
        setShowWeekDropdown(false);
    };

    const daysCount = endDate.diff(startDate, 'day') + 1;
    const dateRange = useMemo(() => {
        return Array.from({ length: daysCount > 0 ? daysCount : 0 }, (_, i) => startDate.add(i, "day"));
    }, [startDate, daysCount]);

    const mergedData = dateRange.map((date) => {
        const formattedDate = date.format("YYYY-MM-DD");
        const holiday = publicHolidays.find(h => dayjs(h.date).format("YYYY-MM-DD") === formattedDate);
        const existing = attendanceData.find(item => item.clockInTime && dayjs(item.clockInTime).format("YYYY-MM-DD") === formattedDate);

        if (existing) {
            return {
                id: existing._id,
                date: formattedDate,
                clockIn: existing.clockInTime ? dayjs(existing.clockInTime).format("hh:mm A") : "--",
                clockOut: existing.clockOutTime ? dayjs(existing.clockOutTime).format("hh:mm A") : "--",
                clockInLocation: existing?.clockinLocation,
                clockOutLocation: existing?.clockoutLocation,
                place: existing.place || "--",
                grossHours: existing.grossHours || "--",
                arrival: existing.arrival || "--",
                isHoliday: !!holiday,
                holidayTitle: holiday?.title || null,
            };
        }
        return {
            id: formattedDate,
            date: formattedDate,
            clockIn: "--", clockOut: "--", clockInLocation: null, clockOutLocation: null,
            place: "--", grossHours: "--", arrival: "--",
            isHoliday: !!holiday, holidayTitle: holiday?.title || null,
        };
    });

    const isCurrentRange = (start: dayjs.Dayjs, end: dayjs.Dayjs) => {
        return startDate.isSame(start, 'day') && endDate.isSame(end, 'day');
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.weekHeader} onPress={() => setShowWeekDropdown(true)}>
                    <Text style={styles.weekText}>
                        {startDate.format("MMM DD")} - {endDate.format("MMM DD")}
                    </Text>
                    <Icon name="chevron-down" size={18} color={theme.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => setShowPicker(true)}
                >
                    <Icon name="calendar-month" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

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

            {loading && !refreshing ? (
                <FlatList
                    data={[1, 2, 3]}
                    keyExtractor={(item) => item.toString()}
                    renderItem={() => <AttendanceCardSkeleton />}
                    contentContainerStyle={{ padding: 15 }}
                />
            ) : (
                <FlatList
                    data={mergedData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <AttendanceCard item={item} />}
                    contentContainerStyle={{ padding: 15 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
};

export default AttendanceScreen;