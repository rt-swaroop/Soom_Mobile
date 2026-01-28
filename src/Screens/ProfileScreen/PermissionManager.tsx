import React, { useState, useEffect, useCallback } from 'react';

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, AppState, AppStateStatus } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { RESULTS } from 'react-native-permissions';

import { useAppTheme } from '../../theme/useAppTheme';
import { COLORS } from '../../theme/colors';

import { permissionService } from '../../services/PermissionService';

const PermissionManager = () => {
    const navigation = useNavigation();
    const { theme } = useAppTheme();

    const [status, setStatus] = useState<any>({
        location: 'checking',
        notifications: 'checking',
    });

    const checkAllPermissions = useCallback(async () => {
        const [locStatus, notiStatus] = await Promise.all([
            permissionService.checkLocationPermission(),
            permissionService.checkNotificationPermission()
        ]);

        setStatus({
            location: locStatus,
            notifications: notiStatus,
        });
    }, []);

    useEffect(() => {
        checkAllPermissions();

        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active') {
                checkAllPermissions();
            }
        });

        return () => subscription.remove();
    }, [checkAllPermissions]);

    const handleAction = async (type: 'location' | 'notifications') => {
        if (type === 'location') {
            await permissionService.requestLocationPermission();
        } else {
            await permissionService.requestNotificationPermission();
        }
        checkAllPermissions();
    };

    const getStatusConfig = (s: string) => {
        const isGranted = s === 'granted' || s === RESULTS.GRANTED;
        const isDenied = s === 'denied' || s === RESULTS.DENIED || s === RESULTS.BLOCKED;

        if (s === 'checking') return { label: 'Checking...', color: '#94A3B8', bg: '#94A3B820', icon: 'hourglass-empty' };
        if (isGranted) return { label: 'Granted', color: '#10B981', bg: '#10B98120', icon: 'check-circle' };
        if (isDenied) return { label: s === RESULTS.BLOCKED ? 'Blocked' : 'Denied', color: '#EF4444', bg: '#EF444420', icon: 'error' };
        return { label: 'Not Requested', color: '#F59E0B', bg: '#F59E0B20', icon: 'help-center' };
    };

    const PermissionItem = ({ title, description, type, currentStatus, icon }: any) => {
        const config = getStatusConfig(currentStatus);
        const isGranted = currentStatus === 'granted' || currentStatus === RESULTS.GRANTED;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAction(type)}
                style={[styles.card, { backgroundColor: theme.cardBg, borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }]}
            >
                <View style={styles.cardTop}>
                    <View style={[styles.iconWrapper, { backgroundColor: COLORS.primary + '12' }]}>
                        <Icon name={icon} size={28} color={COLORS.primary} />
                    </View>
                    <View style={styles.textWrapper}>
                        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                        <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
                    </View>
                </View>

                {isGranted ? (
                    <View style={styles.grantedRow}>
                        <Icon name="check-circle" size={20} color="#10B981" />
                        <Text style={styles.grantedText}>Permission Granted</Text>
                    </View>
                ) : (
                    <View style={styles.actionRow}>
                        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                            <Icon name={config.icon} size={16} color={config.color} />
                            <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                        </View>
                        <View style={styles.btnAction}>
                            <Text style={styles.btnActionText}>
                                {currentStatus === RESULTS.BLOCKED ? 'Enable in Settings' : 'Allow Access'}
                            </Text>
                            <Icon name="chevron-right" size={18} color="#FFFFFF" />
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

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
                <Text style={[styles.headerTitle, { color: theme.text }]}>Permission Manager</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Device Permissions</Text>
                <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                    Manage the permissions Soom needs to work correctly.
                </Text>

                <PermissionItem
                    title="Location Access"
                    description="Used for accurate clock-in/out tracking and attendance verification."
                    type="location"
                    currentStatus={status.location}
                    icon="location-on"
                />

                <PermissionItem
                    title="Push Notifications"
                    description="Stay updated with shift alerts, leave approvals, and more."
                    type="notifications"
                    currentStatus={status.notifications}
                    icon="notifications"
                />

                <View style={[styles.infoBox, { backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
                    <Icon name="info-outline" size={22} color={COLORS.primary} />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>
                        If a permission is 'Blocked', you'll need to enable it manually in your device system settings to use all features.
                    </Text>
                </View>
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
    sectionTitle: {
        fontSize: 26,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    sectionDesc: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 28,
    },
    card: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textWrapper: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        lineHeight: 19,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 18,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 6,
    },
    btnAction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingLeft: 16,
        paddingRight: 10,
        paddingVertical: 9,
        borderRadius: 12,
    },
    btnActionText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 2,
    },
    grantedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 18,
        paddingTop: 18,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    grantedText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10B981',
        marginLeft: 8,
    },
    infoBox: {
        flexDirection: 'row',
        padding: 18,
        borderRadius: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
        flex: 1,
        marginLeft: 14,
    }
});

export default PermissionManager;
