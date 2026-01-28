import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useSelector } from "react-redux";

import { ActivityIndicator, Text, TouchableOpacity, View, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import Modal from "react-native-modal";
import { showMessage } from 'react-native-flash-message';
import Geolocation from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";
import { RESULTS } from "react-native-permissions";

import dayjs from 'dayjs';

import { createStyles } from '../Home.styles';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { COLORS } from '../../../../theme/colors';

import { selectUser } from "../../../../redux/selector";
import { getAttendance, postAttendance } from '../../../../services/attendanceServices'
import { permissionService } from '../../../../services/PermissionService';

import AttendanceSkeleton from '../../../../components/Skeleton/AttendanceSkeleton';

const GOOGLE_MAPS_APIKEY = "AIzaSyAT2Au6vHqZt3x7pMpvhXl0yYgkz3ekpKo";
Geocoder.init(GOOGLE_MAPS_APIKEY);

type MarkAttendanceProps = { refreshKey?: number }

const MarkAttendance = ({ refreshKey }: MarkAttendanceProps) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState<any>('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>("Fetching location...");

    const [isPlaceModalVisible, setPlaceModalVisible] = useState(false);
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
    const [locationErrorType, setLocationErrorType] = useState<"permission" | "service" | null>(null);

    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [locationLoading, setLocationLoading] = useState(true);

    const user = useSelector(selectUser);

    useEffect(() => {
        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCurrentDayAttendance();
        }, [])
    );

    useEffect(() => {
        if (typeof refreshKey === 'number') {
            fetchCurrentDayAttendance();
        }
    }, [refreshKey]);

    const checkAndFetchLocation = async (): Promise<boolean> => {
        setLocationLoading(true);
        try {
            const result = await permissionService.checkLocationPermission();

            if (result === RESULTS.GRANTED) {
                return await fetchLocation();
            } else {
                const requestResult = await permissionService.requestLocationPermission();
                if (requestResult === RESULTS.GRANTED) {
                    return await fetchLocation();
                } else {
                    setLocationErrorType("permission");
                    setAddress("Location permission denied");
                    setLocationLoading(false);
                    return false;
                }
            }
        } catch (err) {
            console.error("Error checking/requesting location permission:", err);
            setLocationErrorType("permission");
            setAddress("Error checking permissions ❌");
            setLocationLoading(false);
            return false;
        }
    };

    const fetchLocation = async (): Promise<boolean> => {
        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const latitude = position?.coords?.latitude;
                        const longitude = position?.coords?.longitude;
                        setLocation({ latitude, longitude });

                        try {
                            const geoResponse = await Geocoder.from(latitude, longitude);
                            if (geoResponse.results.length > 0) {
                                setAddress(geoResponse.results[0].formatted_address);
                            } else {
                                setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
                            }
                        } catch (geoError) {
                            console.error("Error in reverse geocoding:", geoError);
                            setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
                        }
                        setLocationLoading(false);
                        resolve(true);
                    } catch (innerErr) {
                        console.error("Error handling location data:", innerErr);
                        setAddress("Error handling location data ❌");
                        setLocationLoading(false);
                        resolve(true);
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setAddress("Error getting location ❌");
                    setLocation(null);
                    setLocationLoading(false);
                    if (error.code === 1) {
                        setLocationErrorType("permission");
                    } else {
                        setLocationErrorType("service");
                    }
                    resolve(false);
                },
                {
                    accuracy: { android: 'high', ios: 'best' },
                    forceRequestLocation: true,
                    showLocationDialog: true,
                    forceLocationManager: true,
                }
            );
        });
    };

    useEffect(() => {
        checkAndFetchLocation();
    }, []);

    const fetchCurrentDayAttendance = async () => {
        setDataLoading(true);
        const currentDay = dayjs();
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const response = await getAttendance({
                userId: user?._id || "",
                subscriberId: user?.companyId?._id || "",
                startDate: currentDay.format("YYYY-MM-DD"),
                endDate: currentDay.format("YYYY-MM-DD"),
                timeZone
            });
            setCurrentAttendanceStatus(response?.attendance[0])
        } catch (error) {
            console.log("error", error)
            showMessage({
                message: "Error fetching attendance data",
                description: "Unable to retrieve attendance information. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setDataLoading(false)
        }
    }

    const updateDateTime = () => {
        const now = dayjs();
        setCurrentTime(now.format('hh:mm:ss A'));
        setCurrentDate(now.format('dddd, MMMM D, YYYY'));
    };

    const handleClockInOut = async () => {
        if (loading) return;
        const isLocationAvailable = await checkAndFetchLocation();
        if (!isLocationAvailable) return;

        if (!currentAttendanceStatus?.attendanceStatus || currentAttendanceStatus?.attendanceStatus === "Clock-in") {
            setPlaceModalVisible(true);
        } else {
            setConfirmModalVisible(true);
        }
    };

    const confirmPlaceSelection = async (selectedPlace: "wfh" | "office") => {
        setPlaceModalVisible(false);
        setLoading(true);
        try {
            const currentDateTime = new Date().toISOString();
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const formattedTime = dayjs(currentDateTime).format("hh:mm A");

            const data = {
                attendanceStatus: "Clock-in",
                place: selectedPlace === "wfh" ? "Work From Home" : "Office",
                time: currentDateTime,
                timeZone,
                location
            };

            await postAttendance(data, user?._id);

            showMessage({
                message: "Clock-in Successful",
                description: `You clocked in from ${data.place} at ${formattedTime}`,
                type: "success",
                duration: 3000,
            });

        } catch (error: any) {
            console.error("Error in Clock-in:", error);
            showMessage({
                message: "Clock-in Failed",
                description: error?.response?.data?.message || error?.message || "Something went wrong while clocking in.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
            fetchCurrentDayAttendance();
        }
    };

    const confirmClockOut = async () => {
        setConfirmModalVisible(false);
        setLoading(true);
        try {
            const currentDateTime = new Date().toISOString();
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const formattedTime = dayjs(currentDateTime).format("hh:mm A");

            const data = {
                attendanceStatus: "Clock-out",
                place: currentAttendanceStatus?.place || "Office",
                time: currentDateTime,
                timeZone,
                location
            };

            await postAttendance(data, user?._id);

            showMessage({
                message: "Clock-out Successful",
                description: `You clocked out at ${formattedTime}`,
                type: "success",
                duration: 3000,
            });

        } catch (error) {
            console.error("Error in Clock-out:", error);
            showMessage({
                message: "Clock-out Failed",
                description: "Something went wrong while clocking out.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false);
            fetchCurrentDayAttendance()
        }
    };

    const gradientColors =
        currentAttendanceStatus?.attendanceStatus === 'Clock-out'
            ? ['#ff0000', '#ff9999']
            : ['#4c669f', '#3b5998', '#192f6a'];

    let clockInTime = "--:--";
    let clockOutTime = "--:--";
    let duration = "--:--";

    if (currentAttendanceStatus?.clockInTime) {
        clockInTime = dayjs(currentAttendanceStatus.clockInTime).format("hh:mm A");
        if (currentAttendanceStatus?.clockOutTime) {
            clockOutTime = dayjs(currentAttendanceStatus.clockOutTime).format("hh:mm A");
            duration = currentAttendanceStatus.grossHours;
        }
    }

    return (
        <>
            {dataLoading ? (
                <AttendanceSkeleton />
            ) : (
                <View style={styles.attendanceCard}>
                    <Text style={styles.timeText}>{currentTime}</Text>
                    <Text style={styles.dateText}>{currentDate}</Text>
                    <LinearGradient colors={gradientColors} style={styles.attendanceButtonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.attendanceButton,
                                (loading || locationLoading) && { opacity: 0.6 },
                            ]}
                            onPress={handleClockInOut}
                            disabled={loading || locationLoading}
                        >
                            {loading ? (
                                <ActivityIndicator size="large" color="#fff" />
                            ) : (
                                <>
                                    {locationLoading ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Icon name="hand-right-outline" size={40} color="white" />
                                    )}
                                    <Text style={styles.attendanceButtonText}>
                                        {currentAttendanceStatus?.attendanceStatus || 'Clock-in'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={styles.locationItem}>
                        <Text style={styles.locationText}>Location: {address}</Text>
                    </View>
                    <View style={styles.dashedLine}></View>
                    <View style={styles.summaryContainer}>
                        <View style={styles.actionItem}>
                            <Icon name="log-in-outline" size={30} color="#999" />
                            <Text style={styles.actionLabel}>{clockInTime}</Text>
                            <Text style={styles.actionText}>Clock in</Text>
                        </View>
                        <View style={styles.actionItem}>
                            <Icon name="log-out-outline" size={30} color="#999" />
                            <Text style={styles.actionLabel}>{clockOutTime}</Text>
                            <Text style={styles.actionText}>Clock out</Text>
                        </View>
                        <View style={styles.actionItem}>
                            <Icon name="time-outline" size={30} color="#999" />
                            <Text style={styles.actionLabel}>{duration}</Text>
                            <Text style={styles.actionText}>Total hrs</Text>
                        </View>
                    </View>
                </View>
            )}

            <Modal
                isVisible={isPlaceModalVisible}
                onBackdropPress={() => setPlaceModalVisible(false)}
                animationIn="fadeInUp"
                animationOut="fadeOutDown"
            >
                <View style={{ backgroundColor: theme.cardBg || "white", padding: 24, borderRadius: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 24, textAlign: "center", color: theme.text || "#222" }}>
                        Choose Your Work Location
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: theme.inputBg || "#f5f6fa",
                                width: "40%",
                            }}
                            onPress={() => confirmPlaceSelection("office")}
                        >
                            <Icon name="business-outline" size={36} color="#4c669f" />
                            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", color: "#4c669f" }}>Office</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: theme.inputBg || "#f5f6fa",
                                width: "40%",
                            }}
                            onPress={() => confirmPlaceSelection("wfh")}
                        >
                            <Icon name="home-outline" size={36} color="#3b5998" />
                            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", color: "#3b5998" }}>Work From Home</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginTop: 24,
                            padding: 14,
                            borderRadius: 10,
                            backgroundColor: theme.inputBg || "#eee",
                        }}
                        onPress={() => setPlaceModalVisible(false)}
                    >
                        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", color: theme.textSecondary || "#444" }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                isVisible={isConfirmModalVisible}
                onBackdropPress={() => setConfirmModalVisible(false)}
                animationIn="fadeInUp"
                animationOut="fadeOutDown"
            >
                <View style={{ backgroundColor: theme.cardBg || "white", padding: 24, borderRadius: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20, color: theme.text || '#000' }}>
                        Are you sure you want to Clock-out?
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity
                            style={{
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: "#ff4d4d",
                                width: "40%",
                            }}
                            onPress={confirmClockOut}
                        >
                            <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                padding: 12,
                                borderRadius: 8,
                                backgroundColor: theme.inputBg || "#ddd",
                                width: "40%",
                            }}
                            onPress={() => setConfirmModalVisible(false)}
                        >
                            <Text style={{ color: theme.textSecondary || "#333", textAlign: "center", fontWeight: "600" }}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal
                isVisible={!!locationErrorType}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.5}
            >
                <View style={{ backgroundColor: theme.cardBg || "white", padding: 24, borderRadius: 16, alignItems: 'center' }}>
                    <Icon name={locationErrorType === "permission" ? "lock-closed-outline" : "location-off-outline"} size={50} color={COLORS.red1} />
                    <Text style={{ fontSize: 20, fontWeight: "700", marginVertical: 16, textAlign: "center", color: theme.text || "#222" }}>
                        {locationErrorType === "permission" ? "Permission Denied" : "Location Disabled"}
                    </Text>
                    <Text style={{ fontSize: 16, color: theme.textSecondary || "#666", textAlign: "center", marginBottom: 24, lineHeight: 22 }}>
                        {locationErrorType === "permission"
                            ? "Please go to settings and allow location access for this app to mark attendance."
                            : "Your device location is turned off. Please enable GPS/Location services to continue."}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "space-around", width: '100%' }}>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 12,
                                backgroundColor: theme.inputBg || "#f5f6fa",
                                marginRight: 10,
                                alignItems: 'center'
                            }}
                            onPress={() => Linking.openSettings()}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.text || "#444" }}>Open Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                padding: 14,
                                borderRadius: 12,
                                backgroundColor: COLORS.primary,
                                marginLeft: 10,
                                alignItems: 'center'
                            }}
                            onPress={() => {
                                setLocationErrorType(null);
                                checkAndFetchLocation();
                            }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: "600", color: "white" }}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default MarkAttendance;