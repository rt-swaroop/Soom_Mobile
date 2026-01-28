import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import { View, Text, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

import { createStyles } from "../Profile.styles";
import { COLORS } from "../../../theme/colors";
import { selectUser } from '../../../redux/selector';
import { useAppTheme } from "../../../theme/useAppTheme";

import CollapsibleSection from "../../../components/CollapsibleSection/CollapsibleSection";

const ProfileDetailsScreen = () => {
    const navigation = useNavigation();
    const { theme, isDark } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [personalExpanded, setPersonalExpanded] = useState(false);
    const [workExpanded, setWorkExpanded] = useState(false);

    const user = useSelector(selectUser);

    const InfoRow = ({ icon, label, value, showDivider = true }: any) => (
        <View>
            <View style={styles.infoRow}>
                <View style={styles.infoIconWrapper}>
                    <Icon name={icon} size={20} color={COLORS.primary} />
                </View>
                <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={styles.infoValue}>{value || "---"}</Text>
                </View>
            </View>
            {showDivider && <View style={styles.divider} />}
        </View>
    );

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    const bgSecondary = theme.text === '#FFFFFF' ? '#111827' : '#F5F7FA';

    return (
        <View style={[styles.container, { backgroundColor: bgSecondary }]}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={{ height: 110, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                <LinearGradient
                    colors={[COLORS.primary, COLORS.primaryDark]}
                    style={{
                        flex: 1,
                        borderBottomLeftRadius: 30,
                        borderBottomRightRadius: 30,
                        paddingHorizontal: 24,
                        paddingTop: 52,
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <Icon name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700', marginLeft: 16 }}>Profile Details</Text>
                    </View>
                </LinearGradient>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, { paddingTop: 125 }]}
            >
                <CollapsibleSection
                    title="Personal Information"
                    icon="person"
                    expanded={personalExpanded}
                    onToggle={() => setPersonalExpanded(!personalExpanded)}
                >
                    <View style={styles.infoGrid}>
                        <InfoRow icon="phone-android" label="MOBILE" value={user?.mobileNumber} />
                        <InfoRow icon="alternate-email" label="PERSONAL EMAIL" value={user?.personalEmail} />
                        <InfoRow icon="cake" label="BIRTH DATE" value={formatDate(user?.userInformation?.dateOfBirth)} />
                        <InfoRow icon="opacity" label="BLOOD GROUP" value={user?.userInformation?.bloodGroup} />
                        <InfoRow icon="location-on" label="ADDRESS" value={`${user?.userInformation?.city ?? ''}, ${user?.userInformation?.state ?? ''}`} showDivider={false} />
                    </View>
                </CollapsibleSection>

                <CollapsibleSection
                    title="Professional Profile"
                    icon="business-center"
                    expanded={workExpanded}
                    onToggle={() => setWorkExpanded(!workExpanded)}
                >
                    <View style={styles.infoGrid}>
                        <InfoRow icon="badge" label="EMPLOYEE ID" value={user?.officeInformation?.employeeCode} />
                        <InfoRow icon="work-outline" label="DESIGNATION" value={user?.officeInformation?.jobTitle} />
                        <InfoRow icon="business" label="DEPARTMENT" value={user?.department?.name} />
                        <InfoRow icon="event-available" label="JOINING DATE" value={formatDate(user?.officeInformation?.hireDate)} />
                        <InfoRow icon="map" label="OFFICE LOCATION" value={user?.officeInformation?.location?.name} />
                        <InfoRow icon="schedule" label="SHIFT TYPE" value={user?.officeInformation?.shiftData?.name} showDivider={false} />
                    </View>
                </CollapsibleSection>
            </ScrollView>
        </View>
    );
};

export default ProfileDetailsScreen;
