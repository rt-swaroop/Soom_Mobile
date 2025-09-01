import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";

import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { showMessage } from "react-native-flash-message";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { styles } from "./Attendance.styles";
import AttendanceCard from "./components/AttendanceCard";

import { selectUser } from "../../redux/selector";
import { getAttendance } from "../../services/attendanceServices";

dayjs.extend(isoWeek);

const AttendanceScreen = () => {
    const [currentWeek, setCurrentWeek] = useState(dayjs());
    const [attendanceData, setAttendanceData] = useState<{ attendanceDate: string;[key: string]: any }[]>([]);
    const [loading, setLoading] = useState(false);
    const user = useSelector(selectUser);

    const weekStart = currentWeek.startOf("week");
    const weekEnd = currentWeek.endOf("week");

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));
    }, [weekStart]);

    const fetchUserAttendance = async () => {
        setLoading(true);

        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const response = await getAttendance({
                userId: user?._id || "",
                startDate: weekStart.format("YYYY-MM-DD"),
                endDate: weekEnd.format("YYYY-MM-DD"),
                timeZone
            });

            if (response?.success) {
                setAttendanceData(response?.attendance)
            } else {
                showMessage({
                    message: "No attendance records found",
                    type: "info",
                    duration: 3000,
                });
            }

        } catch (error) {
            showMessage({
                message: "Error fetching  attendance data",
                description: "Unable to retrieve attendance information. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserAttendance();
    }, [currentWeek]);

    const mergedData = weekDays.map((date) => {
        const formattedDate = date.format("YYYY-MM-DD");

        const existing = attendanceData.find(
            (item) =>
                item.clockInTime &&
                dayjs(item.clockInTime).format("YYYY-MM-DD") === formattedDate
        );

        if (existing) {
            return {
                id: existing._id,
                date: formattedDate,
                clockIn: existing.clockInTime
                    ? dayjs(existing.clockInTime).format("hh:mm A")
                    : "--",
                clockOut: existing.clockOutTime
                    ? dayjs(existing.clockOutTime).format("hh:mm A")
                    : "--",
                location: existing.location
                    ? `${existing.location.latitude}, ${existing.location.longitude}`
                    : "--",
                place: existing.place || "--",
                grossHours: existing.grossHours || "--",
                arrival: existing.arrival || "--",
            };
        }

        return {
            id: formattedDate,
            date: formattedDate,
            clockIn: "--",
            clockOut: "--",
            location: "--",
            place: "--",
            grossHours: "--",
            arrival: "--",
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.weekHeader}>
                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => setCurrentWeek(currentWeek.subtract(1, "week"))}
                >
                    <Icon name="chevron-left" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.weekText}>
                    {weekStart.format("MMM DD")} - {weekEnd.format("MMM DD")}
                </Text>

                <TouchableOpacity
                    style={styles.navButton}
                    onPress={() => setCurrentWeek(currentWeek.add(1, "week"))}
                >
                    <Icon name="chevron-right" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#4c669f" />
                </View>
            ) : (
                <FlatList
                    data={mergedData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <AttendanceCard item={item} />}
                    contentContainerStyle={{ padding: 15 }}
                />
            )}

        </View>
    );
};

export default AttendanceScreen;