import React, { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import Geocoder from 'react-native-geocoding';

import { COLORS } from "../../../../theme/colors";
import { createStyles } from "../Attendance.styles";
import { useAppTheme } from "../../../../theme/useAppTheme";

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
    isHoliday?: boolean;
    holidayTitle?: string | null;
}

const AttendanceCard: React.FC<{ item: AttendanceCardProps }> = ({ item }) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [mapVisible, setMapVisible] = useState(false);

    const isEarlyOrOnTime =
        (item.arrival && (item.arrival.includes("Early") || item.arrival === "On time")) || false;

    const arrivalColor = isEarlyOrOnTime ? '#10B981' : '#EF4444';
    const isHoliday = item.isHoliday || false;
    const isEmpty = item.clockIn === "--";

    const clockInLoc = item.clockInLocation;
    const clockOutLoc = item.clockOutLocation;

    const headerColors = isHoliday
        ? ["#FF6B6B", "#EE5253"]
        : [COLORS.primary, COLORS.primaryDark];

    return (
        <View style={styles.card}>
            <LinearGradient
                colors={headerColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cardHeader}
            >
                <View style={styles.dateContainer}>
                    <View style={styles.dateIconWrapper}>
                        <Icon name={isHoliday ? "calendar-star" : "calendar-clock"} size={20} color="#FFF" />
                    </View>
                    <Text style={styles.dateText}>{item.date}</Text>
                </View>

                {isHoliday ? (
                    <View style={styles.arrivalBadge}>
                        <Text style={styles.arrivalText}>Public Holiday</Text>
                    </View>
                ) : !isEmpty ? (
                    <View style={[styles.arrivalBadge, { backgroundColor: isEarlyOrOnTime ? 'rgba(0,128,128,0.3)' : 'rgba(107,75,135,0.4)' }]}>
                        <Text style={styles.arrivalText}>
                            {item.arrival} {!isEarlyOrOnTime}
                        </Text>
                    </View>
                ) : null}
            </LinearGradient>

            <View style={styles.cardBody}>
                {isHoliday ? (
                    <View style={styles.holidayContainer}>
                        <View style={styles.holidayIconWrapper}>
                            <Icon name="party-popper" size={32} color="#FF6B6B" />
                        </View>
                        <Text style={styles.holidayTitle}>{item.holidayTitle || "Public Holiday"}</Text>
                        <Text style={styles.holidayText}>Enjoy your day off! No attendance required for this date.</Text>
                    </View>
                ) : (
                    <>
                        <View style={styles.timeRow}>
                            <View style={styles.timeBox}>
                                <View style={styles.timeLabelRow}>
                                    <Icon name="login" size={16} color={COLORS.red1} />
                                    <Text style={styles.timeLabel}>Clock In</Text>
                                </View>
                                <Text style={styles.time}>{item.clockIn}</Text>
                            </View>

                            <View style={styles.dividerVertical} />

                            <View style={styles.timeBox}>
                                <View style={styles.timeLabelRow}>
                                    <Icon name="logout" size={16} color={COLORS.red1} />
                                    <Text style={styles.timeLabel}>Clock Out</Text>
                                </View>
                                <Text style={styles.time}>{item.clockOut}</Text>
                            </View>
                        </View>

                        <View style={styles.infoGrid}>
                            <InfoRow
                                icon="office-building-marker"
                                label="Work Place"
                                value={item.place}
                                styles={styles}
                                iconColor={COLORS.white}
                            />

                            {(clockInLoc || clockOutLoc) && (
                                <View style={styles.infoRow}>
                                    <View style={styles.infoLabelGroup}>
                                        <View style={styles.infoIconWrapper}>
                                            <Icon name="map-marker-radius" size={18} color={COLORS.white} />
                                        </View>
                                        <Text style={styles.infoLabel}>Location</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => setMapVisible(true)}>
                                        <Text style={styles.mapLink}>View on Map</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {item.grossHours !== "--" && (
                                <InfoRow
                                    icon="clock-check-outline"
                                    label="Total Hours"
                                    value={item.grossHours}
                                    styles={styles}
                                    iconColor={COLORS.white}
                                />
                            )}
                        </View>
                    </>
                )}
            </View>

            <Modal visible={mapVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Attendance Route</Text>
                        </View>

                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: clockInLoc?.latitude || 20.5937,
                                longitude: clockInLoc?.longitude || 78.9629,
                                latitudeDelta: 0.05,
                                longitudeDelta: 0.05,
                            }}
                            userInterfaceStyle={theme.text === '#FFFFFF' ? 'dark' : 'light'}
                        >
                            {clockInLoc && (
                                <Marker coordinate={clockInLoc} title="Clock-In">
                                    <View style={{ backgroundColor: '#10B981', padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' }}>
                                        <Icon name="clock-in" size={16} color="#FFF" />
                                    </View>
                                </Marker>
                            )}
                            {clockOutLoc && (
                                <Marker coordinate={clockOutLoc} title="Clock-Out">
                                    <View style={{ backgroundColor: '#EF4444', padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' }}>
                                        <Icon name="clock-out" size={16} color="#FFF" />
                                    </View>
                                </Marker>
                            )}
                            {clockInLoc && clockOutLoc && (
                                <MapViewDirections
                                    origin={clockInLoc}
                                    destination={clockOutLoc}
                                    apikey={GOOGLE_MAPS_APIKEY}
                                    strokeWidth={4}
                                    strokeColor={COLORS.primary}
                                />
                            )}
                        </MapView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setMapVisible(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.closeButtonText}>DISMISS MAP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const InfoRow = ({ icon, label, value, styles, iconColor }: any) => (
    <View style={styles.infoRow}>
        <View style={styles.infoLabelGroup}>
            <View style={styles.infoIconWrapper}>
                <Icon name={icon} size={16} color={COLORS.white} />
            </View>
            <Text style={styles.infoLabel}>{label}</Text>
        </View>
        <Text style={styles.infoValue}>{value}</Text>
    </View>
);

export default AttendanceCard;