import React, { useMemo, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, Text, FlatList, StyleSheet, TouchableOpacity, Animated, Dimensions, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import { useAppTheme } from '../../theme/useAppTheme';
import { COLORS } from '../../theme/colors';

import { selectUser, selectNotifications, selectNotificationsLoading } from '../../redux/selector';
import { setNotifications, updateNotificationRead, markAllAsRead, removeNotification, clearAll, setLoading } from '../../redux/reducers/notificationReducer';

import { getNotifications, markNotificationRead, markAllNotificationsRead, clearNotification, clearAllNotifications } from '../../services/notificationServices';

const { width } = Dimensions.get('window');

const NotificationItem = ({ item, index, theme, navigation, onMarkRead, onClear }: any) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                delay: index * 60,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                delay: index * 60,
                useNativeDriver: true,
            }),
        ]).start();
    }, [index]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'shift': return 'time';
            case 'leave': return 'airplane';
            case 'alert': return 'warning';
            case 'meeting': return 'people';
            default: return 'notifications';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'shift': return '#3B5998';
            case 'leave': return '#28A745';
            case 'alert': return '#E53935';
            case 'meeting': return '#9C27B0';
            default: return '#FF9800';
        }
    };

    const iconColor = getColor(item.type);

    const unreadBg = theme.text === '#FFFFFF' ? '#111827' : '#F3F4F6';
    const containerBg = item.read ? theme.cardBg : unreadBg;

    return (
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => onMarkRead(item._id)}
                style={[
                    styles.card,
                    {
                        backgroundColor: containerBg,
                        borderColor: item.read
                            ? (theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)')
                            : COLORS.primary
                    }
                ]}
            >
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: item.read ? (theme.text === '#FFFFFF' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)') : 'transparent' }
                ]}>
                    <Icon name={getIcon(item.type)} size={24} color={iconColor} />
                </View>

                <View style={styles.textContainer}>
                    <View style={styles.headerRow}>
                        <View style={styles.titleBadgeContainer}>
                            <Text style={[
                                styles.title,
                                {
                                    color: theme.text,
                                    fontWeight: item.read ? '600' : '800'
                                }
                            ]} numberOfLines={1}>
                                {item.title}
                            </Text>
                            {!item.read && (
                                <View style={[styles.unreadBadgeInline, { backgroundColor: COLORS.primary }]}>
                                    <Text style={styles.unreadText}>New</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.time}>{item.time}</Text>
                    </View>
                    <Text style={[
                        styles.description,
                        {
                            color: item.read ? theme.textSecondary : theme.text,
                            fontWeight: item.read ? '400' : '600'
                        }
                    ]} numberOfLines={2}>
                        {item.description}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => onClear(item._id)}
                >
                    <Icon name="close-circle-outline" size={20} color={theme.textSecondary} />
                </TouchableOpacity>
            </TouchableOpacity>
        </Animated.View>
    );
};

const Notifications = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { theme } = useAppTheme();

    const user = useSelector(selectUser);
    const notifications = useSelector(selectNotifications);
    const loading = useSelector(selectNotificationsLoading);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        if (!user?._id) return;

        dispatch(setLoading(true));
        try {
            const data = await getNotifications(user._id);
            dispatch(setNotifications(data));
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleMarkRead = async (notificationId: string) => {
        if (!user?._id) return;

        try {
            await markNotificationRead(user._id, notificationId);
            dispatch(updateNotificationRead(notificationId));
        } catch (err) {
            console.error("Failed to mark notification as read:", err);
        }
    };

    const handleMarkAllRead = async () => {
        if (!user?._id) return;

        try {
            await markAllNotificationsRead(user._id);
            dispatch(markAllAsRead());
        } catch (err) {
            console.error("Failed to mark all as read:", err);
        }
    };

    const handleClear = async (notificationId: string) => {
        if (!user?._id) return;

        try {
            await clearNotification(user._id, notificationId);
            dispatch(removeNotification(notificationId));
        } catch (err) {
            console.error("Failed to clear notification:", err);
        }
    };

    const handleClearAll = async () => {
        if (!user?._id) return;

        try {
            await clearAllNotifications(user._id);
            dispatch(clearAll());
        } catch (err) {
            console.error("Failed to clear all notifications:", err);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={theme.text === '#FFFFFF' ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={[styles.backButton, { backgroundColor: theme.inputBg || 'rgba(0,0,0,0.05)' }]}
                >
                    <Icon name="arrow-back" size={22} color={theme.text} />
                </TouchableOpacity>

                <View style={{ flex: 1 }} />

                <TouchableOpacity style={styles.markAllBtn} onPress={handleMarkAllRead}>
                    <Text style={styles.markAllText}>Mark all</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.markAllBtn, { marginLeft: 16 }]} onPress={handleClearAll}>
                    <Text style={[styles.markAllText, { color: '#E53935' }]}>Clear all</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
                <Text style={[styles.largeTitle, { color: theme.text }]}>Notifications</Text>
            </View>

            <FlatList
                data={notifications}
                renderItem={(props) => (
                    <NotificationItem
                        {...props}
                        theme={theme}
                        navigation={navigation}
                        onMarkRead={handleMarkRead}
                        onClear={handleClear}
                    />
                )}
                keyExtractor={item => item._id}
                contentContainerStyle={[
                    styles.listContent,
                    notifications.length === 0 && { flex: 1, justifyContent: 'center' }
                ]}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={notifications.length > 0 ? <View style={{ height: 40 }} /> : null}
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <View style={[styles.emptyIconCircle, { backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' }]}>
                                <Icon name="notifications-off-outline" size={48} color={theme.textSecondary} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: theme.text }]}>No new notifications</Text>
                            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                                When you receive notifications, they will appear here.
                            </Text>
                        </View>
                    ) : null
                }
                refreshing={loading}
                onRefresh={fetchNotifications}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 10,
        zIndex: 10,
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
        color: '#111827',
        flex: 1,
        textAlign: 'center',
    },
    markAllBtn: {
        width: 60,
        alignItems: 'flex-end',
    },
    markAllText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
    },
    titleContainer: {
        paddingHorizontal: 24,
        marginBottom: 10,
    },
    largeTitle: {
        fontSize: 34,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    card: {
        flexDirection: 'row',
        padding: 16,
        marginBottom: 12,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    time: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
    },
    unreadText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    titleBadgeContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    unreadBadgeInline: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        marginLeft: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
        marginTop: 60,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        opacity: 0.7,
    },
    clearBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 4,
    }
});

export default Notifications;
