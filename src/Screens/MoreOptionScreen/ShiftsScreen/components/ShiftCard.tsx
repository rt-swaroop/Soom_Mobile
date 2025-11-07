import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';

import { COLORS } from '../../../../theme/colors';
import { styles } from '../Shifts.styles';

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

type PublicHoliday = {
    _id: string;
    subscriberId: string;
    title: string;
    date: string;
    type: string;
};

type ShiftCardProps = {
    date: string;
    dayName: string;
    shift?: ShiftItem;
    holiday?: PublicHoliday;
};

const formatTime = (time?: string) => {
    if (!time) return '--:--';
    try {
        const parsed = dayjs(time, ['HH:mm', 'hh:mm A']);
        return parsed.isValid() ? parsed.format('hh:mm A') : time;
    } catch {
        return time || '--:--';
    }
};

const ShiftCard: React.FC<ShiftCardProps> = ({ date, dayName, shift, holiday }) => {
    if (shift?.isPublicHoliday || holiday) {
        const holidayTitle = typeof shift?.holidayData === 'object' && shift?.holidayData?.title
            ? shift.holidayData.title
            : holiday?.title || 'Public Holiday';

        return (
            <View style={[styles.card, { padding: 0 }]}>
                <LinearGradient
                    colors={["#FF6B6B", "#FF8E53"]}
                    style={styles.cardHeaderGradient}
                >
                    <View style={styles.cardHeader}>
                        <IconMC name="calendar-star" size={24} color={COLORS.white} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.cardTitleWhite}>{dayName}</Text>
                            <Text style={styles.cardDateWhite}>{dayjs(date).format('DD MMM, YYYY')}</Text>
                        </View>
                        <View style={[styles.badge, styles.holidayBadge]}>
                            <Text style={styles.badgeTextWhite}>Public Holiday</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.cardBody}>
                    <View style={styles.holidayContainer}>
                        <IconMC name="party-popper" size={48} color="#FF6B6B" style={{ marginBottom: 12 }} />
                        <Text style={styles.holidayTitle}>{holidayTitle}</Text>
                        <Text style={styles.holidayText}>No shift scheduled</Text>
                    </View>
                </View>
            </View>
        );
    }

    if (shift?.isWeekOff || shift?.shiftType === 'Week Off') {
        return (
            <View style={[styles.card, { padding: 0 }]}>
                <LinearGradient
                    colors={["#9CA3AF", "#6B7280"]}
                    style={styles.cardHeaderGradient}
                >
                    <View style={styles.cardHeader}>
                        <IconMC name="calendar-remove" size={24} color={COLORS.white} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.cardTitleWhite}>{dayName}</Text>
                            <Text style={styles.cardDateWhite}>{dayjs(date).format('DD MMM, YYYY')}</Text>
                        </View>
                        <View style={[styles.badge, styles.weekOffBadge]}>
                            <Text style={styles.badgeTextWhite}>Week Off</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.cardBody}>
                    <View style={styles.weekOffContainer}>
                        <IconMC name="calendar-blank" size={48} color="#9CA3AF" style={{ marginBottom: 12 }} />
                        <Text style={styles.weekOffTitle}>Week Off</Text>
                        <Text style={styles.weekOffText}>No shift scheduled</Text>
                    </View>
                </View>
            </View>
        );
    }

    if (shift?.shiftData) {
        return (
            <View style={[styles.card, { padding: 0 }]}>
                <LinearGradient
                    colors={["#4C6EF5", "#3B5998", "#192f6a"]}
                    style={styles.shiftHeaderGradient}
                >
                    <View style={styles.cardHeader}>
                        <Icon name="briefcase-outline" size={24} color={COLORS.white} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.cardTitleWhite}>{shift.shiftData.shiftTitle || 'Shift'}</Text>
                            <Text style={styles.cardDateWhite}>{dayName}, {dayjs(date).format('DD MMM, YYYY')}</Text>
                        </View>
                        <View style={[styles.badge, styles.activeBadge]}>
                            <Text style={styles.badgeTextWhite}>Active</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.cardBody}>
                    <View style={styles.timeRow}>
                        <View style={styles.timeBox}>
                            <Icon name="time-outline" size={24} color={COLORS.primary} />
                            <View style={styles.timeBoxContent}>
                                <Text style={styles.timeLabel}>Start Time</Text>
                                <Text style={styles.timeValue}>{formatTime(shift.shiftData.startTime)}</Text>
                            </View>
                        </View>

                        <View style={styles.timeDivider} />

                        <View style={styles.timeBox}>
                            <Icon name="alarm-outline" size={24} color={COLORS.primary} />
                            <View style={styles.timeBoxContent}>
                                <Text style={styles.timeLabel}>End Time</Text>
                                <Text style={styles.timeValue}>{formatTime(shift.shiftData.endTime)}</Text>
                            </View>
                        </View>
                    </View>

                    {shift.shiftData.duration && (
                        <View style={styles.durationContainer}>
                            <Icon name="hourglass-outline" size={20} color={COLORS.primary} />
                            <Text style={styles.durationText}>
                                Duration: <Text style={styles.durationValue}>{shift.shiftData.duration}</Text>
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.card, styles.emptyCard]}>
            <View style={styles.cardHeader}>
                <Icon name="calendar-outline" size={20} color="#9CA3AF" />
                <View style={styles.headerTextContainer}>
                    <Text style={[styles.cardTitle, { color: '#9CA3AF' }]}>{dayName}</Text>
                    <Text style={[styles.cardDate, { color: '#9CA3AF' }]}>{dayjs(date).format('DD MMM, YYYY')}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: '#F3F4F6' }]}>
                    <Text style={[styles.badgeText, { color: '#9CA3AF' }]}>No Shift</Text>
                </View>
            </View>
        </View>
    );
};

export default ShiftCard;

