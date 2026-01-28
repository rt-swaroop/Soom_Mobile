import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../config/api';
import API_ROUTES from '../services/constant';

import { permissionService } from '../services/PermissionService';

class FirebaseService {
    async requestUserPermission() {
        await permissionService.requestAndroidPostNotifications();
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:', authStatus);
            await this.getFcmToken();
        }
    }

    async getFcmToken() {
        try {
            let fcmToken = await AsyncStorage.getItem('fcmToken');
            if (!fcmToken) {
                fcmToken = await messaging().getToken();
                if (fcmToken) {
                    console.log('New FCM Token:', fcmToken);
                    await AsyncStorage.setItem('fcmToken', fcmToken);
                }
            }
            return fcmToken;
        } catch (error) {
            console.error('Error getting FCM token:', error);
            return null;
        }
    }

    async syncTokenWithBackend(userId: string) {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken && userId) {
                await api.post(`${API_ROUTES.AUTH}/fcm/token`, {
                    userId,
                    fcmToken
                });
                console.log('FCM Token synced with backend');
            }
        } catch (error) {
            console.error('Error syncing FCM token:', error);
        }
    }

    async deleteTokenFromBackend(userId: string) {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken && userId) {
                await api.post(`${API_ROUTES.AUTH}/fcm/token/delete`, {
                    userId,
                    fcmToken
                });
                console.log('FCM Token deleted from backend');
            }
        } catch (error) {
            console.error('Error deleting FCM token:', error);
        }
    }

    async displayForegroundNotification(remoteMessage: any) {
        const saved = await AsyncStorage.getItem('notification_preferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            if (!prefs.master) {
                console.log('Suppressing foreground notification as per user preferences');
                return;
            }
        }

        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });

        await notifee.displayNotification({
            title: remoteMessage.notification?.title || 'Notification',
            body: remoteMessage.notification?.body || '',
            android: {
                channelId,
                importance: AndroidImportance.HIGH,
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    listenToForegroundMessages() {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('Foreground Message received:', remoteMessage);
            await this.displayForegroundNotification(remoteMessage);
        });
        return unsubscribe;
    }

    listenToTokenRefresh(userId: string) {
        return messaging().onTokenRefresh(token => {
            console.log('FCM Token refreshed:', token);
            if (userId) {
                this.syncTokenWithBackend(userId);
            }
        });
    }
}

export const firebaseService = new FirebaseService();
