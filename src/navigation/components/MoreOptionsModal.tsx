import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useAppTheme } from "../../theme/useAppTheme";
import { COLORS } from "../../theme/colors";

type Service = {
    id: string;
    label: string;
    icon: string;
};

type MoreOptionsModalProps = {
    visible: boolean;
    onClose: () => void;
    onSelect: (option: string) => void;
};

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

const servicesData: Service[] = [
    { id: "1", label: "Shifts", icon: "time-outline" },
    { id: "2", label: "Time-Off", icon: "alarm-outline" },
    // { id: "4", label: "To-do", icon: "checkbox-outline" },
    // { id: "5", label: "Projects", icon: "briefcase-outline" },
    // { id: "6", label: "Tasks", icon: "clipboard-outline" },
    // { id: "7", label: "Payroll", icon: "wallet-outline" },
    // { id: "8", label: "Posts", icon: "newspaper-outline" },
    // { id: "3", label: "Calendar", icon: "calendar-outline" },
    // { id: "10", label: "Expenses", icon: "cash-outline" },
    // { id: "11", label: "Export Data", icon: "cloud-download-outline" },
    // { id: "12", label: "Support", icon: "headset-outline" },
    // { id: "13", label: "Help", icon: "help-circle-outline" },
];

const MoreOptionsModal: React.FC<MoreOptionsModalProps> = ({ visible, onClose, onSelect }) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderItem = ({ item }: { item: Service }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
                onSelect(item.label);
                onClose();
            }}
        >
            <View style={styles.iconWrapper}>
                <Ionicons name={item.icon} size={32} color={theme.text === '#FFFFFF' ? '#FFFFFF' : COLORS.primary} />
            </View>
            <Text style={styles.itemLabel} numberOfLines={1}>
                {item.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection="down"
            propagateSwipe
            style={styles.modal}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
            statusBarTranslucent={true}
            deviceHeight={SCREEN_HEIGHT}
            coverScreen={true}
        >
            <View style={styles.container}>
                <View style={styles.handle} />

                <FlatList
                    data={servicesData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    numColumns={3}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </Modal>
    );
};

export default MoreOptionsModal;

const createStyles = (theme: any) => StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    container: {
        backgroundColor: theme.text === '#FFFFFF' ? '#1F2937' : '#FFFFFF',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "70%",
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.2)' : '#ccc',
        alignSelf: "center",
        marginBottom: 10,
    },
    row: {},
    itemContainer: {
        width: "30%",
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    iconWrapper: {
        backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : '#f5f5f5',
        borderRadius: 16,
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    itemLabel: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        color: theme.text,
    },
});