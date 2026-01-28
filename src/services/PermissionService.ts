import { Platform, PermissionsAndroid, Linking } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';

class PermissionService {

    async checkNotificationPermission() {
        const authStatus = await messaging().hasPermission();
        if (authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
            return 'granted';
        } else if (authStatus === messaging.AuthorizationStatus.DENIED) {
            return 'denied';
        }
        return 'undetermined';
    }

    async requestNotificationPermission() {
        const authStatus = await messaging().requestPermission();
        if (authStatus === messaging.AuthorizationStatus.DENIED) {
            if (Platform.OS === 'ios') {
                Linking.openURL('app-settings:');
            } else {
                openSettings();
            }
        }
        return authStatus;
    }

    async checkLocationPermission() {
        const permission = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

        return await check(permission);
    }

    async requestLocationPermission() {
        const permission = Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

        const result = await request(permission);
        if (result === RESULTS.BLOCKED) {
            openSettings();
        }
        return result;
    }

    async requestAndroidPostNotifications() {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
                );
                return granted;
            } catch (err) {
                console.warn(err);
                return 'denied';
            }
        }
        return 'granted';
    }

    openAppSettings() {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            openSettings();
        }
    }
}

export const permissionService = new PermissionService();
