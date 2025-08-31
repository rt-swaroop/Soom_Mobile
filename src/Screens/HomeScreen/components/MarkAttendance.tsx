import React, { useEffect, useState } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import dayjs from 'dayjs';

import { styles } from '../Home.styles';

const MarkAttendance = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        updateDateTime();

        const timer = setInterval(updateDateTime, 1000);

        return () => clearInterval(timer);
    }, []);

    const updateDateTime = () => {
        const now = dayjs();
        setCurrentTime(now.format('hh:mm:ss A'));
        setCurrentDate(now.format('dddd, MMMM D, YYYY'));
    };

    const gradientColors = ['#4c669f', '#3b5998', '#192f6a'];

    return (
        <View style={styles.attendanceCard}>
            <Text style={styles.timeText}>{currentTime}</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
            <LinearGradient colors={gradientColors} style={styles.attendanceButtonContainer}>
                <TouchableOpacity style={styles.attendanceButton}>
                    <Icon name="hand-right-outline" size={40} color="white" />
                    <Text style={styles.attendanceButtonText}>Clock IN</Text>
                </TouchableOpacity>
            </LinearGradient>
            <View style={styles.locationItem}>
                <Icon name="location-outline" size={20} color="#999" />
                <Text style={styles.locationText}>Location: Hyderabad, Telangana, India</Text>
            </View>
            <View style={styles.dashedLine}></View>
            <View style={styles.summaryContainer}>
                <View style={styles.actionItem}>
                    <Icon name="log-in-outline" size={30} color="#999" />
                    <Text style={styles.actionLabel}>00:00</Text>
                    <Text style={styles.actionText}>Clock in</Text>
                </View>
                <View style={styles.actionItem}>
                    <Icon name="log-out-outline" size={30} color="#999" />
                    <Text style={styles.actionLabel}>00:00</Text>
                    <Text style={styles.actionText}>Clock out</Text>
                </View>
                <View style={styles.actionItem}>
                    <Icon name="time-outline" size={30} color="#999" />
                    <Text style={styles.actionLabel}>00:00</Text>
                    <Text style={styles.actionText}>Total hrs</Text>
                </View>
            </View>
        </View>
    );
};

export default MarkAttendance;