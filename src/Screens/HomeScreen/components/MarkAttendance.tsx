import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from "react-redux";

import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import Modal from "react-native-modal";
import { showMessage } from 'react-native-flash-message';
import Geolocation from "react-native-geolocation-service";
import Geocoder from "react-native-geocoding";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

import dayjs from 'dayjs';

import { styles } from '../Home.styles';

import { selectUser } from "../../../redux/selector";
import { getAttendance, postAttendance } from '../../../services/attendanceServices'

const GOOGLE_MAPS_APIKEY = "AIzaSyA-hxwx7biBRPetUIyWblqOQosZ3Y7VrKE";
Geocoder.init(GOOGLE_MAPS_APIKEY);

const MarkAttendance = () => {
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [currentAttendanceStatus, setCurrentAttendanceStatus] = useState<any>('');
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [address, setAddress] = useState<string>("Fetching location...");

    const [isPlaceModalVisible, setPlaceModalVisible] = useState(false);
    const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);

    const [loading, setLoading] = useState(false);

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
        const getLocation = async () => {
            try {
                let permission;

                if (Platform.OS === "android") {
                    permission = PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
                } else {
                    permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
                }

                const result = await check(permission);

                if (result === RESULTS.GRANTED) {
                    fetchLocation();
                } else {
                    const requestResult = await request(permission);

                    if (requestResult === RESULTS.GRANTED) {
                        fetchLocation();
                    } else {
                        showMessage({
                            message: "Permission Denied",
                            description: "Please enable location to use attendance properly.",
                            type: "danger",
                        });
                    }
                }
            } catch (err) {
                console.error("Error checking location permission:", err);
            }
        };

        const fetchLocation = () => {
            Geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ latitude, longitude });

                    try {
                        const geoResponse = await Geocoder.from(latitude, longitude);

                        if (geoResponse.results.length > 0) {
                            const formattedAddress = geoResponse.results[0].formatted_address;
                            setAddress(formattedAddress);
                        } else {
                            setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
                        }
                    } catch (error) {
                        console.error("Error in reverse geocoding:", error);
                        setAddress(`Lat: ${latitude}, Lng: ${longitude}`);
                    }
                },
                (error) => {
                    console.error("Error fetching location:", error);
                    setAddress("Error getting location ❌");
                    setLocation(null);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        };

        getLocation();
    }, []);

    const fetchCurrentDayAttendance = async () => {
        setLoading(true);

        const currentDay = dayjs();

        try {

            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            const response = await getAttendance({
                userId: user?._id || "",
                startDate: currentDay.format("YYYY-MM-DD"),
                endDate: currentDay.format("YYYY-MM-DD"),
                timeZone
            });

            setCurrentAttendanceStatus(response?.attendance[0])

        } catch (error) {
            console.log("error", error)
            showMessage({
                message: "Error fetching  attendance data",
                description: "Unable to retrieve attendance information. Please try again later.",
                type: "danger",
                duration: 3000,
            });
        } finally {
            setLoading(false)
        }
    }

    const updateDateTime = () => {
        const now = dayjs();
        setCurrentTime(now.format('hh:mm:ss A'));
        setCurrentDate(now.format('dddd, MMMM D, YYYY'));
    };

    const handleClockInOut = () => {
        if (loading) return;
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

    let clockInTime = "00:00";
    let clockOutTime = "00:00";
    let duration = "00:00";

    if (currentAttendanceStatus?.clockInTime) {

        clockInTime = currentAttendanceStatus?.clockInTime
            ? dayjs(currentAttendanceStatus.clockInTime).format("hh:mm A")
            : "--:--";

        if (currentAttendanceStatus?.clockOutTime) {
            clockOutTime = dayjs(currentAttendanceStatus.clockOutTime).format("hh:mm A");
            duration = currentAttendanceStatus.grossHours;
        }

    }

    return (
        <>

            <View style={styles.attendanceCard}>
                <Text style={styles.timeText}>{currentTime}</Text>
                <Text style={styles.dateText}>{currentDate}</Text>
                <LinearGradient colors={gradientColors} style={styles.attendanceButtonContainer}>
                    <TouchableOpacity style={styles.attendanceButton} onPress={handleClockInOut}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#fff" />
                        ) : (
                            <>
                                <Icon name="hand-right-outline" size={40} color="white" />
                                <Text style={styles.attendanceButtonText}>
                                    {currentAttendanceStatus?.attendanceStatus || 'Clock-in'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </LinearGradient>
                <View style={styles.locationItem}>
                    {/* <Icon name="location-outline" size={20} color="#999" /> */}
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

            <Modal
                isVisible={isPlaceModalVisible}
                onBackdropPress={() => setPlaceModalVisible(false)}
                animationIn="fadeInUp"
                animationOut="fadeOutDown"
            >
                <View style={{ backgroundColor: "white", padding: 24, borderRadius: 16 }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 24, textAlign: "center", color: "#222" }}>
                        Choose Your Work Location
                    </Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: "#f5f6fa",
                                width: "40%",
                            }}
                            onPress={() => confirmPlaceSelection("office")}
                        >
                            <Icon name="business-outline" size={36} color="#4c669f" />
                            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", color: "#4c669f" }}>
                                Office
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                alignItems: "center",
                                padding: 16,
                                borderRadius: 12,
                                backgroundColor: "#f5f6fa",
                                width: "40%",
                            }}
                            onPress={() => confirmPlaceSelection("wfh")}
                        >
                            <Icon name="home-outline" size={36} color="#3b5998" />
                            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: "600", color: "#3b5998" }}>
                                Work From Home
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={{
                            marginTop: 24,
                            padding: 14,
                            borderRadius: 10,
                            backgroundColor: "#eee",
                        }}
                        onPress={() => setPlaceModalVisible(false)}
                    >
                        <Text style={{ textAlign: "center", fontSize: 16, fontWeight: "500", color: "#444" }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Modal
                isVisible={isConfirmModalVisible}
                onBackdropPress={() => setConfirmModalVisible(false)}
                animationIn="fadeInUp"
                animationOut="fadeOutDown"
            >
                <View style={{ backgroundColor: "white", padding: 24, borderRadius: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", textAlign: "center", marginBottom: 20 }}>
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
                                backgroundColor: "#ddd",
                                width: "40%",
                            }}
                            onPress={() => setConfirmModalVisible(false)}
                        >
                            <Text style={{ color: "#333", textAlign: "center", fontWeight: "600" }}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </>
    );
};

export default MarkAttendance;