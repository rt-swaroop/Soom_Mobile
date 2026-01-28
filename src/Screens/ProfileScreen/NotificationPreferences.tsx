import React, { useState, useEffect } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../theme/useAppTheme';
import { COLORS } from '../../theme/colors';

import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationPreferences = () => {
    const navigation = useNavigation();
    const { theme } = useAppTheme();

    const [preferences, setPreferences] = useState({
        master: true,
        shifts: true,
        leaves: true,
        meetings: false,
        announcements: true,
        appUpdates: false,
    });

    useEffect(() => {
        const loadPreferences = async () => {
            const saved = await AsyncStorage.getItem('notification_preferences');
            if (saved) {
                setPreferences(JSON.parse(saved));
            }
        };
        loadPreferences();
    }, []);

    const togglePreference = async (key: keyof typeof preferences) => {
        const newPrefs = {
            ...preferences,
            [key]: !preferences[key]
        };
        setPreferences(newPrefs);
        await AsyncStorage.setItem('notification_preferences', JSON.stringify(newPrefs));
    };

    const PreferenceItem = ({ icon, title, description, value, onToggle, isLast = false }: any) => (
        <View style={[styles.preferenceItem, !isLast && { borderBottomWidth: 1, borderBottomColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
            <View style={styles.iconWrapper}>
                <Icon name={icon} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.textWrapper}>
                <Text style={[styles.preferenceTitle, { color: theme.text }]}>{title}</Text>
                <Text style={[styles.preferenceDesc, { color: theme.textSecondary }]}>{description}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#767577', true: COLORS.primary + '80' }}
                thumbColor={value ? COLORS.primary : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, { backgroundColor: theme.inputBg || 'rgba(0,0,0,0.05)' }]}
                >
                    <Icon name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Notification Preference</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={{ height: 10 }} />
                <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
                    <PreferenceItem
                        icon="notifications-active"
                        title="Allow Notifications"
                        description="Receive push notifications from the app"
                        value={preferences.master}
                        onToggle={() => togglePreference('master')}
                    />
                </View>

                {/* {preferences.master && (
                    <>
                        <Text style={styles.sectionHeader}>ACTIVITY UPDATES</Text>
                        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
                            <PreferenceItem
                                icon="schedule"
                                title="Shift Changes"
                                description="Get alerts about new shifts or changes"
                                value={preferences.shifts}
                                onToggle={() => togglePreference('shifts')}
                            />
                            <PreferenceItem
                                icon="event-available"
                                title="Leave Status"
                                description="Updates on your leave request approvals"
                                value={preferences.leaves}
                                onToggle={() => togglePreference('leaves')}
                            />
                            <PreferenceItem
                                icon="groups"
                                title="Meetings"
                                description="New meeting invites and reminders"
                                value={preferences.meetings}
                                onToggle={() => togglePreference('meetings')}
                                isLast={true}
                            />
                        </View>

                        <Text style={styles.sectionHeader}>COMMUNICATION</Text>
                        <View style={[styles.section, { backgroundColor: theme.cardBg }]}>
                            <PreferenceItem
                                icon="campaign"
                                title="Announcements"
                                description="Important company-wide broadcasts"
                                value={preferences.announcements}
                                onToggle={() => togglePreference('announcements')}
                            />
                            <PreferenceItem
                                icon="update"
                                title="App Updates"
                                description="Learn about new features and improvements"
                                value={preferences.appUpdates}
                                onToggle={() => togglePreference('appUpdates')}
                                isLast={true}
                            />
                        </View>
                    </>
                )} */}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 10,
        paddingBottom: 40,
    },
    section: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    sectionHeader: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
        marginLeft: 4,
        marginBottom: 10,
        marginTop: 10,
        letterSpacing: 1,
    },
    preferenceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textWrapper: {
        flex: 1,
    },
    preferenceTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    preferenceDesc: {
        fontSize: 13,
    },
});

export default NotificationPreferences;
