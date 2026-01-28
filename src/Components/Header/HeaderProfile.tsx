import React from 'react';
import { useSelector } from 'react-redux';

import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

import { IMAGES } from '../../assets/images';
import { ROLES } from '../../utils/constants';

import { COLORS } from '../../theme/colors';

import { selectUser } from '../../redux/selector';

const HeaderProfile = () => {
    const user = useSelector(selectUser);
    const navigation = useNavigation<any>();

    const isCompanyAdmin = user?.role === ROLES.COMPANY_ADMIN;

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ProfileStack')}
            style={styles.container}
        >
            <Image
                source={user?.profilePic?.location ? { uri: user?.profilePic?.location } : IMAGES.user}
                style={styles.profilePic}
            />
            {isCompanyAdmin && (
                <View style={styles.switchBadge}>
                    <Icon name="sync" size={10} color={COLORS.primary} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: 16,
        width: 38,
        height: 38,
        position: 'relative',
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilePic: {
        width: '100%',
        height: '100%',
        borderRadius: 17,
    },
    switchBadge: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        backgroundColor: COLORS.white,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export default HeaderProfile;
