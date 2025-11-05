import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { View, Text, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';

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

const ShiftCard = () => {
    const [shiftData, setShiftData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const user = useSelector(selectUser);

    useFocusEffect(
        useCallback(() => {
            fetchUserShifts();
        }, [])
    );

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
                data
            })
            setShiftData(response[0])

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

    return (
        <View style={styles.shiftCard}>
            <View style={styles.shiftHeader}>
                <Icon name="briefcase-outline" size={22} color="#4c669f" />
                <Text style={styles.shiftTitle}>{shiftData?.shiftData?.shiftTitle}</Text>
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
                        <Text style={styles.shiftValue}>{formatTime(shiftData?.shiftData?.startTime)}</Text>

                    </View>
                </View>

                <View style={styles.shiftItem}>
                    <Icon name="alarm-outline" size={20} color="#999" />
                    <View style={styles.shiftItemTextWrap}>
                        <Text style={styles.shiftLabel}>End</Text>
                        <Text style={styles.shiftValue}>{formatTime(shiftData?.shiftData?.endTime)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ShiftCard;


