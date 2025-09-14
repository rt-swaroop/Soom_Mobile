import React, { useState } from "react";

import { View, Text, TouchableOpacity, Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from 'react-native-geocoding';

import { COLORS } from "../../../theme/colors";
import { styles } from "../Attendance.styles";

const GOOGLE_MAPS_APIKEY = "AIzaSyAT2Au6vHqZt3x7pMpvhXl0yYgkz3ekpKo";
Geocoder.init(GOOGLE_MAPS_APIKEY);

interface AttendanceCardProps {
    date: string;
    clockIn: string;
    clockOut: string;
    place: string;
    grossHours: string;
    arrival: string;
    clockOutLocation: { latitude: number; longitude: number } | null;
    clockInLocation: { latitude: number; longitude: number } | null;
}

const AttendanceCard: React.FC<{ item: AttendanceCardProps }> = ({ item }) => {

    const [mapVisible, setMapVisible] = useState(false);

    const isEarlyOrOnTime =
        item.arrival.includes("Early") || item.arrival === "On time";

    const arrivalColor = isEarlyOrOnTime ? COLORS.green1 : COLORS.red1;
    const placeIcon = item.place === "Office Clock-in" ? "office-building" : "home";
    const isEmpty = item.clockIn === "--";

    const clockInLoc = item.clockInLocation;
    const clockOutLoc = item.clockOutLocation;

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
                <TouchableOpacity onPress={() => setMapVisible(true)}>
                    <Row icon="map-marker-outline" label="Location"
                        value={
                            clockInLoc || clockOutLoc
                                ? "View on Map"
                                : "--"
                        }
                        valueStyle={{ color: COLORS.primaryDark }}
                    />
                </TouchableOpacity>
                <Row icon="timer-outline" label="Gross Hours" value={item.grossHours} />
            </View>

            <Modal visible={mapVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Attendance Location</Text>

                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: clockInLoc?.latitude || 20.5937,
                                longitude: clockInLoc?.longitude || 78.9629,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                            zoomEnabled={true}
                            zoomControlEnabled={true}
                            scrollEnabled={true}
                            showsCompass={true}
                            showsScale={true}
                        >
                            {clockInLoc && (
                                <Marker
                                    coordinate={clockInLoc}
                                    title="Clock-In Location"
                                    pinColor="green"
                                />
                            )}
                            {clockOutLoc && (
                                <Marker
                                    coordinate={clockOutLoc}
                                    title="Clock-Out Location"
                                    pinColor="red"
                                />
                            )}
                            {clockInLoc && clockOutLoc && (
                                <MapViewDirections
                                    origin={clockInLoc}
                                    destination={clockOutLoc}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={4}
                                    strokeColor="blue"
                                />
                            )}
                        </MapView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setMapVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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