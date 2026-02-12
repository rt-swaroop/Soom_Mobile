import React, { useMemo } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList, Dimensions, Platform } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useAppTheme } from "../../theme/useAppTheme";
import { COLORS } from "../../theme/colors";

type Service = {
    id: string;
    label: string;
    icon: string;
};

interface AdminMoreOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (option: string) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('screen');

const adminServicesData: Service[] = [
    { id: "1", label: "Shifts", icon: "calendar-outline" },
    { id: "2", label: "Users", icon: "people-outline" },
];

const AdminMoreOptionsModal: React.FC<AdminMoreOptionsModalProps> = ({ visible, onClose, onSelect }) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const renderItem = ({ item }: { item: Service }) => (
        <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => onSelect(item.label)}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <Icon name={item.icon} size={28} color={COLORS.primary} />
            </View>
            <Text style={styles.itemLabel}>{item.label}</Text>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContainer}>
                            <View style={styles.header}>
                                <View style={styles.handle} />
                                <Text style={styles.title}>Admin Management</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <Icon name="close" size={24} color={theme.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <FlatList
                                data={adminServicesData}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                                contentContainerStyle={styles.listContent}
                                columnWrapperStyle={styles.columnWrapper}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const createStyles = (theme: any) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
        },
        modalContainer: {
            backgroundColor: theme.cardBg,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingBottom: Platform.OS === 'ios' ? 40 : 20,
            maxHeight: SCREEN_HEIGHT * 0.7,
        },
        header: {
            alignItems: 'center',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: theme.glassCardBorder,
        },
        handle: {
            width: 40,
            height: 4,
            backgroundColor: theme.glassCardBorder,
            borderRadius: 2,
            marginBottom: 10,
        },
        title: {
            fontSize: 18,
            fontWeight: '700',
            color: theme.text,
        },
        closeButton: {
            position: 'absolute',
            right: 20,
            top: 20,
        },
        listContent: {
            padding: 20,
        },
        columnWrapper: {
            justifyContent: 'flex-start',
            gap: 20,
        },
        itemContainer: {
            width: '28%',
            alignItems: 'center',
            marginBottom: 20,
        },
        iconContainer: {
            width: 60,
            height: 60,
            borderRadius: 20,
            backgroundColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
            borderWidth: 1,
            borderColor: theme.glassCardBorder,
        },
        itemLabel: {
            fontSize: 12,
            color: theme.text,
            textAlign: 'center',
            fontWeight: '600',
        },
    });

export default AdminMoreOptionsModal;
