import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from "react-native-vector-icons/MaterialIcons";

import { useAppTheme } from "../../../theme/useAppTheme";
import { createStyles } from "../Profile.styles";
import { COLORS } from "../../../theme/colors";
import { setThemeMode, ThemeMode } from "../../../redux/reducers/settingsReducer";

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

interface ThemeSelectionModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const ThemeSelectionModal = ({ isVisible, onClose }: ThemeSelectionModalProps) => {
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();
    const { theme, themeMode } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const handleThemeSelect = (mode: ThemeMode) => {
        dispatch(setThemeMode(mode));
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            style={styles.modalOverlay}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            statusBarTranslucent={true}
            deviceHeight={SCREEN_HEIGHT}
            coverScreen={true}
        >
            <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>App Theme</Text>
                <Text style={styles.modalMessage}>Choose how the app looks on your device.</Text>

                <View style={styles.themeOptionList}>
                    {[
                        { id: 'light', label: 'Light Mode', icon: 'light-mode' },
                        { id: 'dark', label: 'Dark Mode', icon: 'dark-mode' },
                        { id: 'system', label: 'System Default', icon: 'settings-brightness' },
                    ].map((item) => {
                        const isActive = themeMode === item.id;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[styles.themeOption, isActive && styles.themeOptionActive]}
                                onPress={() => handleThemeSelect(item.id as ThemeMode)}
                            >
                                <View style={styles.themeOptionContent}>
                                    <View style={styles.themeOptionIconWrapper}>
                                        <Icon
                                            name={item.icon}
                                            size={22}
                                            color={isActive ? COLORS.primary : '#6B7280'}
                                        />
                                    </View>
                                    <Text style={[styles.themeOptionText, isActive && styles.themeOptionTextActive]}>
                                        {item.label}
                                    </Text>
                                </View>
                                {isActive && (
                                    <Icon name="check-circle" size={24} color={COLORS.primary} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </Modal>
    );
};

export default ThemeSelectionModal;
