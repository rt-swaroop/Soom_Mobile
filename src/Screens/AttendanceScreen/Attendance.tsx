import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AttendanceScreen = () => (
    <View style={styles.container}>
        <Text>Attendance Screen</Text>
    </View>
);

export default AttendanceScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
});