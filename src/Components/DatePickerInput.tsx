import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerInput = ({ label, date, setDate }: { label: string; date: Date | null; setDate: (d: Date) => void }) => {
    const [showPicker, setShowPicker] = useState(false);

    const onChange = (event: any, selectedDate?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (selectedDate) setDate(selectedDate);
    };

    const displayDate = date ? date.toLocaleDateString('en-GB') : '';

    return (
        <View>
            <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <TextInput
                    value={displayDate}
                    placeholder="DD/MM/YYYY"
                    style={{
                        backgroundColor: '#fff',
                        padding: 12,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                    }}
                    editable={false}
                />
            </TouchableOpacity>
            {showPicker && (
                <DateTimePicker
                    value={date || new Date()}
                    mode="date"
                    display="default"
                    onChange={onChange}
                />
            )}
        </View>
    );
};

export default DatePickerInput;