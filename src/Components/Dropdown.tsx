import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import { COLORS } from '../theme/colors';
import { useAppTheme, Theme } from '../theme/useAppTheme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface DropdownItem {
    label: string;
    value: string;
    icon?: string;
}

interface DropdownProps {
    label?: string;
    value: string;
    items: DropdownItem[];
    placeholder?: string;
    title?: string;
    message?: string;
    onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, items, placeholder = 'Select an option', title, message, onSelect }) => {
    const { theme } = useAppTheme();
    const insets = useSafeAreaInsets();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');

    const filteredItems = useMemo(() => {
        if (!search) return items;
        return items.filter(item =>
            item.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, items]);

    const handleSelect = (item: DropdownItem) => {
        onSelect(item.value);
        setVisible(false);
    };

    const selectedItem = items.find(i => i.value === value);

    return (
        <View style={styles.container}>
            {label ? <Text style={styles.label}>{label}</Text> : null}

            <TouchableOpacity
                style={styles.dropdownTrigger}
                onPress={() => setVisible(true)}
                activeOpacity={0.7}
            >
                <Text style={[styles.triggerText, !value && { color: theme.textSecondary + '80' }]}>
                    {selectedItem?.label || placeholder}
                </Text>
                <MIcon
                    name="keyboard-arrow-down"
                    size={22}
                    color={theme.textSecondary}
                />
            </TouchableOpacity>

            <Modal
                isVisible={visible}
                onBackdropPress={() => setVisible(false)}
                onSwipeComplete={() => setVisible(false)}
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

                    {title && <Text style={styles.modalTitle}>{title}</Text>}
                    {message && <Text style={styles.modalMessage}>{message}</Text>}

                    {items.length > 8 && (
                        <View style={styles.searchWrapper}>
                            <MIcon name="search" size={20} color={theme.textSecondary} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search..."
                                style={styles.searchInput}
                                placeholderTextColor={theme.textSecondary + '70'}
                                value={search}
                                onChangeText={setSearch}
                                clearButtonMode="while-editing"
                            />
                        </View>
                    )}

                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.value}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                        renderItem={({ item }) => {
                            const isActive = item.value === value;
                            return (
                                <TouchableOpacity
                                    style={[styles.optionItem, isActive && styles.optionItemActive]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <View style={styles.optionContent}>
                                        {item.icon && (
                                            <View style={styles.optionIconWrapper}>
                                                <MIcon
                                                    name={item.icon}
                                                    size={22}
                                                    color={isActive ? COLORS.primary : theme.textSecondary}
                                                />
                                            </View>
                                        )}
                                        <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                                            {item.label}
                                        </Text>
                                    </View>
                                    {isActive && (
                                        <MIcon name="check-circle" size={22} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default Dropdown;

const createStyles = (theme: Theme) => {
    const isDark = theme.text === '#FFFFFF';

    return StyleSheet.create({
        container: {
            width: '100%',
        },
        label: {
            fontSize: 14,
            color: theme.textSecondary,
            marginBottom: 8,
            fontWeight: '700',
        },
        dropdownTrigger: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.inputBg,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            borderRadius: 12,
            paddingVertical: 14,
            paddingHorizontal: 16,
        },
        triggerText: {
            fontSize: 15,
            color: theme.text,
            fontWeight: '600',
        },
        modalOverlay: {
            margin: 0,
            justifyContent: 'flex-end',
        },
        modalContent: {
            backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
            paddingTop: 12,
            paddingHorizontal: 20,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            maxHeight: SCREEN_HEIGHT * 0.85,
        },
        modalHandle: {
            width: 40,
            height: 4,
            backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : '#E5E7EB',
            borderRadius: 2,
            alignSelf: 'center',
            marginBottom: 20,
        },
        modalTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: theme.text,
            textAlign: 'center',
            marginBottom: 8,
        },
        modalMessage: {
            fontSize: 14,
            color: theme.textSecondary,
            textAlign: 'center',
            marginBottom: 20,
            paddingHorizontal: 10,
        },
        searchWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F3F4F6',
            borderRadius: 12,
            paddingHorizontal: 12,
            marginBottom: 16,
        },
        searchIcon: {
            marginRight: 8,
        },
        searchInput: {
            flex: 1,
            height: 44,
            fontSize: 15,
            color: theme.text,
        },
        listContent: {
            paddingBottom: 20,
        },
        optionItem: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 16,
            marginBottom: 8,
            backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#F9FAFB',
            borderWidth: 1.5,
            borderColor: 'transparent',
        },
        optionItemActive: {
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
            borderColor: COLORS.primary,
        },
        optionContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        optionIconWrapper: {
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
        },
        optionText: {
            fontSize: 16,
            fontWeight: '600',
            color: isDark ? 'rgba(255,255,255,0.7)' : '#4B5563',
        },
        optionTextActive: {
            color: COLORS.primary,
            fontWeight: '700',
        },
    });
};