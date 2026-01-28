import React, { useMemo } from 'react';

import { View, Text, TouchableOpacity, Linking, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppTheme } from '../../../theme/useAppTheme';
import { createStyles } from './UpdateRequiredScreen.styles';
import { COLORS } from '../../../theme/colors';

interface UpdateRequiredScreenProps {
    route?: {
        params?: {
            updateUrl?: string;
            message?: string;
        }
    }
}

const UpdateRequiredScreen = ({ route }: UpdateRequiredScreenProps) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const updateUrl = route?.params?.updateUrl || "https://play.google.com/store/apps/details?id=com.soom";
    const customMessage = route?.params?.message || "A new version of Soom is available with critical updates and improvements. Please update to continue using the app.";

    const handleUpdate = () => {
        Linking.openURL(updateUrl).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <LinearGradient
            colors={[theme.gradientStart, theme.gradientEnd]}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Icon name="system-update" size={60} color={COLORS.white} />
                </View>

                <Text style={styles.title}>Update Required</Text>
                <Text style={styles.description}>
                    {customMessage}
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleUpdate} activeOpacity={0.8}>
                    <LinearGradient
                        colors={[COLORS.primary, '#4c669f']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Update Now</Text>
                        <Icon name="open-in-new" size={20} color={COLORS.white} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default UpdateRequiredScreen;
