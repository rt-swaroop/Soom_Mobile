import React, { useState, useMemo } from "react";

import { View, FlatList, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

import { styles } from "./Attendance.styles";
import AttendanceCard from "./components/AttendanceCard";

dayjs.extend(isoWeek);

const attendanceData = [
    {
        id: "1",
        date: "2025-08-30",
        clockIn: "09:00 AM",
        clockOut: "06:00 PM",
        location: "Hyderabad",
        place: "Work From Office",
        grossHours: "8h 0m",
        arrival: "On Time",
    },
    {
        id: "2",
        date: "2025-08-29",
        clockIn: "09:15 AM",
        clockOut: "06:05 PM",
        location: "Hyderabad",
        place: "Work From Home",
        grossHours: "7h 50m",
        arrival: "Late",
    },
    {
        id: "3",
        date: "2025-08-28",
        clockIn: "09:30 AM",
        clockOut: "06:15 PM",
        location: "Hyderabad",
        place: "Work From Home",
        grossHours: "7h 45m",
        arrival: "Late",
    },
    {
        id: "4",
        date: "2025-08-27",
        clockIn: "09:05 AM",
        clockOut: "06:00 PM",
        location: "Hyderabad",
        place: "Work From Office",
        grossHours: "8h 10m",
        arrival: "On Time",
    },
];

const AttendanceScreen = () => {
    const [currentWeek, setCurrentWeek] = useState(dayjs());

    const weekStart = currentWeek.startOf("week");
    const weekEnd = currentWeek.endOf("week");

    const filteredData = useMemo(() => {
        return attendanceData.filter((item) => {
            const itemDate = dayjs(item.date);
            return itemDate.isAfter(weekStart.subtract(1, "day")) && itemDate.isBefore(weekEnd.add(1, "day"));
        });
    }, [currentWeek]);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const date = weekStart.add(i, "day");
            return date;
        });
    }, [weekStart]);

    const mergedData = weekDays.map((date) => {
        const formattedDate = date.format("YYYY-MM-DD");
        const existing = attendanceData.find((item) => item.date === formattedDate);

        if (existing) {
            return existing;
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

            <FlatList
                data={mergedData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <AttendanceCard item={item} />}
                contentContainerStyle={{ padding: 15 }}
            />

        </View>
    );
};

export default AttendanceScreen;