import React, { useMemo } from "react";

import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from "../../../theme/useAppTheme";
import { createStyles } from "../Profile.styles";

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

interface LogoutModalProps {
    isVisible: boolean;
    onClose: () => void;
    onLogout: () => void;
}

const LogoutModal = ({ isVisible, onClose, onLogout }: LogoutModalProps) => {
    const insets = useSafeAreaInsets();
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

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
                <Text style={styles.modalTitle}>Sign Out?</Text>
                <Text style={styles.modalMessage}>Are you sure you want to log out? You will need to sign in again to access your account.</Text>

                <View style={styles.modalActionButtons}>
                    <TouchableOpacity
                        style={[styles.modalBtn, styles.cancelBtn]}
                        onPress={onClose}
                    >
                        <Text style={styles.cancelBtnText}>Stay Logged In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modalBtn, styles.confirmBtn]}
                        onPress={onLogout}
                    >
                        <Text style={styles.confirmBtnText}>Yes, Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default LogoutModal;
