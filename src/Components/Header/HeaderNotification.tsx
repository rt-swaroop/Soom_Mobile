import React from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../../theme/colors';

import { ROUTES } from '../../navigation/routes';

import { RootStackParamList } from '../../navigation/AppNavigator';

import { useSelector } from 'react-redux';
import { selectUnreadCount } from '../../redux/selector';

interface HeaderNotificationProps {
}

const HeaderNotification: React.FC<HeaderNotificationProps> = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const unreadCount = useSelector(selectUnreadCount);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
            style={styles.container}
        >
            <Icon name="notifications" size={26} color={COLORS.white} />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#FF3B30',
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '900',
        textAlign: 'center',
    },
});

export default HeaderNotification;
