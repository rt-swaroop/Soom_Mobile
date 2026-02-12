import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppTheme } from '../theme/useAppTheme';

const TimePickerInput = ({ label, time, setTime }: { label: string; time: string; setTime: (time: string) => void }) => {
    const { theme } = useAppTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: any, selectedTime?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedTime) {
            const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setTime(formattedTime);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)} activeOpacity={0.7}>
                <View pointerEvents="none">
                    <TextInput
                        value={time}
                        placeholder="Select Time"
                        editable={false}
                        placeholderTextColor={theme.textSecondary + '80'}
                        style={styles.input}
                    />
                </View>
            </TouchableOpacity>

            {showPicker && (
                <DateTimePicker
                    value={new Date()}
                    mode="time"
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

const createStyles = (theme: any) => StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 6,
        color: theme.text,
    },
    input: {
        backgroundColor: theme.cardBg,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.text === '#FFFFFF' ? 'rgba(255,255,255,0.1)' : '#E5E7EB',
        color: theme.text,
        fontSize: 14,
    },
});

export default TimePickerInput;