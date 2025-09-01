import React from "react";

import { View, Text } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { COLORS } from "../../../theme/colors";
import { styles } from "../Attendance.styles";

interface AttendanceCardProps {
    date: string;
    clockIn: string;
    clockOut: string;
    location: string;
    place: string;
    grossHours: string;
    arrival: string;
}

const AttendanceCard: React.FC<{ item: AttendanceCardProps }> = ({ item }) => {

    const isEarlyOrOnTime =
        item.arrival.includes("Early") || item.arrival === "On time";

    const arrivalColor = isEarlyOrOnTime ? COLORS.green1 : COLORS.red1;

    const placeIcon = item.place === "Office Clock-in" ? "office-building" : "home";

    const isEmpty = item.clockIn === "--";

    return (
        <View style={styles.card}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.cardHeader}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    {!isEmpty && <Icon name={placeIcon} size={22} color={COLORS.white} style={{ marginLeft: 8 }} />}
                </View>

                <View style={[styles.arrivalBadge, { backgroundColor: arrivalColor }]}>
                    <Text style={styles.arrivalText}>{item.arrival}</Text>
                </View>
            </LinearGradient>

            <View style={styles.cardBody}>
                <View style={styles.timeRow}>
                    <View style={styles.timeBox}>
                        <Text style={styles.time}>{item.clockIn}</Text>
                        <Text style={styles.timeLabel}>IN</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.timeBox}>
                        <Text style={styles.time}>{item.clockOut}</Text>
                        <Text style={styles.timeLabel}>OUT</Text>
                    </View>
                </View>

                <Row icon="map-marker-outline" label="Location" value={item.location} />
                <Row icon="timer-outline" label="Gross Hours" value={item.grossHours} />
            </View>
        </View>
    );
};

const Row = ({ icon, label, value, valueStyle = {} }: any) => (
    <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name={icon} size={18} color={COLORS.primaryDark} style={{ marginRight: 6 }} />
            <Text style={styles.label}>{label}</Text>
        </View>
        <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
);

export default AttendanceCard;