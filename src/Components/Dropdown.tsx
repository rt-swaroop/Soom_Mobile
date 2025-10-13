import React, { useState, useRef, useEffect } from 'react';

import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, Animated, Dimensions, TextInput } from 'react-native';

import { COLORS } from '../theme/colors';

const { height } = Dimensions.get('window');

interface DropdownItem {
    label: string;
    value: string;
}

interface DropdownProps {
    label: string;
    value: string;
    items: DropdownItem[];
    placeholder?: string;
    onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, value, items, placeholder = 'Select an option', onSelect }) => {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState('');
    const [filteredItems, setFilteredItems] = useState(items);

    const slideAnim = useRef(new Animated.Value(height)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setFilteredItems(
            items.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, items]);

    const openSheet = () => {
        setVisible(true);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 8,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const closeSheet = () => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: height,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => setVisible(false));
    };

    const handleSelect = (item: DropdownItem) => {
        onSelect(item.value);
        closeSheet();
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity style={styles.dropdown} onPress={openSheet} activeOpacity={0.8}>
                <Text style={[styles.valueText, !value && { color: COLORS.gray3 }]}>
                    {value || placeholder}
                </Text>
            </TouchableOpacity>

            <Modal transparent visible={visible} animationType="none">
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                    <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeSheet} />
                    <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
                        <View style={styles.headerBar} />
                        <TextInput placeholder="Search..." style={styles.searchInput} placeholderTextColor={COLORS.gray2}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <FlatList
                            data={filteredItems}
                            keyExtractor={(item) => item.value}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.option, item.value === value && { backgroundColor: COLORS.primary }]}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={[styles.optionText, item.value === value && { color: COLORS.white, fontWeight: '600' }]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </Animated.View>
                </Animated.View>
            </Modal>
        </View>
    );
};

export default Dropdown;

const styles = StyleSheet.create({
    container: {
        marginBottom: 0
    },
    label: {
        fontSize: 14,
        color: COLORS.primaryDark,
        marginBottom: 6,
        fontWeight: '600'
    },
    dropdown: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 10,
        justifyContent: 'center',
    },
    valueText: {
        fontSize: 15,
        color: COLORS.primaryDark
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end'
    },
    bottomSheet: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        paddingBottom: 20,
        maxHeight: height * 0.55,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    headerBar: {
        width: 50,
        height: 5,
        borderRadius: 3,
        backgroundColor: COLORS.gray2,
        alignSelf: 'center',
        marginBottom: 10,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: COLORS.gray2,
        borderRadius: 8,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: COLORS.primaryDark,
    },
    option: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 4,
    },
    optionText: {
        fontSize: 15,
        color: COLORS.primaryDark
    },
});