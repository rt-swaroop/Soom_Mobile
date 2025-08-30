import React from "react";

import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import LinearGradient from "react-native-linear-gradient";

import { styles } from "./Profile.styles";
import { COLORS } from "../../theme/colors";
import CollapsibleSection from "./components/CollapsibleSection";

const ProfileScreen = () => {
    return (
        <ScrollView style={styles.container}>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
                <Image source={{ uri: "https://i.pravatar.cc/300" }} style={styles.profilePic} />
                <Text style={styles.name}>Sai Swaroop</Text>
                <Text style={styles.email}>sai.swaroop@example.com</Text>
            </LinearGradient>

            <CollapsibleSection title="Personal Information">
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Phone</Text>
                    <Text style={styles.infoValue}>+91 9876543210</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoValue}>Hyderabad, India</Text>
                </View>
            </CollapsibleSection>

            <CollapsibleSection title="Work Information">
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Employee ID</Text>
                    <Text style={styles.infoValue}>EMP12345</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Role</Text>
                    <Text style={styles.infoValue}>Field Engineer</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Department</Text>
                    <Text style={styles.infoValue}>Operations</Text>
                </View>
            </CollapsibleSection>

            <View style={styles.section}>
                <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionText}>Change Password</Text>
                    <Icon name="chevron-right" size={24} color={COLORS.gray} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRow}>
                    <Text style={styles.optionText}>Settings</Text>
                    <Icon name="chevron-right" size={24} color={COLORS.gray} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ProfileScreen;