import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

import { createStyles } from "./CustomDateRangePicker.styles";

import { useAppTheme } from "../../theme/useAppTheme";

dayjs.extend(isBetween);

interface CustomDateRangePickerProps {
    visible: boolean;
    onClose: () => void;
    onApply: (startDate: dayjs.Dayjs, endDate: dayjs.Dayjs) => void;
    initialStartDate?: dayjs.Dayjs;
    initialEndDate?: dayjs.Dayjs;
    selectionMode?: 'single' | 'range';
}

const CustomDateRangePicker: React.FC<CustomDateRangePickerProps> = ({
    visible,
    onClose,
    onApply,
    initialStartDate,
    initialEndDate,
    selectionMode = 'range'
}) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [viewDate, setViewDate] = useState(dayjs());
    const [selectedStart, setSelectedStart] = useState<dayjs.Dayjs | null>(initialStartDate || null);
    const [selectedEnd, setSelectedEnd] = useState<dayjs.Dayjs | null>(initialEndDate || null);

    useEffect(() => {
        if (visible) {
            setSelectedStart(initialStartDate || null);
            setSelectedEnd(initialEndDate || null);
            if (initialStartDate) {
                setViewDate(initialStartDate);
            }
        }
    }, [visible, initialStartDate, initialEndDate]);

    const generateDays = useMemo(() => {
        const startOfMonth = viewDate.startOf("month");
        const endOfMonth = viewDate.endOf("month");
        const daysInMonth = viewDate.daysInMonth();

        const startDay = startOfMonth.day();
        const prevMonthDays = [];
        for (let i = startDay - 1; i >= 0; i--) {
            prevMonthDays.push(startOfMonth.subtract(i + 1, "day"));
        }

        const currentMonthDays = [];
        for (let i = 0; i < daysInMonth; i++) {
            currentMonthDays.push(startOfMonth.add(i, "day"));
        }

        const totalCells = 42;
        const nextMonthDays = [];
        const remaining = totalCells - prevMonthDays.length - currentMonthDays.length;
        for (let i = 0; i < remaining; i++) {
            nextMonthDays.push(endOfMonth.add(i + 1, "day"));
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    }, [viewDate]);

    const handleDayPress = (day: dayjs.Dayjs) => {
        if (selectionMode === 'single') {
            setSelectedStart(day);
            setSelectedEnd(day);
        } else {
            if (!selectedStart || (selectedStart && selectedEnd)) {
                setSelectedStart(day);
                setSelectedEnd(null);
            } else if (selectedStart && !selectedEnd) {
                if (day.isBefore(selectedStart)) {
                    setSelectedStart(day);
                    setSelectedEnd(null);
                } else {
                    setSelectedEnd(day);
                }
            }
        }
    };

    const isDaySelected = (day: dayjs.Dayjs) => {
        if (selectionMode === 'single') {
            return selectedStart && day.isSame(selectedStart, 'day');
        }
        return (selectedStart && day.isSame(selectedStart, 'day')) ||
            (selectedEnd && day.isSame(selectedEnd, 'day'));
    };

    const isDayInRange = (day: dayjs.Dayjs) => {
        if (selectionMode === 'single' || !selectedStart || !selectedEnd) return false;
        return day.isBetween(selectedStart, selectedEnd, 'day', '[]');
    };

    const isStart = (day: dayjs.Dayjs) => selectedStart && day.isSame(selectedStart, 'day');
    const isEnd = (day: dayjs.Dayjs) => selectionMode === 'range' && selectedEnd && day.isSame(selectedEnd, 'day');

    const canApply = selectionMode === 'single' ? !!selectedStart : (!!selectedStart && !!selectedEnd);

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.navBtn}
                            onPress={() => setViewDate((prev: dayjs.Dayjs) => prev.subtract(1, "month"))}
                        >
                            <Icon name="chevron-left" size={24} color="#FFF" />
                        </TouchableOpacity>

                        <Text style={styles.monthTitle}>{viewDate.format("MMMM YYYY")}</Text>

                        <TouchableOpacity
                            style={styles.navBtn}
                            onPress={() => setViewDate((prev: dayjs.Dayjs) => prev.add(1, "month"))}
                        >
                            <Icon name="chevron-right" size={24} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.summaryContainer}>
                        {selectionMode === 'range' ? (
                            <>
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>From</Text>
                                    <Text style={styles.summaryValue}>{selectedStart ? selectedStart.format("MMM DD, YYYY") : "Select Start"}</Text>
                                </View>
                                <Icon name="arrow-right" size={16} color={theme.textSecondary} style={{ alignSelf: 'center', marginTop: 10 }} />
                                <View style={styles.summaryItem}>
                                    <Text style={styles.summaryLabel}>To</Text>
                                    <Text style={styles.summaryValue}>{selectedEnd ? selectedEnd.format("MMM DD, YYYY") : "Select End"}</Text>
                                </View>
                            </>
                        ) : (
                            <View style={[styles.summaryItem, { flex: 1 }]}>
                                <Text style={styles.summaryLabel}>Selected Date</Text>
                                <Text style={styles.summaryValue}>{selectedStart ? selectedStart.format("MMMM DD, YYYY") : "Select a date"}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.calendarBody}>
                        <View style={styles.weekDaysRow}>
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                <Text key={day} style={styles.weekDayText}>{day[0]}</Text>
                            ))}
                        </View>

                        <View style={styles.daysGrid}>
                            {generateDays.map((day, idx) => {
                                const inMonth = day.isSame(viewDate, "month");
                                const selected = isDaySelected(day);
                                const inRange = isDayInRange(day);
                                const start = isStart(day);
                                const end = isEnd(day);
                                const today = day.isSame(dayjs(), 'day');

                                return (
                                    <TouchableOpacity
                                        key={idx}
                                        style={[
                                            styles.dayCell,
                                            inRange && styles.inRangeDay,
                                            start && styles.rangeStart,
                                            end && styles.rangeEnd,
                                            today && !selected && !inRange && styles.todayCell
                                        ]}
                                        onPress={() => handleDayPress(day)}
                                    >
                                        <Text style={[
                                            styles.dayText,
                                            !inMonth && styles.notInMonthText,
                                            selected && styles.selectedDayText
                                        ]}>
                                            {day.date()}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.footerBtn, styles.cancelBtn]} onPress={onClose}>
                            <Text style={[styles.btnText, styles.cancelBtnText]}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.footerBtn, styles.applyBtn, !canApply && { opacity: 0.5 }]}
                            disabled={!canApply}
                            onPress={() => {
                                if (selectedStart && selectedEnd) {
                                    onApply(selectedStart, selectedEnd);
                                    onClose();
                                }
                            }}
                        >
                            <Text style={[styles.btnText, styles.applyBtnText]}>
                                {selectionMode === 'range' ? 'Apply Range' : 'Apply Date'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

export default CustomDateRangePicker;
