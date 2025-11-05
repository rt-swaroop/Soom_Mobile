import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { styles } from './DailyReports.styles';
import { ROUTES } from '../../../navigation/routes';
import { COLORS } from '../../../theme/colors';

import { selectUser } from '../../../redux/selector';

import DailyReportCard from './components/DailyReportCard';
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
    const today = dayjs();
    const [dailyReport, setDailyReport] = useState<DailyReportData | null>(null)
    const [selectedDate, setSelectedDate] = useState(today);
    const [weekStart, setWeekStart] = useState(today.startOf('isoWeek'));

    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    const navigation = useNavigation<NavigationProp<any>>();

    const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));
    const isToday = selectedDate.isSame(today, 'day');

    const fetchDailyReports = async () => {

        if (!user?._id) return;

        setLoading(true)
        try {

            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

            const response = await getDailyReports({ userId: user._id, formattedDate, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone })

            console.log("Daily Reports Response:", response);
            setDailyReport(response?.data || null)

        } catch (error) {
            console.error("Error fetching leave history:", error);
            showMessage({
                message: "Error fetching leave history",
                description: "Unable to retrieve leave history. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchDailyReports();
        }, [user?._id, selectedDate])
    );

    const handlePrevWeek = () => {
        const newStart = weekStart.subtract(1, 'week');
        setWeekStart(newStart);
        setSelectedDate(newStart);
    };

    const handleNextWeek = () => {
        const newStart = weekStart.add(1, 'week');
        setWeekStart(newStart);
        setSelectedDate(newStart);
    };

    if (loading) {
        return (
            <View style={[styles.loader, { justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={handlePrevWeek}>
                        <Icon name="chevron-left" size={28} color={COLORS.primary} />
                    </TouchableOpacity>

                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={weekDays}
                        keyExtractor={(item) => item.format('YYYY-MM-DD')}
                        renderItem={({ item }) => {
                            const isSelected = item.isSame(selectedDate, 'day');
                            return (
                                <TouchableOpacity onPress={() => setSelectedDate(item)} style={styles.dayContainer}>
                                    <Text style={styles.dayText}>{item.format('ddd')}</Text>
                                    <View style={[styles.circle, isSelected && styles.selectedCircle]}>
                                        <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
                                            {item.format('D')}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        }}
                        contentContainerStyle={{ paddingBottom: 12 }}
                    />

                    <TouchableOpacity onPress={handleNextWeek}>
                        <Icon name="chevron-right" size={28} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

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
                            <Icon name="edit" size={18} color={COLORS.white} />
                            <Text style={styles.editButtonText}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                <View style={{ marginTop: 4, marginBottom: 12 }}>
                    {dailyReport && Array.isArray(dailyReport.tasks) && dailyReport.tasks.length > 0 ? (
                        dailyReport.tasks.map((task) => (
                            <DailyReportCard key={task._id} task={task} />
                        ))
                    ) : (
                        <>
                            {isToday ? (
                                <TouchableOpacity
                                    style={styles.emptyStateContainer}
                                    onPress={() => navigation.navigate(ROUTES.SUBMITDAILYREPORT)}
                                >
                                    <Icon name="add-circle-outline" size={80} color={COLORS.gray} />
                                    <Text style={styles.emptyStateText}>
                                        No reports for today
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <Text style={styles.emptyStateText}>
                                        No reports for this day
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>

            </ScrollView>

            <View style={styles.fixedButtonContainer}>
                {dailyReport?.submittedDate && (
                    (() => {
                        const totalMinutes =
                            dailyReport.tasks?.reduce(
                                (acc, t) => acc + t.hours * 60 + t.minutes,
                                0
                            ) || 0;

                        const totalHours = Math.floor(totalMinutes / 60);
                        const remainingMinutes = totalMinutes % 60;

                        return (
                            <View style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>
                                    Total Time:- {totalHours}h {remainingMinutes}m
                                </Text>
                            </View>
                        );
                    })()
                )}
            </View>
        </View>
    );

};

export default DailyReports;