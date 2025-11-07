import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

import { styles } from '../Home.styles';
import { COLORS } from '../../../../theme/colors';

import { selectUser } from '../../../../redux/selector';

import { getUserShifts } from '../../../../services/shiftServices';

const formatTime = (time?: string) => {
    if (!time) return '--:--';
    try {
        const parsed = dayjs(time, ['HH:mm', 'hh:mm A']);
        return parsed.isValid() ? parsed.format('hh:mm A') : time;
    } catch {
        return time;
    }
};

type ShiftCardProps = { refreshKey?: number };

const ShiftCard = ({ refreshKey }: ShiftCardProps) => {
    const [shiftData, setShiftData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    useFocusEffect(
        useCallback(() => {
            fetchUserShifts();
        }, [])
    );

    useEffect(() => {
        if (typeof refreshKey === 'number') {
            fetchUserShifts();
        }
    }, [refreshKey])

    const fetchUserShifts = async () => {
        setLoading(true);

        try {

            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const currentDay = dayjs();
            const formattedData = {
                startDate: currentDay.format('YYYY-MM-DD'),
                endDate: currentDay.format('YYYY-MM-DD'),
            };

            const data = { formattedData, timeZone }

            const response = await getUserShifts({
                userId: user?._id || '',
                subscriberId: user?.companyId?._id || "",
                data
            })

            const todayShift = response?.shifts?.find((s: any) => s.date === currentDay.format('YYYY-MM-DD'));
            const todayHoliday = response?.publicHolidays?.find(
                (h: any) => dayjs(h.date).format('YYYY-MM-DD') === currentDay.format('YYYY-MM-DD')
            );

            setShiftData({
                shift: todayShift,
                holiday: todayHoliday,
                fullResponse: response
            })

        } catch (error) {
            console.log("error", error)
            showMessage({
                message: "Error fetching  shift data",
                description: "Unable to retrieve shift information. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <View style={[styles.shiftCard, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (!shiftData) {
        return (
            <View style={[styles.shiftCard, { alignItems: 'center', justifyContent: 'center' }]}>
                <Icon name="briefcase-outline" size={40} color={COLORS.gray} />
                <Text style={{ color: COLORS.gray, fontWeight: '500', marginTop: 8 }}>
                    No shift assigned for today
                </Text>
            </View>
        );
    }

    const shift = shiftData.shift;
    const holiday = shiftData.holiday;

    if (shift?.isPublicHoliday || holiday) {
        const holidayTitle = typeof shift?.holidayData === 'object' && shift?.holidayData?.title
            ? shift.holidayData.title
            : holiday?.title || 'Public Holiday';

        return (
            <View style={[styles.shiftCard, { padding: 0, overflow: 'hidden' }]}>
                <LinearGradient
                    colors={["#FF6B6B", "#FF8E53"]}
                    style={{ padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <IconMC name="calendar-star" size={24} color={COLORS.white} />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '700' }}>
                                    {holidayTitle}
                                </Text>
                                <Text style={{ color: COLORS.white, fontSize: 12, opacity: 0.9, marginTop: 4 }}>
                                    Public Holiday
                                </Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '600' }}>Today</Text>
                        </View>
                    </View>
                </LinearGradient>
                <View style={{ padding: 16, alignItems: 'center' }}>
                    <IconMC name="party-popper" size={40} color="#FF6B6B" />
                    <Text style={{ color: COLORS.gray, fontSize: 14, marginTop: 8, fontStyle: 'italic' }}>
                        No shift scheduled
                    </Text>
                </View>
            </View>
        );
    }

    if (shift?.isWeekOff || shift?.shiftType === 'Week Off') {
        return (
            <View style={[styles.shiftCard, { padding: 0, overflow: 'hidden' }]}>
                <LinearGradient
                    colors={["#9CA3AF", "#6B7280"]}
                    style={{ padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <IconMC name="calendar-remove" size={24} color={COLORS.white} />
                            <View style={{ marginLeft: 12, flex: 1 }}>
                                <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: '700' }}>
                                    Week Off
                                </Text>
                                <Text style={{ color: COLORS.white, fontSize: 12, opacity: 0.9, marginTop: 4 }}>
                                    Rest Day
                                </Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                            <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: '600' }}>Today</Text>
                        </View>
                    </View>
                </LinearGradient>
                <View style={{ padding: 16, alignItems: 'center' }}>
                    <IconMC name="calendar-blank" size={40} color="#9CA3AF" />
                    <Text style={{ color: COLORS.gray, fontSize: 14, marginTop: 8, fontStyle: 'italic' }}>
                        No shift scheduled
                    </Text>
                </View>
            </View>
        );
    }

    // Regular Shift
    if (shift?.shiftData) {
        return (
            <View style={styles.shiftCard}>
                <View style={styles.shiftHeader}>
                    <Icon name="briefcase-outline" size={22} color="#4c669f" />
                    <Text style={styles.shiftTitle}>{shift.shiftData.shiftTitle}</Text>
                    <View style={styles.shiftBadge}>
                        <Text style={styles.shiftBadgeText}>Today</Text>
                    </View>
                </View>

                <View style={styles.dashedLine} />

                <View style={styles.shiftRow}>
                    <View style={styles.shiftItem}>
                        <Icon name="time-outline" size={20} color="#999" />
                        <View style={styles.shiftItemTextWrap}>
                            <Text style={styles.shiftLabel}>Start</Text>
                            <Text style={styles.shiftValue}>{formatTime(shift.shiftData.startTime)}</Text>
                        </View>
                    </View>

                    <View style={styles.shiftItem}>
                        <Icon name="alarm-outline" size={20} color="#999" />
                        <View style={styles.shiftItemTextWrap}>
                            <Text style={styles.shiftLabel}>End</Text>
                            <Text style={styles.shiftValue}>{formatTime(shift.shiftData.endTime)}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.shiftCard, { alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name="briefcase-outline" size={40} color={COLORS.gray} />
            <Text style={{ color: COLORS.gray, fontWeight: '500', marginTop: 8 }}>
                No shift assigned for today
            </Text>
        </View>
    );
};

export default ShiftCard;
